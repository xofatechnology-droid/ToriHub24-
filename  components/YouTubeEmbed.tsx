import { extractYouTubeId } from '@/lib/utils';

export default function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const id = extractYouTubeId(url);
  if (!id) return null;

  return (
    <div className="relative w-full aspect-video bg-ink my-6">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title || 'YouTube video player'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
