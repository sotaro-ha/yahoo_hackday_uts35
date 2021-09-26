from flask import Flask, request
import xmltodict
import pandas as pd
import json
import requests
import datetime

with open('auth_config.json', 'r') as f:
    settings = json.load(f)

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers',
                         'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET,PUT,POST,DELETE')
    return response

@app.route('/search/eventReleases')
def searchEvents():
    url = "https://gw-api.monet-technologies.co.jp/pia/1.1/event_releases/full"
    params = {
        "prefecture_code": 13, # 東京
        "latitude": 35.6809591, # 緯度
        "longitude": 139.7673068, # 経度
        "range": 2500, # 検索範囲(m)、緯度経度を中心とする5000m矩形で絞る
        "datum": 2, # 入力緯度経度は世界測位系
        "perform_within": "01" # 7日以内に行われるイベントを抽出
    }
    headers = {
        "Content-type": "application/xml",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'End-User-Agent': 'MONET-TEST'
    }
    res = requests.get(url, params=params, headers=headers)
    res = res.text

    resDict = xmltodict.parse(res)
    eventReleaseList = resDict["result"]["eventReleases"]["eventRelease"]
    approxVenueEventsDict = {}
    venuesDict = {}

    for eventRelease in eventReleaseList:
        event = eventRelease["event"]
        resEvent = {
            "mainTitle": event["mainTitle"],
            "eventCode": event["eventCode"],
            "lGenreCode": event["lGenreCode"],
            "lGenreName": event["lGenreName"],
            "sGenreCode": event["sGenreCode"],
            "sGenreName": event["sGenreName"],
            "eventUrlPc": event["eventUrlPc"]
        }
        if "promotionPartsPcs" in event.keys():
            resEvent["promotionPartsPcs"] = event["promotionPartsPcs"]["promotionPartsPc"]
            if not isinstance(resEvent["promotionPartsPcs"], list):
                resEvent["promotionPartsPcs"] = [resEvent["promotionPartsPcs"]]
        if "shortCatch" in event.keys():
            resEvent["shortCatch"] = event["shortCatch"]
        if "imageUrlXls" in event.keys():
            resEvent["imageUrls"] = event["imageUrlXls"]["imageUrlXl"]
            if not isinstance(resEvent["imageUrls"], list):
                resEvent["imageUrls"] = [resEvent["imageUrls"]]
            for i, imageUrlXl in enumerate(resEvent["imageUrls"]):
                resEvent["imageUrls"][i] = imageUrlXl["imageUrl"]

        release = eventRelease["release"]
        resRelease = {
            "releaseUrlPc": release["releaseUrlPc"]
        }

        resPerforms = []
        performList = eventRelease["performs"]["perform"]
        if not isinstance(eventRelease["performs"]["perform"], list):
            performList = [eventRelease["performs"]["perform"]]

        venueDict = {}

        for perform in performList:
            venue = perform["venue"]
            # 会場情報が足りない、あるいはエリア外の公演を排除する
            if ("worldLatitude" not in venue.keys()) or ("worldLongitude" not in venue.keys()):
                continue
            # 以下のように公演を位置情報で絞り込む処理も必要に応じて入れる
            # if (35.663247 > float(venue["worldLatitude"])) or (139.736569 > float(venue["worldLongitude"])) or (35.701173 < float(venue["worldLatitude"])) or (139.799054 < float(venue["worldLongitude"])):
            #  continue
            venueCode = venue["venueCode"]
            if venueCode not in venueDict.keys():
                venueDict[venueCode] = {}
                venueDict[venueCode]["performs"] = []
                venueDict[venueCode]["venue"] = {
                    "venueName": venue["venueName"],
                    "venueCode": venue["venueCode"],
                    "worldLatitude": float(venue["worldLatitude"]),
                    "worldLongitude": float(venue["worldLongitude"]),
                }

            resPerform = {
                "performCode": perform["performCode"]
            }
            if "performTitle" in perform.keys():
                resPerform["performTitle"] = perform["performTitle"]
            if "performDate" in perform.keys():
                resPerform["performDate"] = perform["performDate"]
            if "performTermFrom" in perform.keys():
                resPerform["performTermFrom"] = perform["performTermFrom"]
            if "performTermEnd" in perform.keys():
                resPerform["performTermEnd"] = perform["performTermEnd"]
            if "openTime" in perform.keys():
                resPerform["openTime"] = perform["openTime"]
            if "performStartTime" in perform.keys():
                resPerform["performStartTime"] = perform["performStartTime"]
            venueDict[venueCode]["performs"].append(resPerform)

        for venueCode in venueDict.keys():
            approxLatCode = hash(
                round(venueDict[venueCode]["venue"]["worldLatitude"], 4))
            approxLngCode = hash(
                round(venueDict[venueCode]["venue"]["worldLongitude"], 4))
            approxLatLngCode = f"{approxLatCode}-{approxLngCode}"
            if approxLatLngCode not in approxVenueEventsDict.keys():
                approxVenueEventsDict[approxLatLngCode] = {}
                approxVenueEventsDict[approxLatLngCode]["point"] = {
                    "cd": approxLatLngCode,
                    "lat": round(venueDict[venueCode]["venue"]["worldLatitude"], 4),
                    "lng": round(venueDict[venueCode]["venue"]["worldLongitude"], 4)
                }
                approxVenueEventsDict[approxLatLngCode]["events"] = []
            approxVenueEventsDict[approxLatLngCode]["events"].append({
                "event": resEvent,
                "release": resRelease,
                "performs": venueDict[venueCode]["performs"],
                "venue": venueDict[venueCode]["venue"]
            })

    resEventReleases = []
    for approxLatLonCode in approxVenueEventsDict.keys():
        resEventReleases.append({
            "point": approxVenueEventsDict[approxLatLonCode]["point"],
            "events": approxVenueEventsDict[approxLatLonCode]["events"]
        })

    return {"eventReleases": resEventReleases}


