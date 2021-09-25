<template>
  <v-card :class="$style.eventsCard" flat>
    <v-tabs
      v-model="selectedEventCode"
      background-color="primary"
      height="30px"
      dark
    >
      <v-tab
        v-for="(eventInfo, idx1) in eventInfoArray"
        :key="eventInfo.event.eventCode"
        :href="`#${eventInfo.event.eventCode}`"
      >
        {{ idx1 + 1 }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedEventCode">
      <v-tab-item
        v-for="eventInfo in eventInfoArray"
        :key="eventInfo.event.eventCode"
        :value="eventInfo.event.eventCode"
      >
        <v-card flat width="100%">
          <!-- イベントタイトル -->
          <v-img
            height="200px"
            :src="eventInfo.event.imageUrls ? eventInfo.event.imageUrls[0] : ''"
            gradient="to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)"
          >
            <v-card-title class="white--text">
              <a @click="linkToOtherWindow(eventInfo.event.eventUrlPc)">{{
                eventInfo.event.mainTitle
              }}</a>
            </v-card-title>
            <v-card-text
              v-if="eventInfo.event.shortCatch"
              :class="$style.shortCatchZone"
            >
              {{ eventInfo.event.shortCatch }}
            </v-card-text>
          </v-img>
          <v-row
            :class="$style.promotionZone"
            v-if="eventInfo.event.promotionPartsPcs"
          >
            <v-card-text
              v-for="(promotionPart, idx) in eventInfo.event.promotionPartsPcs"
              :key="idx"
              v-html="promotionPart"
              class="pa-1"
            >
            </v-card-text>
          </v-row>
          <v-row :class="$style.promotionZone" v-else>
            <v-card-text class="pa-1">
              イベント詳細は<a
                @click="linkToOtherWindow(eventInfo.event.eventUrlPc)"
                >ぴあHP</a
              >まで。
            </v-card-text>
          </v-row>

          <v-sheet class="pa-1" height="180">
            <v-calendar
              ref="calendar"
              type="custom-weekly"
              :start="startDate"
              :end="endDate"
              color="primary"
              :events="calendarPerforms(eventInfo.event.eventCode)"
              @click:event="showEvent"
            >
            </v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedActivator"
              offset-x
            >
              <v-card color="grey lighten-4" flat v-if="selectedOpen">
                <v-toolbar color="primary" dark>
                  <v-toolbar-title>{{
                    selectedCalendarPerform.name
                  }}</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                  <v-btn icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text>
                  <v-row align="center">
                    <v-col cols="12" sm="6" class="pa-1">
                      {{
                        perform2dateTimeInfo(selectedCalendarPerform.perform)
                      }}
                    </v-col>
                    <v-col cols="12" sm="6" class="pa-1">
                      <v-btn
                        block
                        @click="
                          selectedOpen = false;
                          onSelected(
                            eventInfo,
                            selectedCalendarPerform.perform
                          );
                          linkToOtherWindow(eventInfo.release.releaseUrlPc);
                        "
                      >
                        <v-icon left>mdi-ticket-confirmation-outline</v-icon>
                        チケット購入
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    Cancel
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<style module>
.eventsCard {
  width: 100%;
}
.imageZone {
  width: 100%;
  margin: 0 !important;
}
.performZone {
  overflow: auto;
  height: 120px;
  width: 100%;
  padding: 4px;
  margin: 0;
}
.shortCatchZone {
  color: #ffffff !important;
  caret-color: #ffffff !important;
}
.promotionZone {
  overflow: auto;
  height: 80px;
  width: 100%;
  padding: 4px;
  margin: 0px !important;
}
</style>
<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import BaseComponent from '@/components/BaseComponent.vue';
import { Prop } from 'vue-property-decorator';
import { EventInfoProps, PerformProps } from '@/types/utils';
import moment from 'moment';

interface CalenderEvent {
  name: string;
  start: Date | string;
  end: Date | string;
  color: string;
  timed: boolean;
}

@Mixin({})
export default class EventsCard extends Mixins<BaseComponent>(BaseComponent) {
  @Prop({ default: () => [] })
  eventInfoArray?: Array<EventInfoProps>;
  selectedEventCode = '';

  selectedOpen = false;
  selectedCalendarPerform?: CalenderEvent;
  selectedActivator = '';

  startDate = moment()
    .day(1)
    .format('YYYY-MM-DD');
  endDate = moment()
    .add(7, 'days')
    .day(1)
    .format('YYYY-MM-DD');

  onSelected(eventInfo: EventInfoProps, perform: PerformProps) {
    const payload = { eventInfo: eventInfo, perform: perform };
    this.$emit('selected', payload);
  }
  calendarPerforms(eventCode: string) {
    let a = [] as Array<CalenderEvent>;
    if (this.eventInfoArray) {
      const eventInfo = this.eventInfoArray.find(
        e => e.event.eventCode == eventCode
      );
      if (eventInfo) {
        const performs = eventInfo.performs;
        a = performs.map(e => {
          let start = e.performTermFrom;
          let end = e.performTermEnd;
          let d = e.performDate;
          if (start && end) {
            return {
              name: e.performTitle ? e.performTitle : e.performCode,
              start: moment(start).toDate(),
              end: moment(end).toDate(),
              color: 'cyan',
              timed: false,
              perform: e
            };
          } else if (d) {
            return {
              name: e.performTitle ? e.performTitle : e.performCode,
              start: moment(d).toDate(),
              end: moment(d).toDate(),
              color: 'cyan',
              timed: false,
              perform: e
            };
          } else {
            return {
              name: 'dummy',
              start: new Date(),
              end: new Date(),
              color: 'cyan',
              timed: false,
              perform: e
            };
          }
        });
      }
    }
    return a;
  }

  showEvent(payload: { nativeEvent: any; event: any }) {
    this.selectedCalendarPerform = payload.event;
    this.selectedActivator = payload.nativeEvent.target;
    this.selectedOpen = true;
  }

  perform2dateTimeInfo(p: PerformProps) {
    let dateInfo = '';
    let openTimeInfo = '';
    let startTimeInfo = '';
    if (p.performTermFrom && p.performTermEnd) {
      const startDate = moment(p.performTermFrom);
      const endDate = moment(p.performTermEnd);
      dateInfo = `期間：${startDate.format('MM月DD日')}〜${endDate.format(
        'MM月DD日'
      )}`;
    } else if (p.performDate) {
      const date = moment(p.performDate);
      dateInfo = `${date.format('MM月DD日')}`;
    }

    if (p.openTime) {
      openTimeInfo = `開場：${p.openTime}`;
    }
    if (p.performStartTime) {
      startTimeInfo = `開演：${p.performStartTime}`;
    }

    return dateInfo + ' ' + openTimeInfo + ' ' + startTimeInfo;
  }
}
</script>
