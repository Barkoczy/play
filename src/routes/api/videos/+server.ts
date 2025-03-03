import { json } from '@sveltejs/kit';
import type { Video } from '$lib/types/videoTypes';
import type { RequestHandler } from './$types';

// URL pre externý JSON, teraz dostupné len na serveri
const VIDEOS_JSON_URL = 'https://cdn.homelab.quickbiteschronicles.com/play/videos.json';

// Cache pre dáta videí (na strane servera)
let videosCache: Video[] | null = null;
let lastFetchTime: number = 0;
const cacheTTL: number = 5 * 60 * 1000; // 5 minút v milisekundách

// Funkcia na získanie dát zo servera alebo z cache
async function fetchVideosData() {
    const currentTime = Date.now();
    
    // Ak máme platné dáta v cache, vrátime ich
    if (videosCache && (currentTime - lastFetchTime < cacheTTL)) {
        return videosCache;
    }

    try {
        // Načítanie dát z externého zdroja
        const response = await fetch(VIDEOS_JSON_URL);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch videos data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Aktualizácia cache
        videosCache = data;
        lastFetchTime = currentTime;
        
        return data;
    } catch (error) {
        console.error('Error fetching videos data:', error);
        
        // Ak máme staré dáta v cache, vrátime ich v prípade chyby
        if (videosCache) {
            console.warn('Using cached data due to fetch error');
            return videosCache;
        }
        
        // Ak nemáme žiadne dáta, vrátime prázdne pole
        return [];
    }
}

// GET endpoint pre získanie všetkých videí
export const GET: RequestHandler = async ({ url }) => {
    // Získanie všetkých parametrov z URL
    const category = url.searchParams.get('category');
    const videoId = url.searchParams.get('id');
    const featured = url.searchParams.has('featured');
    
    try {
        // Načítanie všetkých videí
        const allVideos = await fetchVideosData();
        
        // Filtrovanie podľa parametrov
        let result;
        
        if (videoId) {
            // Získanie konkrétneho videa podľa ID
            result = allVideos.find((v: Video) => v.videoId === videoId) || null;
            
            // Ak video neexistuje, vrátime 404
            if (!result) {
                return json({ error: 'Video not found' }, { status: 404 });
            }
        } else if (category) {
            // Filtrovanie podľa kategórie
            result = allVideos.filter((video: Video) => video.category === category);
        } else if (featured) {
            // Filtrovanie len živých vysielaní
            result = allVideos.filter((video: Video) => video.live);
        } else {
            // Vrátime všetky videá
            result = allVideos;
        }
        
        return json(result);
    } catch (error) {
        console.error('API error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};