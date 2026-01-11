import { createClient } from 'pexels';
import type { Photo } from 'pexels';

const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY;

export const pexels = createClient(pexelsKey);

// 封裝 API 呼叫，回傳乾淨的型別
export const searchRandomPhoto = async (query: string): Promise<Photo | null> => {
    const randomPage = Math.floor(Math.random() * 50) + 1;
    const res = await pexels.photos.search({
        query,
        page: randomPage,
        per_page: 1,
    });

    // 型別檢查只在這裡做一次
    if ('photos' in res && res.photos.length > 0) {
        const photo = res.photos[0];
        return photo ?? null;
    }
    return null;
};

// 匯出 Photo 型別讓其他地方可以用
export type { Photo };
