import { createClient } from '@/lib/supabase/server';
import SettingsForm from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single();

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-8">Site Settings</h1>
      <SettingsForm settings={settings} />
    </div>
  );
}
