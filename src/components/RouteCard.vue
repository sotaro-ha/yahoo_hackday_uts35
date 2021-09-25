<template>
  <v-card :class="$style.routeCard" flat>
    <!-- 出発駅 -->
    <v-row align="center" class="ma-0">
      <v-col cols="3" sm="4" class="pa-1" align="center">
        <v-chip color="pink" label text-color="white" block>
          <v-icon :left="!$vuetify.breakpoint.xs">mdi-train</v-icon>
          <span v-if="!$vuetify.breakpoint.xs">出発駅</span>
        </v-chip>
      </v-col>
      <v-col cols="9" sm="8" class="pa-1">
        <v-text-field dense single-line hide-details v-model="dptStationName">
        </v-text-field>
      </v-col>
    </v-row>
    <!-- 列車乗換情報 -->
    <v-row align="center" v-if="isShowingSearchResult" class="ma-0">
      <v-col cols="3" sm="4">
        <div :class="$style.trainLine"></div>
      </v-col>
      <v-col cols="7" sm="6">
        <v-row>
          <v-col cols="12" class="pa-1"> {{ trainTimeInfo }} </v-col>
          <v-col cols="12" class="pa-1">
            {{ trainOtherInfo }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="pa-0">
        <v-btn
          class="mx-1"
          fab
          dark
          small
          color="pink"
          @click="linkToOtherWindow(trainUri)"
          :disabled="trainUri == ''"
          ><v-icon dark>mdi-link</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- 到着駅&乗車ポイント -->
    <v-row align="center" class="ma-0">
      <v-col cols="3" sm="4" class="pa-1" align="center">
        <v-chip color="cyan" label text-color="white" block>
          <v-icon :left="!$vuetify.breakpoint.xs">mdi-train-car</v-icon>
          <span v-if="!$vuetify.breakpoint.xs">乗車Pt.</span>
        </v-chip>
      </v-col>
      <v-col cols="9" sm="8" class="pa-1">
        <v-select
          v-model="selectedDptPointId"
          dense
          single-line
          hide-details
          :items="stationPointItems()"
          @change="onChangedSelectedDptPointId"
        >
        </v-select>
      </v-col>
    </v-row>

    <!-- オンデマンドバス情報 -->
    <v-row align="center" v-if="isShowingSearchResult" class="ma-0">
      <v-col cols="3" sm="4">
        <div :class="$style.trainLine"></div>
      </v-col>
      <v-col cols="7" sm="6">
        <v-row>
          <v-col cols="12" class="pa-1">
            出発時刻：{{ drtDptDateTimeStr }}
          </v-col>
          <v-col cols="12" class="pa-1">
            到着時刻：{{ drtArvDateTimeStr }}
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="pa-0">
        <v-dialog v-model="dialog" persistent max-width="290" eager>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-1"
              fab
              dark
              small
              color="cyan"
              v-bind="attrs"
              v-on="on"
              :disabled="!reserved || drtReservation.status != 1"
              ><v-icon>mdi-qrcode</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              乗車用QRスキャン
            </v-card-title>
            <v-card>
              <qrcode-stream @decode="onDecode" v-if="dialog"></qrcode-stream>
            </v-card>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <!-- 降車ポイント -->
    <v-row align="center" justify="center" class="ma-0">
      <v-col cols="3" sm="4" class="pa-1" align="center">
        <v-chip color="red" label text-color="white" block>
          <v-icon :left="!$vuetify.breakpoint.xs">mdi-check</v-icon>
          <span v-if="!$vuetify.breakpoint.xs">下車Pt.</span>
        </v-chip>
      </v-col>
      <v-col cols="9" sm="8" class="pa-1">
        <v-select
          v-model="selectedArvPointId"
          dense
          single-line
          hide-details
          :items="destinationPointItems()"
          @change="onChangedSelectedArvPointId"
        >
        </v-select>
      </v-col>
    </v-row>

    <!-- 徒歩情報 -->
    <v-row align="center" class="ma-0">
      <v-col cols="3" sm="4">
        <div :class="$style.trainLine"></div>
      </v-col>
      <v-col cols="9" sm="8">
        <v-icon>mdi-shoe-sneaker</v-icon> {{ estimatedWalkMinutes() }}分
      </v-col>
    </v-row>

    <!-- 到着時刻情報 -->
    <v-row align="center" class="ma-0">
      <v-col cols="3" sm="4" class="pa-1" align="center">
        <v-chip color="orange" label text-color="white" block>
          <v-icon :left="!$vuetify.breakpoint.xs"
            >mdi-calendar-clock-outline</v-icon
          >
          <span v-if="!$vuetify.breakpoint.xs">目標時刻</span>
        </v-chip>
      </v-col>
      <v-col cols="9" sm="8" class="pa-1">
        <v-select
          v-model="selectedDateTime"
          dense
          single-line
          hide-details
          :items="targetDateTimeItems"
        >
        </v-select>
      </v-col>
    </v-row>

    <v-row justify="center" class="pa-1">
      <v-btn
        :disabled="!selectedDateTime || dptStationName.length <= 0"
        color="blue-grey"
        class="ma-2 white--text"
        @click="search"
        ><span v-if="!$vuetify.breakpoint.xs">経路検索</span
        ><v-icon>mdi-magnify</v-icon></v-btn
      >
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        @click="reserve"
        v-if="isShowingSearchResult && !reserved"
        ><span v-if="!$vuetify.breakpoint.xs">DRT予約</span
        ><v-icon>mdi-book-plus-outline</v-icon></v-btn
      >
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        @click="cancel"
        v-else-if="
          isShowingSearchResult && reserved && drtReservation.status == 1
        "
        ><span v-if="!$vuetify.breakpoint.xs">DRT予約キャンセル</span
        ><v-icon>mdi-book-cancel-outline</v-icon></v-btn
      >
      <v-btn
        disabled
        color="blue-grey"
        class="ma-2 white--text"
        v-else-if="
          isShowingSearchResult && reserved && drtReservation.status == 2
        "
        ><span v-if="!$vuetify.breakpoint.xs">DRT搭乗処理済</span
        ><v-icon>mdi-book-off-outline</v-icon></v-btn
      >
    </v-row>
    <v-snackbar color="primary" v-model="snackbar" timeout="2000">
      {{ msg }}
      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>
<style module>
.routeCard {
  width: 100%;
}

.trainLine {
  position: relative;
  width: 100%;
  height: 48px;
}

/* 丸の描写 */
.trainLine:before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translate(-5px, -5px);
  -webkit-transform: translate(-5px, -5px);
  -ms-transform: translate(-5px, -5px);
  border-radius: 50%;
  background: rgb(145, 145, 145);
  animation: circlemove 3s ease-in-out infinite,
    cirlemovehide 3s ease-out infinite;
  z-index: 2;
}

