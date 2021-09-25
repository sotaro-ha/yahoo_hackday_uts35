<!--マップコンポーネント-->
<template>
  <div style="height: 80vh; width: 100%">
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      style="z-index: 0;"
      :class="$style.map"
    >
      <!-- 地図タイル -->
      <l-tile-layer :url="url" :attribution="attribution" />

      <!-- コントロールパネル(今回はジャンルによるイベントの絞り込み) -->
      <l-control :class="$style.customControl">
        <v-card flat>
          <v-select
            v-model="selectedGenres"
            :items="genreItems()"
            attach
            chips
            label="ジャンル"
            multiple
            v-if="controlExpanded"
          >
            <template v-slot:append-outer>
              <v-btn icon @click="controlExpanded = !controlExpanded">
                <v-icon>mdi-cog-off-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:append-item>
              <v-list-item ripple @click="clearSelectedGenres">
                <v-list-item-action>
                  <v-icon>
                    mdi-delete
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Clear
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
          <v-btn
            icon
            @click="controlExpanded = !controlExpanded"
            v-if="!controlExpanded"
          >
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </v-card>
      </l-control>

      <!-- イベント情報用ピン群 -->
      <l-feature-group v-if="mode == 'detail'" ref="eventPinsFeatureGroup">
        <l-marker
          v-for="pin in visiableEventPins()"
          :key="`marker-${pin.properties.id}`"
          :lat-lng="
            latlon(pin.geometry.coordinates[1], pin.geometry.coordinates[0])
          "
          @click="innerClick(pin)"
          :ref="`marker-${pin.properties.id}`"
        >
          <l-icon :icon-anchor="staticAnchor" :class-name="$style.eventMarker">
            <v-icon dense>mdi-balloon</v-icon>
          </l-icon>
          <l-popup :options="{ autoClose: false }">
            <events-card
              :eventInfoArray="pin.properties.events"
              @selected="setDestination"
            >
            </events-card>
          </l-popup>
        </l-marker>
      </l-feature-group>

      <!-- 経路情報用ピン群 -->
      <l-feature-group v-else-if="mode == 'route'">
        <l-marker
          :lat-lng="
            latlon(
              destination.eventInfo.venue.worldLatitude,
              destination.eventInfo.venue.worldLongitude
            )
          "
          ref="destination"
        >
          <l-icon
            :icon-anchor="destinationAnchor"
            :class-name="$style.destinationMarker"
          >
            <v-icon dense>mdi-balloon</v-icon>
          </l-icon>
          <l-popup :options="{ autoClose: false }">
            <route-card
              :stationPoints="getDeparturePoints()"
              :destinationPoints="getArrivalPoints()"
              :selectedDptPointIdValue.sync="selectedDptPointId"
              :selectedArvPointIdValue.sync="selectedArvPointId"
              :targetDateTimeItems="targetDateTimeItems"
              :walkDistance="walkDistance"
              @changedSelectedDptPointId="updateActiveDptPoint"
              @changedSelectedArvPointId="updateActiveArvPoint"
            >
            </route-card>
          </l-popup>
        </l-marker>
        <!-- 乗車地点用ピン -->
        <l-marker
          v-for="pin in getDeparturePoints()"
          :key="`dpt-marker-${pin.properties.id}`"
          :lat-lng="
            latlon(pin.geometry.coordinates[1], pin.geometry.coordinates[0])
          "
          :ref="`dpt-marker-${pin.properties.id}`"
          @click="clickedDeparturePoint(pin)"
        >
          <l-icon :class-name="$style.dptMarker">
            <v-icon>mdi-train-car</v-icon>
          </l-icon>
          <l-tooltip :options="{ direction: 'top' }">
            {{ pin.properties.name }}
          </l-tooltip>
        </l-marker>
        <!-- 降車地点用ピン -->
        <l-marker
          v-for="pin in getArrivalPoints()"
          :key="`arv-marker-${pin.properties.id}`"
          :lat-lng="
            latlon(pin.geometry.coordinates[1], pin.geometry.coordinates[0])
          "
          :ref="`arv-marker-${pin.properties.id}`"
          @click="clickedArrivalPoint(pin)"
        >
          <l-icon :class-name="$style.arvMarker">
            <v-icon dense>mdi-check</v-icon>
          </l-icon>
          <l-tooltip :options="{ direction: 'top' }">
            {{ pin.properties.name }}
          </l-tooltip>
        </l-marker>
        <!-- 徒歩ルート用GetJsonオブジェクト -->
        <l-geo-json :geojson="walkLine" ref="walkLine"></l-geo-json>
      </l-feature-group>
    </l-map>
  </div>
