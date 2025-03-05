import { PUBLIC_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const NOT_FOUND_VIDEO_DATA = {
    video: null,
    seo: {
        title: 'Video nenájdené | Play',
        metaDescription: 'Požadované video sa nenašlo.',
        thumbnailUrl: 'https://placehold.co/600x400',
        shareUrl: '',
        schemaOrg: null
    }
};

export const load: PageServerLoad = async ({ params, fetch }) => {
    const videoId = params.videoId;
   
    if (!videoId) {
        return NOT_FOUND_VIDEO_DATA;
    }
   
    try {
        const response = await fetch(`/api/videos?id=${videoId}`);
       
        if (!response.ok) {
            // Ak video nie je nájdené (404), vráťte preddefinovaný objekt
            if (response.status === 404) {
                return NOT_FOUND_VIDEO_DATA;
            }
            
            // Pre iné chyby stále vyhoďte pôvodnú chybu
            throw error(response.status, 'Chyba pri načítavaní videa');
        }
       
        const videoData = await response.json();
       
        // Pripravenie SEO metadát pre stránku
        const siteUrl = PUBLIC_BASE_URL || 'http://localhost:5173';
       
        // Vytvorenie meta description
        let metaDescription = videoData.desc || '';
        if (metaDescription.length > 157) {
            metaDescription = metaDescription.substring(0, 157) + '...';
        }
       
        // Získanie URL pre obrázok
        const thumbnailUrl = videoData.thumbnail || 'https://placehold.co/600x400';
       
        // Získanie URL pre zdieľanie
        const shareUrl = `${siteUrl}/watch/${videoId}`;
       
        // Vytvorenie Schema.org dát
        const schemaOrg = {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": videoData.name || 'Video',
            "description": videoData.desc || '',
            "thumbnailUrl": thumbnailUrl,
            "uploadDate": videoData.uploadDate || new Date().toISOString().split('T')[0],
            "contentUrl": videoData.videoUrl || '',
            "embedUrl": shareUrl,
            "duration": videoData.duration || 'PT0M',
            "author": {
                "@type": "Person",
                "name": videoData.channel?.name || ''
            }
        };
       
        return {
            video: videoData,
            seo: {
                title: `${videoData.name} | Play`,
                metaDescription,
                thumbnailUrl,
                shareUrl,
                schemaOrg: JSON.stringify(schemaOrg)
            }
        };
    } catch (e) {
        // Pre akékoľvek iné nečakané chyby (napr. sieťové)
        console.error('Chyba pri načítaní dát videa:', e);
        
        // Vrátenie preddefinovaného objektu pre chybu
        return NOT_FOUND_VIDEO_DATA;
    }
};