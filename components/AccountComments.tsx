import { commenterAccount } from '@/lib/restaurant-comments';
import { getPublishedRestaurants, getSavedMenu } from '@/lib/restaurant-data';
import { removeOwnComment } from '@/app/owner/comment-actions';
import { NewCommentForm } from '@/components/CommentForms';

export default async function AccountComments({ userId, language }: {userId:string;language:'en'|'pt'}) {
  const pt=language==='pt';
  try {
    const {commenter,comments,ownedIds}=await commenterAccount(userId);
    const choices=await Promise.all((await getPublishedRestaurants()).filter(r=>r.ownerId!=='demo'&&!ownedIds.includes(r.id!)).map(async r=>({id:r.id!,name:r.name,items:(await getSavedMenu(r.id!,r.status==='verified')).filter(item=>item.referenceCode).map(item=>({reference:item.referenceCode!,name:!pt&&item.nameEn?item.nameEn:item.name}))})));
    const restaurants=choices.filter(r=>r.items.length>0);
    const statuses:Record<string,string>=pt?{pending:'Em análise',approved:'Publicado',rejected:'Não publicado',removed:'Removido'}:{pending:'Awaiting review',approved:'Published',rejected:'Not published',removed:'Removed'};
    return <section className="mt-8 border-t border-[#ded8c5] pt-6">
      <h2 className="text-xl font-semibold">{pt?'Os meus comentários':'My comments'}</h2>
      {commenter?.active==='1'?<><p className="mt-3 text-sm text-emerald-700">{pt?'Nome público verificado':'Verified public name'}: {commenter.public_name}</p><NewCommentForm restaurants={restaurants} language={language}/></>:<><p className="mt-3 text-sm text-[#555]">{pt?'A equipa AngolaLab precisa de confirmar a sua identidade e telefone antes de autorizar comentários. O registo de conta não concede esta autorização automaticamente.':'AngolaLab staff must confirm your identity and phone before enabling comments. Signing up does not automatically grant this permission.'}</p><details className="mt-3 text-sm"><summary className="cursor-pointer text-emerald-700">{pt?'O meu ID para verificação':'My account ID for verification'}</summary><code className="mt-2 block break-all">{userId}</code></details></>}
      {comments.length>0&&<ul className="mt-5 space-y-4">{comments.map(c=><li key={c.id} className="rounded-lg border border-[#ded8c5] p-4 text-sm"><p className="font-semibold">{c.name} · {c.menu_reference}</p><p className="mt-2 whitespace-pre-line break-words">{c.body}</p><p className="mt-2 text-[#555]">{statuses[c.status!]}</p>{['pending','approved'].includes(c.status!)&&<form action={removeOwnComment} className="mt-3"><input type="hidden" name="id" value={c.id!}/><button className="text-red-700 underline">{pt?'Remover o meu comentário':'Remove my comment'}</button></form>}</li>)}</ul>}
    </section>;
  } catch {return <p role="status" className="mt-6 text-sm">{pt?'Não foi possível carregar os comentários. Tente novamente mais tarde.':'Unable to load comments. Please try again later.'}</p>;}
}
