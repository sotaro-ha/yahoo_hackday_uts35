<template>
  <v-container>
    <v-tabs v-model="selectedTab">
      <v-tab href="#map">マップ</v-tab>
      <v-tab href="#gallery">ギャラリー</v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab">
      <!-- 地図表示 -->
      <v-tab-item value="map">
        <map-pane
          :eventPins="eventPins"
          :modeValue.sync="mode"
          :selectedPointCodeValue.sync="selectedPointCode"
          :selectedEventCodeValue.sync="selectedEventCode"
        >
        </map-pane>
      </v-tab-item>

      <!-- ギャラリー(イベント画像のサマリ)表示 -->
      <v-tab-item value="gallery">
        <image-gallery
          :imageNum="imageNum"
          :galleryImages="galleryImages"
          @selected="goToDetail"
        >
        </image-gallery>
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import BaseComponent from '@/components/BaseComponent.vue';
import MapPane from '@/components/MapPane.vue';
import ImageGallery from '@/components/ImageGallery.vue';

import axios from 'axios';
import { GeoFeatureAggregatedEventPoint, EventInfoProps } from '@/types/utils';

@Mixin({
  components: {
    MapPane,
    ImageGallery
  }
})
export default class MainView extends Mixins<BaseComponent>(BaseComponent) {
  eventReleases = [];
  points = [];
  galleryImages = [] as Array<{
    url: string;
    eventCode: string;
    pointCode: string;
  }>;
  imageNum = 6;
  eventPins = [] as Array<GeoFeatureAggregatedEventPoint>;
  selectedTab = 'map';
  mode = 'detail';
  selectedPointCode = '';
  selectedEventCode = '';

  shuffle<T>(array: T[]) {
    const out = Array.from(array);
    for (let i = out.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[r];
      out[r] = tmp;
    }
    return out;
  }

  goToDetail(img: { url: string; pointCode: string; eventCode: string }) {
    this.selectedTab = 'map';
    this.selectedPointCode = img.pointCode;
    this.selectedEventCode = img.eventCode;
    this.mode = 'detail';
  }

  async mounted() {
    axios.get('/api/search/eventReleases').then(e => {
      this.eventReleases = e.data.eventReleases;

      const b = this.eventReleases.map(e => {
        const events = e['events'] as Array<EventInfoProps>;
        const point = e['point'] as { cd: string; lat: number; lng: number };
        const images = events.flatMap(e => {
          if (e.event.imageUrls) {
            return e.event.imageUrls.map(img => {
              return {
                url: img,
                pointCode: point.cd,
                eventCode: e.event.eventCode
              };
            });
          } else return [];
        });

        const props = {
          id: point.cd,
          events: events,
          images: images
        };
        const geo = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lng, point.lat]
          }
        };

        return { ...geo, properties: props };
      });
      b.sort((a, b) => b.geometry.coordinates[1] - a.geometry.coordinates[1]);
      this.eventPins = b;
      this.galleryImages = this.shuffle(
        this.eventPins.flatMap(e => e.properties.images)
      );
    });
  }
}
</script>