</template>

<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import BaseComponent from '@/components/BaseComponent.vue';
import axios from 'axios';
import {
  GeoFeatureAggregatedEventPoint,
  GeoFeatureDRTPoint,
  EventInfoProps,
  PerformProps
} from '@/types/utils';
import EventsCard from '@/components/EventsCard.vue';
import RouteCard from '@/components/RouteCard.vue';
// Leafletを読み込み
import 'leaflet/dist/leaflet.css';
import { latLng, Icon } from 'leaflet';
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LPolyline,
  LIcon,
  LFeatureGroup,
  LGeoJson,
  LControl
} from 'vue2-leaflet';
import { Prop, PropSync, Watch } from 'vue-property-decorator';
import moment from 'moment';
// デフォルトマーカーアイコン設定
// The following helps to avoid "net::ERR_INVALID_URL" errors in Chromium-like browsers without the need to unnecessarily import the files.
Icon.Default.prototype.options.imagePath = '.';
Icon.Default.prototype.options.iconUrl = '';
Icon.Default.prototype.options.shadowUrl = '';

@Mixin({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip,
    LPopup,
    LPolyline,
    LIcon,
    LFeatureGroup,
    LGeoJson,
    LControl,
    EventsCard,
    RouteCard
  }
})
export default class MapPane extends Mixins<BaseComponent>(BaseComponent) {
  // 徒歩経路を表すGeoJson
  // サンプルとしてデータを入れた状態で初期化
  walkLine = {
    type: 'Feature',
    properties: { name: 'Polylineサンプル' },
    geometry: {
      type: 'LineString',
      coordinates: [[139.7403645515442, 35.628419084184706]]
    }
  };
  walkDistance = 0;

  zoom = 13;
  center = latLng(35.6809591, 139.7673068);
  url = 'https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png';
  attribution =
    '&copy; <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>';
  currentZoom = this.zoom;
  currentCenter = this.center;
  mapOptions = {
    zoomSnap: 0.5
  };

  staticAnchor = [16, 37];
  destinationAnchor = [20, 45];

  selectedPoint?: GeoFeatureAggregatedEventPoint;

  destination?: {
    eventInfo: EventInfoProps;
    perform: PerformProps;
  };
  targetDateTimeItems = [] as Array<{ text: string; value: Date }>;
  goalLatLng = '';

  @Prop({ default: () => [] })
  eventPins?: GeoFeatureAggregatedEventPoint[];

  drtPointPins = [] as Array<GeoFeatureDRTPoint>;

  controlExpanded = false;

  selectedDptPointId = -1;
  selectedArvPointId = -1;
  updateActiveDptPoint(oldId: number, newId: number) {
    const _markerOld = this.$refs[`dpt-marker-${oldId}`] as any;
    //前まで選択されていたポイントを非アクティブにする
    if (_markerOld) {
      const marker = _markerOld[0] as LMarker;
      if (marker) {
        marker.mapObject.getIcon().options.className = this.$style.dptMarker;
        marker.mapObject.setIcon(marker.mapObject.getIcon());
      }
    }

    const _markerNew = this.$refs[`dpt-marker-${newId}`] as any;
    //選択されたポイントをアクティブにする
    if (_markerNew) {
      const marker = _markerNew[0] as LMarker;
      if (marker) {
        marker.mapObject.getIcon().options.className = this.$style.dptMarkerActive;
        marker.mapObject.setIcon(marker.mapObject.getIcon());
      }
    }
  }

