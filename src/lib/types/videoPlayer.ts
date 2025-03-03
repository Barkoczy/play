export interface QualityLevel {
    id: number;
    height: number;
    bitrate: number;
}

export interface PlayerError {
    type: string;
    details: string;
    fatal: boolean;
}

export interface RecoveryAttempts {
    [key: string]: number;
}

export interface PlayerProps {
    videoUrl: string;
    autoplay?: boolean;
    live?: boolean;
}