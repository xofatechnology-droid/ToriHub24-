import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PopupNewsletter from '@/components/PopupNewsletter';
import { getSiteSettings, getCategories } from '@/lib/queries';
import { SITE_URL_CONST } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(SITE_URL_CONST),
    title: { default: settings.site_name, template: `%s | ${settings.site_name}` },
    description: settings.tagline || undefined,
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined,
    openGraph: {
      siteName: settings.site_name,
      type: 'website',
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);

  return (
    <html lang="en">
      <body className="font-body bg-paper text-ink antialiased">
        {settings.adsense_client_id && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsense_client_id}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Header settings={settings} categories={categories} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer settings={settings} categories={categories} />
        <PopupNewsletter siteName={settings.site_name} />
      </body>
    </html>
  );
}
