import { notFound, redirect } from 'next/navigation';
export default async function LessonAlias({params}:{params:Promise<{lesson:string}>}){const {lesson}=await params;if(['2','3','4','5'].includes(lesson))redirect(`/study/l${lesson}`);notFound();}