  async updateActiveArvPoint(oldId: number, newId: number) {
    const _markerOld = this.$refs[`arv-marker-${oldId}`] as any;

    //前まで選択されていたポイントを非アクティブにする
    if (_markerOld) {
      const marker = _markerOld[0] as LMarker;
      if (marker) {
        marker.mapObject.getIcon().options.className = this.$style.arvMarker;
        marker.mapObject.setIcon(marker.mapObject.getIcon());
      }
    }

    const _markerNew = this.$refs[`arv-marker-${newId}`] as any;
    //選択されたポイントをアクティブにする
    if (_markerNew) {
      const marker = _markerNew[0] as LMarker;
      if (marker) {
        marker.mapObject.getIcon().options.className = this.$style.arvMarkerActive;
        marker.mapObject.setIcon(marker.mapObject.getIcon());
      }
    }

    //選択されたポイントから目的地までの歩行ルートを算出する
    const pin = this.drtPointPins?.find(e => e.properties.id == newId);
    if (pin) {
      const headers = {
        'Content-Type': 'application/json;charset=UTF-8'
      };
      const params = {
        from:
          String(pin.geometry.coordinates[1]) +
          ',' +
          String(pin.geometry.coordinates[0]),
        to: this.goalLatLng
      };

      const res = await axios.get('/api/search/walk', {
        headers: headers,
        params: params
      });

      const links = res.data.route.link as Array<any>;
      const arr = links.flatMap(e => e.line.latlon);
      const newArr = [];
      while (arr.length) newArr.push(arr.splice(0, 2));
      newArr.forEach(e => (e = e.reverse()));
      this.walkLine = {
        type: 'Feature',
        properties: { name: '歩行ルート' },
        geometry: {
          type: 'LineString',
          coordinates: newArr
        }
      };
      this.walkDistance = res.data.route.distance;

      const geoJson = this.$refs['walkLine'] as LGeoJson;
      geoJson.setGeojson(this.walkLine);
    }
  }

  @PropSync('modeValue', { type: String }) mode?: string;
  @Watch('mode')
  async watchMode() {
    // 経路検索に入るタイミングでポイント情報を取得
    if (this.mode == 'route') {
      // IDトークンを取得していなければ取得
      if (this.store.accountInfo.idToken.length <= 0) {
        const idToken = (await this.$auth.getIdTokenClaims()).__raw as string;
        const accountInfo = {
          idToken: idToken
        };
        this.store.setAccountInfo({ accountInfo: accountInfo });
      }

      const headers = {
        Authorization: 'Bearer ' + this.store.accountInfo.idToken,
        'Content-Type': 'application/json;charset=UTF-8'
      };

      axios
        .get('/api/search/points', {
          headers: headers
        })
        .then(e => {
          const points = e.data.points;

          const b = points.map((e: any) => {
            const point = e as {
              Latitude: number;
              Longitude: number;
              id: number;
              name: string;
              description: string;
              search_word: string;
            };
            const props = {
              id: point.id,
              name: point.name,
              description: point.description,
              search_word: point.search_word
            };
            const geo = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [point.Longitude, point.Latitude]
              }
            };

            return { ...geo, properties: props };
          });
          b.sort(
            (a: any, b: any) =>
              b.geometry.coordinates[1] - a.geometry.coordinates[1]
          );
          this.drtPointPins = b;
        });
    }
  }

  @PropSync('selectedPointCodeValue', { type: String })
  selectedPointCode!: string;
  @Watch('selectedPointCode')
  async watchSelectedPointCode() {
    this.selectedPoint = this.eventPins?.find(
      e => e.properties.id == this.selectedPointCode
    );
    setTimeout(this.showSelectedPointPopup, 500);
  }
  @PropSync('selectedEventCodeValue', { type: String })
  selectedEventCode!: string;

  showSelectedPointPopup() {
    if (this.selectedPoint) {
      const _marker = this.$refs[
        `marker-${this.selectedPoint.properties.id}`
      ] as any;
      const marker = _marker[0] as LPopup;
      marker.mapObject.openPopup();
    }
  }
  showAllPointPopup() {
    if (this.eventPins) {
      for (const pin of this.eventPins) {
        const center = latLng(
          pin.geometry.coordinates[1],
          pin.geometry.coordinates[0]
        );
        const features = this.$refs[`feature-${pin.properties.id}`] as any;
        const feature = features[0] as LFeatureGroup;
        feature.mapObject.openPopup(center);
      }
    }
  }

  innerClick(e: GeoFeatureAggregatedEventPoint) {
    this.selectedPointCode = e.properties.id;
    this.selectedEventCode = e.properties.events[0].event.eventCode;
    this.selectedPoint = this.eventPins?.find(
      e => e.properties.id == this.selectedPointCode
    );
  }
  mounted() {
    //console.log(this.pins);
  }
  latlon(lat: number, lon: number) {
    const latlon = latLng(lat, lon);
    return latlon;
  }
  setDestination(payload: {
    eventInfo: EventInfoProps;
    perform: PerformProps;
  }) {
    // 描画モードをルート表示に切り替える
    this.mode = 'route';
    // 目的イベントを設定
    this.destination = payload;
    // 到着目標時刻になり得るリストを作成
    this.targetDateTimeItems = [];
    const openDateTime =
      payload.perform.performDate + ' ' + payload.perform.openTime;
    const startDateTime =
      payload.perform.performDate + ' ' + payload.perform.performStartTime;
    const a = moment(openDateTime, 'YYYYMMDD HH:mm');
    if (a.isValid()) {
      this.targetDateTimeItems.push({
        text: a.format('YY-MM-DD HH:mm（開場時刻）'),
        value: a.toDate()
      });
    }
    const b = moment(startDateTime, 'YYYYMMDD HH:mm');
    if (b.isValid()) {
      this.targetDateTimeItems.push({
        text: b.format('YY-MM-DD HH:mm（開演時刻）'),
        value: b.toDate()
      });
    }
    // 目標地点となる座標を設定
    this.goalLatLng =
      String(payload.eventInfo.venue.worldLatitude) +
      ',' +
      String(payload.eventInfo.venue.worldLongitude);
  }
  getDeparturePoints() {
    if (this.drtPointPins) {
      return this.drtPointPins?.filter(e => e.properties.search_word == '駅');
    } else return [];
  }
  getArrivalPoints() {
    if (this.drtPointPins) {
      return this.drtPointPins?.filter(
        e => e.properties.search_word == 'イベント会場付近'
      );
    } else return [];
  }

  clickedDeparturePoint(pin: GeoFeatureDRTPoint) {
    const oldId = this.selectedDptPointId;
    this.selectedDptPointId = pin.properties.id;
    this.updateActiveDptPoint(oldId, this.selectedDptPointId);
  }
  clickedArrivalPoint(pin: GeoFeatureDRTPoint) {
    const oldId = this.selectedArvPointId;
    this.selectedArvPointId = pin.properties.id;
    this.updateActiveArvPoint(oldId, this.selectedArvPointId);
  }

  selectedGenres = [];
  genreItems() {
    const a = this.eventPins?.flatMap(e =>
      e.properties.events.flatMap(eventInfo => eventInfo.event.lGenreName)
    );

    if (a) {
      return a;
    } else {
      return [];
    }
  }
  visiableEventPins() {
    if (this.selectedGenres.length <= 0) {
      return this.eventPins;
    } else {
      return this.eventPins?.filter(e => {
        const genres = e.properties.events.flatMap(e => e.event.lGenreName);
        const x = new Set(this.selectedGenres);
        const y = new Set(genres);
        const intersection = new Set([...x].filter(e => y.has(e)));
        return intersection.size > 0;
      });
    }
  }

  clearSelectedGenres() {
    this.selectedGenres = [];
  }
}
</script>

