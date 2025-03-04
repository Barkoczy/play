import { PUBLIC_BASE_URL } from '$env/static/public';
import { getAllVideos } from '$lib/api/videoApi';
import type { Video } from '$lib/types/videoTypes';

export async function GET() {
	try {
		// Získaj všetky videá z API (alebo z databázy)
		const videos: Video[] = await getAllVideos();

		// Základné URL tvojej stránky
		const baseUrl = PUBLIC_BASE_URL;

		// Vytvor XML pre každé video
		const videoEntries = videos
			.map((video) => {
				const videoUrl = `${baseUrl}/watch/${video.videoId}`;
				const lastMod = video.uploadDate || new Date().toISOString().split('T')[0];

				return `
    <url>
        <loc>${videoUrl}</loc>
        <lastmod>${lastMod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
        <video:video>
            <video:thumbnail_loc>${video.thumbnail || 'https://placehold.co/600x400'}</video:thumbnail_loc>
            <video:title>${encodeXML(video.name)}</video:title>
            <video:description>${encodeXML(video.desc || '')}</video:description>
            <video:content_loc>${video.videoUrl}</video:content_loc>
            <video:publication_date>${video.uploadDate || new Date().toISOString()}</video:publication_date>
            <video:family_friendly>yes</video:family_friendly>
            <video:live>${video.live ? 'yes' : 'no'}</video:live>
        </video:video>
    </url>`;
			})
			.join('\n');

		// Pridaj statické stránky do sitemap
		const staticPages = [
			`
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`
		].join('\n');

		// Vytvor celú sitemap
		const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
                    xmlns:xhtml="https://www.w3.org/1999/xhtml"
                    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1">
            ${staticPages}
            ${videoEntries}
            </urlset>`;

		// Vráť sitemap s správnymi hlavičkami
		return new Response(sitemap.trim(), {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Chyba pri generovaní sitemap:', error);

		// Vráť jednoduchú sitemap v prípade chyby
		const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8" ?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                    <loc>${PUBLIC_BASE_URL}</loc>
                    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>1.0</priority>
                </url>
            </urlset>`;

		return new Response(fallbackSitemap.trim(), {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600'
			}
		});
	}
}

// Pomocná funkcia na escapovanie XML znakov
function encodeXML(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}
