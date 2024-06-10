// News state stored in the store
export interface NewsState {
    news: NewsItem[];
    listNews: NewsItem[];
    listSource: SourceItem[];
    isLoading: boolean;
    isListLodaing: boolean;
    error: string | null;
}

// News item received from API
export interface NewsItem {
    id: number;
    name: string;
    date: string
    event: string
    externalURL: string
    feedID: number
    feedName: string
    geoRegion: string
    imageURL: string
    locationName: string
    sourceID: number
    text: string
    type: string
}

// Generated source item
export interface SourceItem {
    id: number;
    name: string;
}
