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
    channel: Channel;
    category: string;
}