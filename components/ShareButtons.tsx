'use client';

import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow">Share</span>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter/X"
        className="p-2 border border-rule hover:border-wire hover:text-wire transition-colors"
      >
        <Twitter size={16} />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"
        className="p-2 border border-rule hover:border-wire hover:text-wire transition-colors"
      >
        <Facebook size={16} />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"
        className="p-2 border border-rule hover:border-wire hover:text-wire transition-colors"
      >
        <Linkedin size={16} />
      </a>
      <button onClick={copyLink} aria-label="Copy link" className="p-2 border border-rule hover:border-wire hover:text-wire transition-colors">
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
}
