// GeoJson用基本構造
export interface GeoFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
}

// 集約されたイベントプロパティ
export interface AggregatedEventsProps {
  properties: {
    id: string;
    events: Array<EventInfoProps>;
    images: Array<{ url: string; eventCode: string; pointCode: string }>;
  };
}

export interface EventProps {
  eventCode: string;
  mainTitle: string;
  lGenreCode: string;
  lGenreName: string;
  eventUrlPc: string;
  promotionPartsPcs?: Array<string>;
  shortCatch?: string;
  imageUrls?: Array<string>;
}
export interface PerformProps {
  performCode: string;
  performTitle?: string;
  performDate?: string;
  performTermFrom?: string;
  performTermEnd?: string;
  openTime?: string;
  performStartTime?: string;
}
export interface ReleaseProps {
  releaseUrlPc: string;
}
export interface VenueProps {
  venueName: string;
  venueCode: string;
  worldLatitude: number;
  worldLongitude: number;
}
export interface EventInfoProps {
  event: EventProps;
  release: ReleaseProps;
  performs: Array<PerformProps>;
  venue: VenueProps;
}

export type GeoFeatureAggregatedEventPoint = GeoFeature & AggregatedEventsProps;

export interface DestinationProps {
  selectedEventInfo: EventInfoProps;
  selectedPerformCode: string;
}

export interface DRTPointProps {
  properties: {
    id: number;
    name: string;
    description: string;
    search_word: string;
    className?: string;
  };
}
export type GeoFeatureDRTPoint = GeoFeature & DRTPointProps;
