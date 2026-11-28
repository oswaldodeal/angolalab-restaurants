'use client';
import { useActionState, useState } from 'react';
import { requestCommentAccess, submitComment } from '@/app/owner/comment-actions';
import { moderateComment, verifyCommenter } from '@/app/staff/review/comment-actions';

const input='mt-1 w-full rounded-lg border border-[#ded8c5] bg-white p-3';
const button='rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50';
export function NewCommentForm({ restaurants, language, initialRestaurantId }: { initialRestaurantId?: string; restaurants: {id:string;name:string;items:{reference:string;name:string}[]}[]; language:'en'|'pt' }) {
  const pt=language==='pt';
  const [result,action,pending]=useActionState(submitComment,'');
  const [restaurantId,setRestaurantId]=useState(() => restaurants.some(r => r.id === initialRestaurantId) ? initialRestaurantId! : '');
  const items=restaurants.find(r=>r.id===restaurantId)?.items??[];
  const messages:Record<string,string>=pt?{
    'blocked':'O acesso aos comentários está bloqueado.',
    'signed-out':'Entre novamente na sua conta para comentar.',
    'permission-required':'A equipa precisa de autorizar os seus comentários. A verificação do restaurante é separada.',
    'own-restaurant':'Não pode comentar o seu próprio restaurante. Para testar, use uma conta de cliente autorizada e não associada a este restaurante.',
    'invalid-reference':'Escolha um prato ou bebida da ementa deste restaurante. Se o item foi removido, atualize a página.',
    'restaurant-unavailable':'Escolha um restaurante publicado com itens na ementa.',
    'restaurant-limit':'Já enviou um comentário para este restaurante nas últimas 24 horas. Aguarde antes de enviar outro.',
    'daily-limit':'Atingiu o limite de cinco comentários em 24 horas. Tente mais tarde.',
    'invalid-body':'Escreva entre 20 e 1000 caracteres sobre a sua experiência.',
    'consent-required':'Confirme a sua experiência e a autorização para publicar.',
    'comment-pending':'Comentário guardado. Aguarda análise da equipa; ainda não está público.',
  }:{
    'blocked':'Your commenting access is blocked.',
    'signed-out':'Sign in again to leave a comment.',
    'permission-required':'Staff need to enable your commenting access. Restaurant verification is separate.',
    'own-restaurant':'You cannot review your own restaurant. To test, use an authorised customer account that is not linked to this restaurant.',
    'invalid-reference':'Choose a dish or drink from this restaurant’s menu. If the item was removed, refresh the page.',
    'restaurant-unavailable':'Choose a published restaurant with saved menu items.',
    'restaurant-limit':'You already submitted a comment for this restaurant in the last 24 hours. Wait before submitting another.',
    'daily-limit':'You reached the limit of five comments in 24 hours. Please try later.',
    'invalid-body':'Write between 20 and 1000 characters about your experience.',
    'consent-required':'Confirm your experience and permission to publish.',
    'comment-pending':'Comment saved. Awaiting staff review; it is not public yet.',
  };
  if(!restaurants.length) return <p className="mt-4 text-sm text-[#555]">{pt?'Ainda não há restaurantes elegíveis para comentar. O restaurante precisa de ter pratos ou bebidas guardados na ementa. Os seus próprios restaurantes não estão incluídos.':'There are no eligible restaurants to review yet. A restaurant needs saved dishes or drinks on its menu. Your own restaurants are excluded.'}</p>;
  return <form action={action} className="mt-4 space-y-4 text-sm">
    <fieldset disabled={pending} className="space-y-4">
      <p className="text-xs text-[#555]">{pt?'Escolha o restaurante e o prato ou bebida que experimentou. Os seus próprios restaurantes não estão incluídos.':'Choose the restaurant and the dish or drink you tried. Your own restaurants are excluded.'}</p>
      <label className="block">{pt?'Restaurante':'Restaurant'}<select name="restaurantId" required value={restaurantId} onChange={event=>setRestaurantId(event.target.value)} className={input}><option value="">{pt?'Escolher restaurante':'Choose restaurant'}</option>{restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className="block">{pt?'Prato ou bebida · referência da ementa':'Dish or drink · menu reference'}<select key={restaurantId} name="reference" required defaultValue="" disabled={!restaurantId} className={input}><option value="">{pt?'Escolher prato ou bebida':'Choose dish or drink'}</option>{items.map(item=><option key={item.reference} value={item.reference}>{item.name} · {item.reference}</option>)}</select></label>
      <label className="block">{pt?'A sua experiência (20–1000 caracteres)':'Your experience (20–1000 characters)'}<textarea name="body" required minLength={20} maxLength={1000} rows={4} className={input}/></label>
      <label className="flex items-start gap-2"><input type="checkbox" name="consent" required className="mt-1"/><span>{pt?'Confirmo que esta é a minha experiência e autorizo a publicação com o meu nome público. Não incluí contactos ou dados privados.':'This is my own experience. I agree to publication under my public name and have not included contact details or private information.'}</span></label>
      <p className="text-xs text-[#555]">{pt?'Análise da equipa antes de publicar. Um comentário por restaurante a cada 24 horas. Se retirar um comentário antes da análise, pode enviar uma versão corrigida. Não comente o seu próprio restaurante.':'Staff review each comment before publication. One comment per restaurant every 24 hours. If you withdraw a comment before review, you can submit a corrected version. Do not review your own restaurant.'}</p>
      <button disabled={pending} className={button}>{pending?(pt?'A enviar…':'Sending…'):(pt?'Enviar para análise':'Submit for review')}</button>
    </fieldset>
    <p role="status" aria-live="polite" className={result==='comment-pending'?'text-emerald-700':'text-red-700'}>{result?(messages[result]??(pt?'Não foi possível enviar. Atualize a página e tente novamente.':'Could not submit. Refresh the page and try again.')):null}</p>
  </form>;
}
export function CommentAccessRequestForm({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(requestCommentAccess, '');
  return <form action={action} className="mt-4 space-y-2 text-sm">
    <button disabled={pending} className={button}>
      {pending ? (pt ? 'A enviar…' : 'Sending…') : (pt ? 'Pedir autorização para comentar' : 'Request commenting access')}
    </button>
    {result && <p role="status" className="text-red-700">
      {result === 'blocked'
        ? (pt ? 'O acesso aos comentários está bloqueado.' : 'Your commenting access is blocked.')
        : result === 'signed-out'
        ? (pt ? 'Entre novamente para enviar o pedido.' : 'Sign in again to send your request.')
        : (pt ? 'Não foi possível enviar o pedido. Tente novamente.' : 'Could not send your request. Please try again.')}
    </p>}
  </form>;
}

export function VerifyCommenterForm({ accountId }: { accountId?: string }) {
  const [result,action,pending]=useActionState(verifyCommenter,'');
  return <form action={action} className="mt-4 space-y-3 text-sm">
    <fieldset disabled={pending} className="space-y-3">
      <label className="block">Account ID<input name="userId" defaultValue={accountId} readOnly={Boolean(accountId)} required maxLength={105} placeholder="user_…" className={input}/></label>
      <label className="block">Public name (not an email or phone)<input name="publicName" minLength={2} maxLength={50} className={input}/></label>
      <label className="block">Private verification note (20–2000 characters)<textarea name="note" required minLength={20} maxLength={2000} rows={3} className={input}/></label>
      <label className="flex gap-2"><input type="checkbox" name="checked"/><span>I confirmed the person’s identity, phone ownership and permission to use this public name. Phone details remain private.</span></label>
      <div className="flex flex-wrap gap-3"><button disabled={pending} className={button}>Allow comments</button>{!accountId && <button disabled={pending} name="intent" value="revoke" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Revoke commenting access</button>}</div>
    </fieldset>
    <p role="status">{result==='verified'?'Commenting access verified.':result==='revoked'?'Commenting access revoked. Published comments are hidden.':result?'Check the account ID, public name, verification checkbox and note.':null}</p>
  </form>;
}
export function ModerateCommentForm({ id, version, english, portuguese, published, underReview }: {id:string;version:string;english:string;portuguese:string;published:boolean;underReview?:boolean}) {
  const [result,action,pending]=useActionState(moderateComment,'');
  return <form action={action} className="mt-3 space-y-3 text-sm">
    <input type="hidden" name="id" value={id}/><input type="hidden" name="version" value={version}/>
    <label className="block">English translation · optional
      <textarea key={version} lang="en" disabled={pending} name="bodyEn" maxLength={1500} rows={3} defaultValue={english} className={input}/>
      <span className="mt-1 block text-xs text-[#555]">Review the translation against the original above. Leave blank to show the original on the English page.</span>
    </label>
    <label className="block">Portuguese translation · optional
      <textarea key={`pt:${version}`} lang="pt" disabled={pending} name="bodyPt" maxLength={1500} rows={3} defaultValue={portuguese} className={input}/>
      <span className="mt-1 block text-xs text-[#555]">Review the translation against the original above. Leave blank to show the original on the Portuguese page.</span>
    </label>
    <label className="block">Private review note<textarea disabled={pending} name="note" required minLength={20} maxLength={2000} rows={2} className={input}/></label>
    <div className="flex flex-wrap gap-3"><button disabled={pending} name="decision" value="approved" className={button}>{underReview ? 'Restore comment' : published ? 'Save published comment' : 'Publish comment'}</button>{published && !underReview && <button disabled={pending} name="decision" value="investigate" className="rounded-lg border border-[#ded8c5] px-4 py-2 font-semibold">Mark under review</button>}<button disabled={pending} name="decision" value="rejected" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Reject / hide</button></div>
    <p role="status">{result==='review-saved'?'Comment decision saved.':result?'Unable to save. Check the note or refresh this review.':null}</p>
  </form>;
}
