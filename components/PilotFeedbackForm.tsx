'use client';

import { useActionState, useState } from 'react';
import { sendPilotFeedback } from '@/app/feedback/actions';

export default function PilotFeedbackForm({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  const [body, setBody] = useState('');
  const [result, action, pending] = useActionState(async (previous: string, form: FormData) => {
    const response = await sendPilotFeedback(previous, form);
    if (response === 'sent') setBody('');
    return response;
  }, '');
  const messages: Record<string, string> = pt
    ? { sent: 'Obrigado. A tua opinião foi enviada.', wait: 'Aguarda um minuto antes de enviar outra mensagem.', invalid: 'Escreve uma mensagem de até 2 000 caracteres.', 'signed-out': 'Entra na tua conta para enviar a mensagem.' }
    : { sent: 'Thanks. Your feedback was sent.', wait: 'Wait a minute before sending another message.', invalid: 'Enter a message of up to 2,000 characters.', 'signed-out': 'Sign in to send feedback.' };
  return <section className="mt-6 rounded-lg border border-[#ded8c5] bg-[#fffdf8] p-4 text-sm">
    <h2 className="text-lg font-semibold">{pt ? 'Opinião sobre o AngolaLab' : 'Feedback for AngolaLab'}</h2>
    <form action={action} className="mt-3 space-y-3">
      <label className="block">
        {pt ? 'O que funcionou bem ou onde tiveste dificuldades?' : 'What worked well or where did you get stuck?'}
        <textarea name="body" value={body} onChange={event => setBody(event.target.value)} required maxLength={2000} rows={4}
          className="mt-2 block w-full rounded-lg border border-[#ded8c5] bg-white p-3" />
      </label>
      <p>{pt ? 'A mensagem é privada. Evita incluir dados pessoais ou de pagamento.' : 'Your message is private. Please leave out personal or payment details.'}</p>
      <button disabled={pending} className="rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50">
        {pending ? (pt ? 'A enviar…' : 'Sending…') : (pt ? 'Enviar opinião' : 'Send feedback')}
      </button>
      {result && <p role="status">{messages[result] ?? (pt ? 'Não foi possível enviar. Tenta novamente.' : 'Couldn’t send feedback. Please try again.')}</p>}
    </form>
  </section>;
}
