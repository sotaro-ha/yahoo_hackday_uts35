<template>
  <v-container fluid class="pa-0">
    <v-carousel cycle :interval="6000" height="auto">
      <v-carousel-item
        v-for="(e1, idx1) in Math.ceil(galleryImages.length / imageNum)"
        :key="idx1"
      >
        <v-row>
          <v-col
            v-for="(e2, idx2) in imageNum"
            :key="idx2"
            cols="6"
            md="4"
            class="d-flex child-flex"
          >
            <v-img
              :src="
                idx1 * imageNum + idx2 < galleryImages.length
                  ? galleryImages[idx1 * imageNum + idx2].url
                  : ''
              "
              aspect-ratio="1"
              @click="onSelected(galleryImages[idx1 * imageNum + idx2])"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>
        </v-row>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>

<script lang="ts">
import { Mixin, Mixins } from 'vue-mixin-decorator';
import { Prop } from 'vue-property-decorator';
import BaseComponent from '@/components/BaseComponent.vue';

@Mixin({})
export default class ImageGallery extends Mixins<BaseComponent>(BaseComponent) {
  @Prop({ default: 6 })
  imageNum?: number;
  @Prop({ default: () => [] })
  galleryImages?: Array<{
    url: string;
    eventCode: string;
    pointCode: string;
  }>;
  onSelected(image: { url: string; eventCode: string; pointCode: string }) {
    this.$emit('selected', image);
  }
}
</script>
