'use client';

import { useActionState } from 'react';
import { decideRestaurantOrder, submitRestaurantOrder } from '@/app/orders/actions';

const input = 'rounded-lg border border-[#ded8c5] bg-white p-2';
const button = 'rounded-lg bg-[#252a32] px-4 py-2 font-semibold text-white disabled:opacity-50';
type Language = 'en' | 'pt';

export function PlaceOrderForm({ language, orderId, items }: {
  language: Language; orderId: string; items: { reference: string; name: string; price: string }[];
}) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(submitRestaurantOrder, '');
  const messages: Record<string,string> = pt ? {
    submitted: 'Pedido enviado ao balcão.', blocked: 'O acesso aos pedidos está bloqueado.',
    'verification-required': 'Verifica o telefone ou e-mail da tua conta para fazer pedidos.',
    invalid: 'Escolhe pelo menos um item, com quantidade entre 1 e 10.',
    stale: 'Verifica se já tens um pedido pendente ou se a ementa mudou.',
  } : {
    submitted: 'Order sent to the counter.', blocked: 'Your ordering access is blocked.',
    'verification-required': 'Verify your account phone number or email to order.',
    invalid: 'Choose at least one item, with a quantity between 1 and 10.',
    stale: 'Check whether you already have a pending order or the menu has changed.',
  };
  return <form action={action} className="mt-3 space-y-3">
    <input type="hidden" name="orderId" value={orderId}/>
    <fieldset disabled={pending} className="space-y-3">
      <legend>{pt ? 'Indica a quantidade de cada item (0–10).' : 'Enter a quantity for each item (0–10).'}</legend>
      {items.map(item => <label key={item.reference} className="flex flex-wrap items-center justify-between gap-2">
        <span>{item.name} · {item.reference} · {item.price}</span>
        <input type="number" inputMode="numeric" name={`item:${item.reference}`} min={0} max={10} step={1} defaultValue={0} className={`${input} w-20`}/>
      </label>)}
      <button className={button}>{pt ? 'Enviar pedido ao balcão' : 'Send order to counter'}</button>
    </fieldset>
    {result && <p role="status">{messages[result] ?? (pt ? 'Não foi possível enviar o pedido.' : 'Unable to send the order.')}</p>}
  </form>;
}

export function CounterOrderForm({ language, orderId, accepted, items }: {
  language: Language; orderId: string; accepted: boolean; items: { reference: string; name: string }[];
}) {
  const pt = language === 'pt';
  const [result, action, pending] = useActionState(decideRestaurantOrder, '');
  return <form action={action} className="mt-3 space-y-2">
    <input type="hidden" name="orderId" value={orderId}/>
    <fieldset disabled={pending} className="space-y-2">
      {accepted ? <button name="decision" value="completed" className={button}>{pt ? 'Marcar como concluído' : 'Mark completed'}</button> : <>
        <button name="decision" value="accepted" className={button}>{pt ? 'Aceitar pedido' : 'Accept order'}</button>
        <details>
          <summary className="cursor-pointer font-semibold text-red-800">{pt ? 'Recusar pedido' : 'Decline order'}</summary>
          <div className="mt-2 grid gap-2">
            <label>{pt ? 'Motivo' : 'Reason'} <select name="reason" className={input}>
              <option value="">{pt ? 'Escolher motivo' : 'Choose reason'}</option>
              <option value="unavailable">{pt ? 'Item indisponível' : 'Item unavailable'}</option>
              <option value="capacity">{pt ? 'Capacidade do balcão' : 'Counter capacity'}</option>
              <option value="other">{pt ? 'Outro' : 'Other'}</option>
            </select></label>
            <label>{pt ? 'Item (obrigatório se indisponível)' : 'Item (required if unavailable)'} <select name="item" className={input}>
              <option value="">{pt ? 'Escolher item' : 'Choose item'}</option>
              {items.map(item => <option key={item.reference} value={item.reference}>{item.name} · {item.reference}</option>)}
            </select></label>
            <label>{pt ? 'Nota para o cliente (opcional)' : 'Note for the customer (optional)'}<textarea name="note" maxLength={300} rows={2} className={`${input} mt-1 block w-full`}/></label>
            <button name="decision" value="declined" className={`${button} justify-self-start`}>{pt ? 'Confirmar recusa' : 'Confirm decline'}</button>
          </div>
        </details>
      </>}
    </fieldset>
    {result && <p role="status">{result === 'saved'
      ? (pt ? 'Decisão guardada.' : 'Decision saved.')
      : (pt ? 'Verifica o motivo e o item ou actualiza a página.' : 'Check the reason and item, or refresh the page.')}</p>}
  </form>;
}
