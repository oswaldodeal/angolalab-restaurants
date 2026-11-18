'use client';
import { useActionState } from 'react';
import { submitComment } from '@/app/owner/comment-actions';
import { moderateComment, verifyCommenter } from '@/app/staff/review/comment-actions';

const input='mt-1 w-full rounded-lg border border-[#ded8c5] bg-white p-3';
const button='rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50';
export function NewCommentForm({ restaurants, language }: { restaurants: {id:string;name:string}[]; language:'en'|'pt' }) {
  const pt=language==='pt';
  const [result,action,pending]=useActionState(submitComment,'');
  return <form action={action} className="mt-4 space-y-4 text-sm">
    <fieldset disabled={pending} className="space-y-4">
      <label className="block">{pt?'Restaurante':'Restaurant'}<select name="restaurantId" required className={input}><option value="">{pt?'Escolher restaurante':'Choose restaurant'}</option>{restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
      <label className="block">{pt?'Referência do prato ou bebida':'Dish or drink reference'}<input name="reference" required pattern="AL-[0-9]{6,12}" placeholder="AL-000001" maxLength={15} className={input}/><span className="mt-1 block text-xs text-[#555]">{pt?'Copie a referência da ementa deste restaurante.':'Copy the reference from this restaurant’s menu.'}</span></label>
      <label className="block">{pt?'A sua experiência (20–1000 caracteres)':'Your experience (20–1000 characters)'}<textarea name="body" required minLength={20} maxLength={1000} rows={4} className={input}/></label>
      <label className="flex items-start gap-2"><input type="checkbox" name="consent" required className="mt-1"/><span>{pt?'Confirmo que esta é a minha experiência e autorizo a publicação com o meu nome público. Não incluí contactos ou dados privados.':'This is my own experience. I agree to publication under my public name and have not included contact details or private information.'}</span></label>
      <p className="text-xs text-[#555]">{pt?'Análise da equipa antes de publicar. Um comentário por restaurante a cada 24 horas. Não comente o seu próprio restaurante.':'Staff review each comment before publication. One comment per restaurant every 24 hours. Do not review your own restaurant.'}</p>
      <button disabled={pending} className={button}>{pending?(pt?'A enviar…':'Sending…'):(pt?'Enviar para análise':'Submit for review')}</button>
    </fieldset>
    <p role="status" className={result==='comment-pending'?'text-emerald-700':'text-red-700'}>{result==='comment-pending'?(pt?'Comentário guardado. Aguarda análise da equipa.':'Comment saved. Awaiting staff review.'):result==='not-allowed'?(pt?'Verifique a sua autorização, a referência e o limite de comentários.':'Check your commenting permission, menu reference and comment limit.'):result?(pt?'Não foi possível enviar. Verifique os dados e tente novamente.':'Could not submit. Check the details and try again.'):null}</p>
  </form>;
}
export function VerifyCommenterForm() {
  const [result,action,pending]=useActionState(verifyCommenter,'');
  return <form action={action} className="mt-4 space-y-3 text-sm">
    <fieldset disabled={pending} className="space-y-3">
      <label className="block">Account ID<input name="userId" required maxLength={105} placeholder="user_…" className={input}/></label>
      <label className="block">Public name (not an email or phone)<input name="publicName" minLength={2} maxLength={50} className={input}/></label>
      <label className="block">Private verification note (20–2000 characters)<textarea name="note" required minLength={20} maxLength={2000} rows={3} className={input}/></label>
      <label className="flex gap-2"><input type="checkbox" name="checked"/><span>I confirmed the person’s identity, phone ownership and permission to use this public name. Phone details remain private.</span></label>
      <div className="flex flex-wrap gap-3"><button disabled={pending} className={button}>Allow comments</button><button disabled={pending} name="intent" value="revoke" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Revoke commenting access</button></div>
    </fieldset>
    <p role="status">{result==='verified'?'Commenting access verified.':result==='revoked'?'Commenting access revoked. Published comments are hidden.':result?'Check the account ID, public name, verification checkbox and note.':null}</p>
  </form>;
}
export function ModerateCommentForm({ id, version }: {id:string;version:string}) {
  const [result,action,pending]=useActionState(moderateComment,'');
  return <form action={action} className="mt-3 space-y-3 text-sm">
    <input type="hidden" name="id" value={id}/><input type="hidden" name="version" value={version}/>
    <label className="block">Private review note<textarea disabled={pending} name="note" required minLength={20} maxLength={2000} rows={2} className={input}/></label>
    <div className="flex flex-wrap gap-3"><button disabled={pending} name="decision" value="approved" className={button}>Publish comment</button><button disabled={pending} name="decision" value="rejected" className="rounded-lg border border-red-200 px-4 py-2 text-red-700">Reject / hide</button></div>
    <p role="status">{result==='review-saved'?'Comment decision saved.':result?'Unable to save. Check the note or refresh this review.':null}</p>
  </form>;
}
