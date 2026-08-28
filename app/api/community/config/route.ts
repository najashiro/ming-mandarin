import { communityEnabled } from '@/lib/server/community';
import { supabasePublishableKey, supabaseUrl } from '@/lib/supabase/config';

export async function GET() {
  return Response.json({ enabled: communityEnabled(), realtimeUrl: supabaseUrl(), publishableKey: supabasePublishableKey() }, { headers: { 'cache-control': 'no-store' } });
}
