import { getAnalyticsDashboard } from '@/lib/server/analytics';
import { apiAdmin, jsonError } from '@/lib/server/api';

export async function GET(request: Request) {
  try {
    await apiAdmin();
    const value = new URL(request.url).searchParams.get('range');
    const days = value === '1' || value === '7' || value === '30' ? Number(value) as 1 | 7 | 30 : 7;
    return Response.json(await getAnalyticsDashboard(days), { headers: { 'cache-control': 'private, no-store' } });
  } catch (error) {
    return jsonError(error);
  }
}
