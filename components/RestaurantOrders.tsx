import { randomUUID } from 'node:crypto';
import { getPublishedRestaurant } from '@/lib/restaurant-data';
import { getRestaurantOrders } from '@/lib/restaurant-orders';
import { CounterOrderForm, PlaceOrderForm } from './RestaurantOrderForms';

export default async function RestaurantOrders({ userId, language, restaurantId, counter = false }: {
  userId: string; language: 'en' | 'pt'; restaurantId?: string; counter?: boolean;
}) {
  const pt = language === 'pt';
  const placing = !counter && Boolean(restaurantId);
  const statuses: Record<string,string> = pt
    ? { pending: 'Aguarda confirmação do balcão', accepted: 'Aceite pelo balcão', declined: 'Recusado', completed: 'Concluído' }
    : { pending: 'Awaiting counter confirmation', accepted: 'Accepted by the counter', declined: 'Declined', completed: 'Completed' };
  const customerMessages: Record<string,string> = pt
    ? {
        pending: 'Aguarda a confirmação do balcão antes de pagar.',
        accepted: 'O restaurante confirmou o teu pedido. Paga no balcão.',
        declined: 'O restaurante não pôde aceitar este pedido. Não é necessário pagar.',
        completed: 'O restaurante marcou este pedido como concluído.',
      }
    : {
        pending: 'Wait for the counter to confirm before paying.',
        accepted: 'The restaurant confirmed your order. Pay at the counter.',
        declined: 'The restaurant couldn’t accept this order. No payment is needed.',
        completed: 'The restaurant marked this order as completed.',
      };
  const reasons: Record<string,string> = pt
    ? { unavailable: 'Item indisponível', capacity: 'Capacidade do balcão', other: 'Outro' }
    : { unavailable: 'Item unavailable', capacity: 'Counter capacity', other: 'Other' };
  try {
    const [orders,restaurant] = await Promise.all([
      getRestaurantOrders(userId,restaurantId,counter),
      placing && restaurantId ? getPublishedRestaurant(restaurantId,language) : null,
    ]);
    if (!counter && !placing && !orders.length) return null;
    const money = (price: string, country?: string | null) => new Intl.NumberFormat(pt ? 'pt-PT' : 'en-GB', { style: 'currency', currency: country === 'GB' ? 'GBP' : country === 'PT' ? 'EUR' : 'AOA' }).format(Number(price));
    const items = restaurant?.menuItems?.flatMap(item => item.referenceCode && item.availability === 'available' ? [{
      reference: item.referenceCode, name: pt ? item.name : item.nameEn || item.name, price: money(item.price, restaurant.country),
    }] : []) ?? [];
    const pendingOrder = orders.some(order => order.restaurantId === restaurantId && order.status === 'pending');
    const history = counter ? orders.filter(order => order.status === 'completed' || order.status === 'declined') : [];
    const activeOrders = counter ? orders.filter(order => order.status === 'pending' || order.status === 'accepted') : orders;
    const renderOrder = (order: (typeof orders)[number]) => {
        const declinedLine = order.lines.find(line => line.reference === order.decline_item);
        const declinedName = declinedLine && (pt ? declinedLine.name : declinedLine.nameEn || declinedLine.name);
        return <article key={order.id} className="rounded-lg border border-[#ded8c5] bg-white p-3">
          <p className="font-semibold">{!counter && order.restaurantName && <>{order.restaurantName} · </>}{statuses[order.status]} · <code className="break-all">{order.id}</code></p>
          {!counter && <p className="mt-2">{customerMessages[order.status]}</p>}
          <ul className="mt-2">
            {order.lines.map(line => <li key={line.reference}>
              {line.quantity} × {pt ? line.name : line.nameEn || line.name} · {line.reference} · {money(line.price, order.country)}
            </li>)}
          </ul>
          {order.decline_reason && <p className="mt-2">{reasons[order.decline_reason]}{declinedName && <> · {declinedName}</>}{' '}{order.decline_item && <code>{order.decline_item}</code>} {order.decline_note}</p>}
          {counter && (order.status === 'pending' || order.status === 'accepted') &&
            <CounterOrderForm key={order.status} language={language} orderId={order.id!} accepted={order.status === 'accepted'}
              items={order.lines.map(line => ({reference: line.reference,name: pt ? line.name : line.nameEn || line.name}))}/>}
      </article>;
    };
    return <section id={counter ? `counter-orders-${restaurantId}` : 'my-orders'} className="mt-6 space-y-3 rounded-lg border border-[#ded8c5] bg-[#fffdf8] p-4 text-sm">
      <h2 className="text-lg font-semibold">{counter ? (pt ? 'Pedidos do balcão' : 'Counter orders') : (pt ? 'Os meus pedidos' : 'My orders')}</h2>
      {placing && restaurant && restaurant.ownerId !== 'demo' && restaurantId && <PlaceOrderForm restaurantId={restaurantId} language={language} orderId={randomUUID()} items={items} hasPending={pendingOrder}
        menuHref={`${pt ? '/pt/restaurantes' : '/en/restaurants'}/${restaurantId}#menu`}/>}
      {counter && !activeOrders.length && <p>{pt ? 'Não há pedidos pendentes ou aceites.' : 'No pending or accepted orders.'}</p>}
      {activeOrders.map(renderOrder)}
      {history.length > 0 && <details className="group rounded-lg border border-[#ded8c5] p-3">
        <summary className="cursor-pointer font-semibold">
          {pt ? 'Histórico de pedidos' : 'Order history'} ({history.length})
          <span className="ml-2 text-emerald-800 group-open:hidden">{pt ? 'Ler mais' : 'Read more'}</span>
          <span className="ml-2 hidden text-emerald-800 group-open:inline">{pt ? 'Ler menos' : 'Read less'}</span>
        </summary>
        <div className="mt-3 space-y-3">{history.map(renderOrder)}</div>
      </details>}
    </section>;
  } catch {
    if (!counter && !placing) return null;
    return <p role="status" className="mt-4">{pt ? 'Não foi possível carregar os pedidos.' : 'Unable to load orders.'}</p>;
  }
}
