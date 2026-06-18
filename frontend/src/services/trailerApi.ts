const YT_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YT_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

export interface TrailerResult {
  videoId: string;
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnailUrl: string;
}

function buildQuery(title: string, year?: string) {
  return [title, year, "official trailer"].filter(Boolean).join(" ");
}

export const trailerApi = {
  async searchTrailerByTitle(
    title: string,
    year?: string
  ): Promise<TrailerResult | null> {
    if (!YT_API_KEY) return null;

    const params = new URLSearchParams({
      key: YT_API_KEY,
      q: buildQuery(title, year),
      maxResults: "5",
      part: "snippet",
      type: "video",
      videoEmbeddable: "true",
      safeSearch: "strict",
    });

    try {
      const resp = await fetch(`${YT_SEARCH_URL}?${params.toString()}`);
      if (!resp.ok) return null;

      const data = await resp.json();
      const items: { id?: { videoId?: string }; snippet: { title: string; channelTitle: string; publishedAt: string; thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } } } }[] = data.items || [];
      if (items.length === 0) return null;

      const normalizedTitle = title.toLowerCase();
      const scored = items
        .map((item) => {
          const videoId = item.id?.videoId;
          if (!videoId) return null;
          const t = item.snippet.title.toLowerCase();
          const ch = item.snippet.channelTitle || "";
          let score = 0;
          if (t.includes("trailer")) score += 2;
          if (t.includes(normalizedTitle)) score += 2;
          if (year && t.includes(String(year))) score += 1;
          if (
            /warner|universal|sony|paramount|lionsgate|marvel|netflix|prime/i.test(
              ch
            )
          )
            score += 1;
          return {
            score,
            result: {
              videoId,
              title: item.snippet.title,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              thumbnailUrl:
                item.snippet.thumbnails?.high?.url ||
                item.snippet.thumbnails?.medium?.url ||
                item.snippet.thumbnails?.default?.url ||
                "",
            } as TrailerResult,
          };
        })
        .filter(Boolean) as { score: number; result: TrailerResult }[];

      if (scored.length === 0) return null;
      scored.sort((a, b) => b.score - a.score);
      return scored[0].result;
    } catch {
      return null;
    }
  },
};
