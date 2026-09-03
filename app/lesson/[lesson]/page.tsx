import { notFound, redirect } from 'next/navigation';
export default async function LessonAlias({params}:{params:Promise<{lesson:string}>}){const {lesson}=await params;if(lesson==='2'||lesson==='3')redirect(`/study/l${lesson}`);notFound();}