@app.route('/search/points', methods=["GET"])
def searchPoints():
    url = "https://gw-api.monet-technologies.co.jp/drt/api/v1/points"
    headers = {
        "Content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'Authorization': request.headers.get("Authorization")
    }
    res = requests.get(url, headers=headers)
    res = res.text
    points = json.loads(res)

    return {"points": points}


@app.route('/search/train', methods=["GET"])
def searchTrain():
    f = request.args.get('from')
    t = request.args.get('to')
    date = request.args.get('date')
    time = request.args.get('time')
    searchType = "arrival"
    url = "http://api.ekispert.jp/v1/json/search/course/light"
    params = {
        'from': f,
        'to': t,
        'date': date,
        'time': time,
        'searchType': searchType,
        'key': settings["VAL_KEY"]
    }
    res = requests.get(url, params=params)
    data = res.json()
    if "ResultSet" in data.keys():
        if "ResourceURI" in data["ResultSet"]:
            resUri = data["ResultSet"]["ResourceURI"]
            res = {
                "resUri": resUri,
                "routes": []
            }
            return res
        else:
            return {"routes": []}
    else:
        return {"routes": []}

@app.route('/search/walk', methods=["GET"])
def searchWalk():
    f = request.args.get('from')
    t = request.args.get('to')
    f_split = f.split(',')
    t_split = t.split(',')
    f_lat = round(float(f_split[0]), 4)
    f_lng = round(float(f_split[1]), 4)
    t_lat = round(float(t_split[0]), 4)
    t_lng = round(float(t_split[1]), 4)

    url = "https://gw-api.monet-technologies.co.jp/zdc/test/zmaps/api/apicore/core/v1_0/route/walk"
    headers = {
        "Content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"]
    }
    params = {
        'from': f"{f_lat},{f_lng}",
        'to': f"{t_lat},{t_lng}",
        "datum": "WGS84"
    }

    if f_lat == t_lat and f_lng == t_lng:
        res = {
            "status": {
                "code": "0000",
                "text": "正常終了"
            },
            "route": {
                "distance": 0,
                "link": []
            }
        }
    else:
        res = requests.get(url, headers=headers, params=params)
        res = res.json()
    return res


@app.route('/search/reservations', methods=["POST"])
def searchReservations():
    url = "https://gw-api.monet-technologies.co.jp/drt/api/v1/search/reservations"
    headers = {
        "content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'Authorization': request.headers.get("Authorization")
    }
    res = requests.post(url, json=request.json, headers=headers)
    candidate = json.loads(res.text)

    return {"candidate": candidate}


@app.route('/reserve', methods=["POST"])
def reserve():
    url = "https://gw-api.monet-technologies.co.jp/drt/api/v1/reservations"
    headers = {
        "content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'Authorization': request.headers.get("Authorization")
    }
    res = requests.post(url, json=request.json, headers=headers)
    reservation = json.loads(res.text)
    return reservation


@app.route('/cancel', methods=["POST"])
def cancel():
    rsv_id = request.json["reservation_id"]
    url = f"https://gw-api.monet-technologies.co.jp/drt/api/v1/reservations/{rsv_id}"
    headers = {
        "content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'Authorization': request.headers.get("Authorization")
    }
    data = {
        "adult_count": request.json["adult_count"],
        "child_count": request.json["child_count"],
        "status": 0  # 予約のステータスを0(キャンセル状態に変更する)
    }
    res = requests.put(url, json=data, headers=headers)
    reservation = json.loads(res.text)
    return reservation


@app.route('/ride', methods=["POST"])
def ride():
    rsv_id = request.json["reservation_id"]
    url = f"https://gw-api.monet-technologies.co.jp/drt/api/v1/reservations/{rsv_id}"
    headers = {
        "content-type": "application/json",
        'X-MONET-APIKey': settings["MONET_KEY"],
        'Authorization': request.headers.get("Authorization")
    }
    data = {
        "adult_count": request.json["adult_count"],
        "child_count": request.json["child_count"],
        "status": 2  # 予約のステータスを2(搭乗済状態に変更する)
    }
    res = requests.put(url, json=data, headers=headers)
    reservation = json.loads(res.text)
    return reservation


if __name__ == "__main__":
    app.run(debug=True, port=15050)