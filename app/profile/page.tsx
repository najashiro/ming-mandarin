import { requireUser } from '@/app/auth';
import { ProfileForm } from '@/components/ProfileForm';
import { SiteShell, LessonHeader } from '@/components/SiteShell';
import { getProgress } from '@/lib/server/persistence';
export default async function ProfilePage(){const user=await requireUser('/profile');const data=await getProgress(user);const profile=data.profile as Record<string,unknown>;return <SiteShell><main><LessonHeader eyebrow="个人资料 · PERFIL" title="Tu nombre y preferencias" description="Tu perfil se reconoce mediante una sesión privada en este navegador; no necesita correo ni contraseña."/><section className="shell narrow"><ProfileForm initialName={String(profile.display_name??user.displayName)} initialOptIn={Boolean(profile.leaderboard_opt_in)} initialTimezone={String(profile.timezone??'America/Lima')}/></section></main></SiteShell>}
