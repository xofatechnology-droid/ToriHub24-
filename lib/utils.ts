import slugify from 'slugify';

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const units: [number, string][] = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.345, 'week'],
    [12, 'month'],
    [Number.POSITIVE_INFINITY, 'year'],
  ];
  let value = seconds;
  let unit = 'second';
  for (const [amount, name] of units) {
    if (value < amount) {
      unit = name;
      break;
    }
    value = Math.floor(value / amount);
    unit = name;
  }
  if (unit === 'second' && value < 5) return 'just now';
  return `${value} ${unit}${value !== 1 ? 's' : ''} ago`;
}

export function excerptFromMarkdown(markdown: string, length = 160): string {
  const plain = markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
    .replace(/[#*_>`~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > length ? plain.slice(0, length).trim() + '…' : plain;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?&\s]+)/,
    /(?:youtube\.com\/embed\/)([^?&\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?&\s]+)/,
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  return null;
}

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
