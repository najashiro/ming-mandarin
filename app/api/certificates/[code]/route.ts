import { apiUser, jsonError } from '@/lib/server/api';
import { certificateFile, getCertificate, storeCertificatePng } from '@/lib/server/persistence';

export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const url = new URL(request.url);
    if (url.searchParams.get('file') === '1') {
      const object = await certificateFile(code);
      if (!object) return Response.json({ error: 'El archivo aún no está disponible.' }, { status: 404 });
      return new Response(object.body, { headers: { 'content-type': 'image/png', 'content-disposition': `attachment; filename="${code}.png"`, 'cache-control': 'public, max-age=31536000, immutable' } });
    }
    const certificate = await getCertificate(code);
    return certificate ? Response.json(certificate) : Response.json({ error: 'Certificado no encontrado.' }, { status: 404 });
  } catch (error) { return jsonError(error); }
}

export async function POST(request: Request, context: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await context.params;
    const bytes = await request.arrayBuffer();
    return Response.json(await storeCertificatePng(await apiUser(), code, bytes));
  } catch (error) { return jsonError(error); }
}