<style module>
/*マップサイズ*/
.map {
  z-index: 0;
  height: 800px;
  text-align: left;
}
.eventMarker {
  background-color: darkorange;
  border-radius: 20px 0px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px -28px !important;
}
.destinationMarker {
  background-color: darkorange;
  border-radius: 20px 0px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px -28px !important;
}
.dptMarker {
  background-color: darkcyan;
  border-radius: 0px 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px 0px !important;
}
.dptMarkerActive {
  background-color: cyan;
  border-radius: 0px 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px 0px !important;
}

.arvMarker {
  background-color: darkred;
  border-radius: 0px 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px 0px !important;
}
.arvMarkerActive {
  background-color: red;
  border-radius: 0px 20px 20px 20px;
  box-shadow: 5px 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 28px;
  width: 28px !important;
  height: 28px !important;
  margin: 0px 0px !important;
}

.thumbnail {
  width: 50px;
  height: 50px;
}
.imageZone {
  width: 100%;
  margin: 0 !important;
}
@media (max-width: 600px) {
  :global(.leaflet-popup-content) {
    width: 300px !important;
    margin: 4px;
  }
}
@media (min-width: 600px) {
  :global(.leaflet-popup-content) {
    width: 400px !important;
    margin: 4px;
  }
}

.customControl {
  background: #fff;
  margin: 1em;
  padding: 1em;
  opacity: 0.8;
  border-radius: 1em;
}
</style>
