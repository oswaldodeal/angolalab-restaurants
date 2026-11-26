'use client';

import { useActionState, useState } from 'react';
import { requestProfessionalProfileAccess, shareFppPost } from '@/app/professional-profile/actions';
import { fppPostStatusLabels, fppPostTypes, type FppRequestStatus } from '@/lib/fpp-posts';
import type { FppPost } from '@/lib/fpp-community';

const button = 'rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-60';
const input = 'mt-1 block w-full rounded-lg border border-[#ded8c5] bg-white px-3 py-2';

export default function FppParticipation({ language, status, posts }: {
  language: 'en' | 'pt';
  status: FppRequestStatus | null;
  posts: FppPost[];
}) {
  const pt = language === 'pt';
  const [requestResult, request, requesting] = useActionState(requestProfessionalProfileAccess, null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [postResult, sendPost, sending] = useActionState(async (_previous: string | null, formData: FormData) => {
    const result = await shareFppPost(null, formData);
    if (result === 'submitted') {
      setTitle('');
      setBody('');
    }
    return result;
  }, null);

  return (
    <section className="mt-6 border-t border-[#ded8c5] pt-5">
      <h3 className="font-semibold">{pt ? 'Participação na comunidade FPP' : 'FPP community access'}</h3>
      {status === 'pending' && <p className="mt-3">{pt ? 'O teu pedido aguarda análise da equipa.' : 'Your request is awaiting staff review.'}</p>}
      {status !== 'approved' && status !== 'pending' &&
        <form action={request} className="mt-3 space-y-3">
          <p>{status === 'declined'
            ? (pt ? 'O teu pedido foi recusado. Podes enviar um novo pedido.' : 'Your request was declined. You can submit a new request.')
            : (pt ? 'Pede acesso para partilhar ideias de negócio, perguntas e projetos.' : 'Request access to share business ideas, questions and projects.')}</p>
          <button disabled={requesting} className={button}>{pt ? 'Pedir acesso ao FPP' : 'Request FPP access'}</button>
        </form>}
      {requestResult && requestResult !== 'requested' &&
        <p role="status" className="mt-3 text-red-700">{pt ? 'Não foi possível enviar o pedido. Verifica o estado do perfil e tenta novamente.' : 'We couldn’t send the request. Check your profile status and try again.'}</p>}
      {status === 'approved' &&
        <form action={sendPost} className="mt-3 space-y-4">
          <p>{pt ? 'O teu acesso foi aprovado. A equipa analisa cada publicação antes de aparecer na comunidade.' : 'Your access is approved. Staff review each post before it appears in the community.'}</p>
          <fieldset disabled={sending} className="space-y-4">
            <label className="block">{pt ? 'Tipo de publicação' : 'Post type'}
              <select name="kind" className={input}>
                {Object.entries(fppPostTypes).map(([kind, label]) => <option key={kind} value={kind}>{label[language]}</option>)}
              </select>
            </label>
            <label className="block">{pt ? 'Título' : 'Title'}
              <input name="title" className={input} minLength={3} maxLength={120} required value={title} onChange={event => setTitle(event.target.value)} />
            </label>
            <label className="block">{pt ? 'A tua ideia, pergunta ou projeto' : 'Your idea, question or project'}
              <textarea name="body" className={input} rows={5} minLength={10} maxLength={3000} required value={body} onChange={event => setBody(event.target.value)} />
            </label>
            <label className="flex items-start gap-2">
              <input name="consent" type="checkbox" required className="mt-1" />
              <span>{pt ? 'Autorizo a publicação deste texto com o meu nome de apresentação.' : 'I agree to share this text under my display name.'}</span>
            </label>
            <button className={button}>{sending ? (pt ? 'A enviar…' : 'Sending…') : (pt ? 'Enviar para publicação' : 'Submit for publication')}</button>
          </fieldset>
          {postResult && <p role="status" className={postResult === 'submitted' ? 'text-emerald-800' : 'text-red-700'}>
            {postResult === 'submitted' ? (pt ? 'Publicação enviada para análise.' : 'Post submitted for review.')
              : postResult === 'invalid' ? (pt ? 'Verifica o título, o texto e a autorização.' : 'Check the title, text and permission to publish.')
              : (pt ? 'Não foi possível enviar. Verifica o teu acesso e tenta novamente.' : 'We couldn’t submit your post. Check your access and try again.')}
          </p>}
        </form>}
      {posts.length > 0 && <div className="mt-5">
        <h4 className="font-semibold">{pt ? 'As minhas publicações recentes' : 'My recent posts'}</h4>
        <ul className="mt-2 divide-y divide-[#ded8c5]">
          {posts.map(post => <li key={post.id} className="py-2 break-words">
            <span className="font-medium">{post.title}</span>
            <span className="block text-sm">{fppPostTypes[post.kind][language]} · {fppPostStatusLabels[post.status][language]}</span>
          </li>)}
        </ul>
      </div>}
    </section>
  );
}
