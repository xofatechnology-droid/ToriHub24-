import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import YouTubeEmbed from '@/components/YouTubeEmbed';
import AudioPlayer from '@/components/AudioPlayer';

// Allow iframe/audio tags through sanitize (still whitelisted attributes only)
const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'iframe', 'audio', 'source'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ['src', 'title', 'allow', 'allowFullScreen', 'loading', 'className'],
    audio: ['controls', 'preload', 'className'],
    source: ['src'],
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className'],
  },
};

// Splits body markdown on [youtube:VIDEO_ID] / [audio:URL] shortcodes so editors
// can drop media inline anywhere in the story body.
function splitOnShortcodes(content: string) {
  const parts: { type: 'md' | 'youtube' | 'audio'; value: string }[] = [];
  const regex = /\[(youtube|audio):([^\]]+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'md', value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: match[1] as 'youtube' | 'audio', value: match[2].trim() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: 'md', value: content.slice(lastIndex) });
  }
  return parts;
}

export default function ArticleBody({ content }: { content: string }) {
  const parts = splitOnShortcodes(content);

  return (
    <div className="prose-article">
      {parts.map((part, i) => {
        if (part.type === 'youtube') {
          const url = part.value.includes('http') ? part.value : `https://www.youtube.com/watch?v=${part.value}`;
          return <YouTubeEmbed key={i} url={url} />;
        }
        if (part.type === 'audio') {
          return <AudioPlayer key={i} url={part.value} />;
        }
        if (!part.value.trim()) return null;
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
          >
            {part.value}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
