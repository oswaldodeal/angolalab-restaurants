import { withRestaurantReferral } from '@/lib/restaurant-referral';
import Link from 'next/link';
import { publicComments } from '@/lib/restaurant-comments';

export default async function RestaurantComments({ id, language, demo }: {id:string;language:'en'|'pt';demo:boolean}) {
  const pt=language==='pt';
  const comments=demo?[]:await publicComments(id, language);
  return <details className="group rounded-xl border border-[#e9e5db] p-4 sm:p-6">
    <summary className="flex min-h-11 cursor-pointer list-none flex-wrap items-center justify-between gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 [&::-webkit-details-marker]:hidden">
      <h2 className="text-xl font-semibold">{pt?'03 · Comentários':'03 · Comments'}</h2>
      <span className="text-sm font-semibold text-emerald-700"><span className="group-open:hidden">{pt?'Ler mais':'Read more'} +</span><span className="hidden group-open:inline">{pt?'Ler menos':'Read less'} −</span></span>
    </summary>
    <p className="mt-4 text-sm text-[#555]">{pt?'Comentários de contas verificadas, analisados pela equipa AngolaLab.':'Comments from verified accounts, reviewed by AngolaLab staff.'}</p>
    {comments===null?<p className="mt-4 text-sm text-[#555]">{pt?'Os comentários ainda não estão disponíveis.':'Comments are not available yet.'}</p>:comments.length===0?<p className="mt-4 text-sm text-[#555]">{pt?'Ainda não há comentários publicados.':'No published comments yet.'}</p>:<ul className="mt-4 divide-y divide-[#e9e5db]">{comments.map((c,index)=><li key={index} className="py-4"><p className="font-semibold">{c.public_name}</p><p className="mt-1 text-xs text-[#555]"><code>{c.menu_reference}</code> · {new Intl.DateTimeFormat(pt?'pt-PT':'en-GB',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(c.created_at!))}</p><p className="mt-2 whitespace-pre-line break-words text-sm text-[#555]">{c.body}</p>
      {c.reply_body && <div className="mt-3 border-l-2 border-emerald-700 pl-3 text-sm">
        <p className="font-semibold">{pt ? 'Resposta do restaurante' : 'Response from the restaurant'}</p>
        <p className="mt-1 whitespace-pre-wrap break-words">{c.reply_body}</p>
      </div>}</li>)}</ul>}
    {!demo&&<Link href={withRestaurantReferral(pt?'/pt/conta':'/en/account', id)} className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-4">{pt?'Deixar um comentário':'Leave a comment'}</Link>}
    {!demo && <p className="mt-2 text-xs text-[#555]">{pt ? 'Entre na sua conta AngolaLab para comentar.' : 'Sign in to your AngolaLab account to comment.'}</p>}
    {demo&&<p className="mt-4 text-xs text-[#555]">{pt?'Perfil de demonstração.':'Demonstration profile.'}</p>}
  </details>;
}
