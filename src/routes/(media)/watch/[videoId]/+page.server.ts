import { PUBLIC_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
    const videoId = params.videoId;
    
    if (!videoId) {
        return {
            video: null
        };
    }
    
    try {
        const response = await fetch(`/api/videos?id=${videoId}`);
        
        if (!response.ok) {
            throw error(response.status, 'Video nenájdené');
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
        console.error('Chyba pri načítaní dát videa:', e);
        throw error(500, 'Nepodarilo sa načítať dáta videa');
    }
};