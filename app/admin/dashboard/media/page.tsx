import { createClient } from '@/lib/supabase/server';
import MediaLibrary from '@/components/admin/MediaLibrary';

export default async function AdminMediaPage() {
  const supabase = createClient();
  const { data: media } = await supabase.from('media').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-8">Media Library</h1>
      <MediaLibrary initialMedia={media ?? []} />
    </div>
  );
}