/*下からの距離が変化して丸の全体が上から下に動く*/
@keyframes circlemove {
  0% {
    top: 0%;
  }
  100% {
    top: 100%;
  }
}

/*上から下にかけて丸が透過→不透明→透過する*/
@keyframes cirlemovehide {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}

/* 線の描写 */
.trainLine:after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 100%;
  transform: translate(-1.5px, 0px);
  -webkit-transform: translate(-1.5px, 0px);
  -ms-transform: translate(-1.5px, 0px);
  background: #eee;
  background-image: linear-gradient(
    -45deg,
    #dfdfdf 25%,
    #191919 25%,
    #191919 50%,
    #dfdfdf 50%,
    #dfdfdf 75%,
    #191919 75%,
    #191919
  );
  background-size: 15px 15px;
  z-index: 1;
}
</style>
<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import BaseComponent from '@/components/BaseComponent.vue';
import { Prop, PropSync } from 'vue-property-decorator';
import { GeoFeatureDRTPoint } from '@/types/utils';
import axios from 'axios';
import moment from 'moment';

//@ts-ignore
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader';

@Mixin({
  components: {
    QrcodeStream,
    QrcodeDropZone,
    QrcodeCapture
  }
})
export default class RouteCard extends Mixins<BaseComponent>(BaseComponent) {
  dptStationName = '';
  @Prop({ default: () => [] })
  stationPoints?: Array<GeoFeatureDRTPoint>;
  stationPointItems() {
    if (this.stationPoints) {
      return this.stationPoints.map(e => {
        return {
          text: e.properties.name,
          value: e.properties.id
        };
      });
    } else return [];
  }
  @Prop({ default: () => [] })
  destinationPoints?: Array<GeoFeatureDRTPoint>;
  destinationPointItems() {
    if (this.destinationPoints) {
      return this.destinationPoints.map(e => {
        return {
          text: e.properties.name,
          value: e.properties.id
        };
      });
    } else return [];
  }
  @Prop({ default: () => [] })
  targetDateTimeItems?: Array<{ text: string; value: Date }>;
  selectedDateTime = new Date();

  @PropSync('selectedDptPointIdValue', { type: Number })
  selectedDptPointId?: number;
  @PropSync('selectedArvPointIdValue', { type: Number })
  selectedArvPointId?: number;

  onChangedSelectedDptPointId(newId: number) {
    this.$emit('changedSelectedDptPointId', this.selectedDptPointId, newId);
  }
  onChangedSelectedArvPointId(newId: number) {
    this.$emit('changedSelectedArvPointId', this.selectedArvPointId, newId);
  }

  @Prop({ default: 0 })
  walkDistance?: number;

  estimatedWalkMinutes() {
    if (this.walkDistance) {
      return Math.ceil(this.walkDistance / 80);
    } else {
      return 0;
    }
  }

  isShowingSearchResult = false;
  marginMinutes = 10;
  drtCandidate?: any;
  drtDptDateTimeStr?: string;
  drtArvDateTimeStr?: string;
  trainTimeInfo = '';
  trainOtherInfo = '';
  trainUri = '';
  reserved = false;
  snackbar = false;
  msg = '';
  dialog = false;
  reservationInfo = '';
  drtReservation?: any;

