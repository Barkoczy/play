import type { Video } from '../types/videoTypes';

// Simulovaná API trieda pre prácu s videami
class VideoApiClass {
    // Simulácia oneskorenia sieťového volania
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Získanie videa podľa ID
    async getVideoById(videoId: string): Promise<Video | null> {
        try {
            // Volanie serverového API endpointu
            const response = await fetch(`/api/videos?id=${encodeURIComponent(videoId)}`);
            
            // Ak video neexistuje, server vráti 404
            if (response.status === 404) {
                return null;
            }
            
            // Kontrola, či volanie bolo úspešné
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Získanie a vrátenie dát
            const data = await response.json();
            return data as Video;
        } catch (error) {
            console.error('Error fetching video:', error);
            return null;
        }
    }

    // Získanie zoznamu všetkých videí
    async getAllVideos(): Promise<Video[]> {
        try {
            // Volanie serverového API endpointu
            const response = await fetch('/api/videos');
            
            // Kontrola, či volanie bolo úspešné
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Získanie a vrátenie dát
            const data = await response.json();
            return data as Video[];
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    }

    // Získanie featured videí (napr. len živé vysielania)
    async getFeaturedVideos(): Promise<Video[]> {
        try {
            // Volanie serverového API endpointu
            const response = await fetch('/api/videos?featured=true');
            
            // Kontrola, či volanie bolo úspešné
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Získanie a vrátenie dát
            const data = await response.json();
            return data as Video[];
        } catch (error) {
            console.error('Error fetching featured videos:', error);
            return [];
        }
    }

    // Získanie videí podľa kategórie
    async getVideosByCategory(category: string): Promise<Video[]> {
        try {
            // Volanie serverového API endpointu
            const response = await fetch(`/api/videos?category=${encodeURIComponent(category)}`);
            
            // Kontrola, či volanie bolo úspešné
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            // Získanie a vrátenie dát
            const data = await response.json();
            return data as Video[];
        } catch (error) {
            console.error('Error fetching videos by category:', error);
            return [];
        }
    }
}

// Vytvorenie jednej inštancie API
const VideoApi = new VideoApiClass();

// Exportovanie metód z inštancie
export const getVideoById = (videoId: string) => VideoApi.getVideoById(videoId);
export const getAllVideos = () => VideoApi.getAllVideos();
export const getFeaturedVideos = () => VideoApi.getFeaturedVideos();
export const getVideosByCategory = (category: string) => VideoApi.getVideosByCategory(category);