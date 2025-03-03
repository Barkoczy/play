export interface Channel {
    name: string;
    desc: string;
    subscribers: number;
}

export interface Video {
    videoId: string;
    name: string;
    live: boolean;
    videoUrl: string;
    desc: string;
    thumbnail: string;
    channel: Channel;
    category: string;
    uploadDate: string;
    duration: string;
}