  clearSearchResult() {
    this.trainTimeInfo = '';
    this.trainOtherInfo = '';
    this.trainUri = '';
    this.isShowingSearchResult = false;
  }

  async search() {
    const dptId = this.selectedDptPointId;
    const arvId = this.selectedArvPointId;
    // 最終的に到着したい時刻
    const arvDateTime = moment(this.selectedDateTime);
    // 徒歩+マージン分の時間を考慮したデマンド交通の到着時刻
    const drtArvTime = arvDateTime.subtract(
      moment.duration({
        minutes: this.marginMinutes + this.estimatedWalkMinutes()
      })
    );
    // 乗降車ポイントと到着時刻で検索
    const drtReqBody = {
      adult_count: 1, //乗車人数
      child_count: 0,
      departure_point_id: dptId, //乗車ポイント
      arrival_point_id: arvId, //降車ポイント
      arrival_time: drtArvTime.format(), //到着時刻
      reserved_flg: true //貸切フラグ
    };

    // ログインユーザのIDトークンを取得
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
    const drtRes = await axios.post('/api/search/reservations', drtReqBody, {
      headers: headers
    });

    if (!drtRes.data.candidate || drtRes.data.candidate.length <= 0) {
      this.msg = '送迎可能な車両がありません…';
      this.snackbar = true;
      return;
    }

    // 複数予約候補が来るため一つ目を抽出
    const drtCandidate = drtRes.data.candidate[0];

    // DRTキットの出発時刻から、駅への到着時刻を逆算
    const drtDptTime = moment(drtCandidate.departure_time);
    const arvTrainTime = drtDptTime.subtract(
      moment.duration({ minutes: this.marginMinutes })
    );
    const arvStationName = drtCandidate.departure_point_name.split('：')[0];

    const dptStationNameFixed = this.dptStationName.replace(/駅$/g, '');
    const arvStationNameFixed = arvStationName.replace(/駅$/g, '');
    const arvStationDate = Number(arvTrainTime.format('YYYYMMDD'));
    const arvStationTime = Number(arvTrainTime.format('HHmm'));
    const trainParams = {
      from: dptStationNameFixed,
      to: arvStationNameFixed,
      date: arvStationDate,
      time: arvStationTime
    };

    const staRes = await axios.get('/api/search/train', {
      headers: headers,
      params: trainParams
    });

    this.isShowingSearchResult = true;
    this.drtCandidate = drtCandidate;
    this.drtDptDateTimeStr = moment(drtCandidate.departure_time).format(
      'MM月DD日 HH:mm'
    );
    this.drtArvDateTimeStr = moment(drtCandidate.arrival_time).format(
      'MM月DD日 HH:mm'
    );

    if (!staRes.data.resUri) {
      this.trainTimeInfo = '電車での経路が見つかりませんでした';
      this.trainOtherInfo = '';
      this.trainUri = '';
    } else if (staRes.data.routes.length <= 0) {
      this.trainTimeInfo = '列車情報はリンクまで！';
      this.trainOtherInfo = '(駅すぱあとAPIを利用しています)';
      this.trainUri = staRes.data.resUri;
    } else {
      this.trainTimeInfo = '時刻：' + staRes.data.routes[0].tripTimeText;
      this.trainOtherInfo =
        '(' +
        staRes.data.routes[0].changeLineText +
        ', ' +
        staRes.data.routes[0].fareText +
        ')';
      this.trainUri = staRes.data.resUri;
    }
  }
  async reserve() {
    const headers = {
      Authorization: 'Bearer ' + this.store.accountInfo.idToken,
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const drtRes = await axios.post('/api/reserve', this.drtCandidate, {
      headers: headers
    });
    this.drtReservation = drtRes.data;
    this.reserved = true;
    this.msg = '予約完了！';
    this.snackbar = true;
  }
  async cancel() {
    const headers = {
      Authorization: 'Bearer ' + this.store.accountInfo.idToken,
      'Content-Type': 'application/json;charset=UTF-8'
    };
    const drtRes = await axios.post('/api/cancel', this.drtReservation, {
      headers: headers
    });
    console.log(drtRes);
    this.reserved = false;
    this.drtReservation = undefined;
    this.msg = 'キャンセルしました';

    this.snackbar = true;
    this.isShowingSearchResult = false;
  }
  async onDecode(decodedString: string) {
    console.log(decodedString);
    const obj = JSON.parse(decodedString);
    if (obj && this.drtReservation) {
      if (obj.reservation_id == this.drtReservation.reservation_id) {
        const headers = {
          Authorization: 'Bearer ' + this.store.accountInfo.idToken,
          'Content-Type': 'application/json;charset=UTF-8'
        };
        const drtRes = await axios.post('/api/ride', this.drtReservation, {
          headers: headers
        });
        this.drtReservation = drtRes.data;
        this.dialog = false;
        this.msg = '搭乗処理を行いました！';
        this.snackbar = true;
      }
    }
  }
  created() {}
}
</script>
