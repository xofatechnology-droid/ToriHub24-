import { Volume2 } from 'lucide-react';

export default function AudioPlayer({ url, title }: { url: string; title?: string }) {
  return (
    <div className="my-6 border border-rule p-4 bg-paperdim">
      <div className="flex items-center gap-2 mb-2 eyebrow">
        <Volume2 size={14} />
        <span>{title || 'Listen to this story'}</span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls className="w-full" preload="none">
        <source src={url} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
