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
    return <section id={counter ? `counter-orders-${restaurantId}` : 'my-orders'} className="mt-6 space-y-3 rounded-lg border border-[#ded8c5] bg-[#fffdf8] p-4 text-sm">
      <h2 className="text-lg font-semibold">{counter ? (pt ? 'Pedidos do balcão' : 'Counter orders') : (pt ? 'Os meus pedidos' : 'My orders')}</h2>
      {placing && <p>{pt ? 'Aguarda a confirmação e paga no balcão.' : 'Wait for confirmation and pay at the counter.'}</p>}
      {placing && restaurant && restaurant.ownerId !== 'demo' && restaurantId && <PlaceOrderForm restaurantId={restaurantId} language={language} orderId={randomUUID()} items={items} hasPending={pendingOrder}
        menuHref={`${pt ? '/pt/restaurantes' : '/en/restaurants'}/${restaurantId}#menu`}/>}
      {counter && !orders.length && <p>{pt ? 'Ainda não há pedidos.' : 'No orders yet.'}</p>}
      {orders.map(order => <article key={order.id} className="rounded-lg border border-[#ded8c5] bg-white p-3">
        <p className="font-semibold">{!counter && order.restaurantName && <>{order.restaurantName} · </>}{statuses[order.status]} · <code className="break-all">{order.id}</code></p>
        <ul className="mt-2">
          {order.lines.map(line => <li key={line.reference}>
            {line.quantity} × {pt ? line.name : line.nameEn || line.name} · {line.reference} · {money(line.price, order.country)}
          </li>)}
        </ul>
        {order.decline_reason && <p className="mt-2">{reasons[order.decline_reason]} {order.decline_item && <code>{order.decline_item}</code>} {order.decline_note}</p>}
        {counter && (order.status === 'pending' || order.status === 'accepted') &&
          <CounterOrderForm key={order.status} language={language} orderId={order.id!} accepted={order.status === 'accepted'}
            items={order.lines.map(line => ({reference: line.reference,name: pt ? line.name : line.nameEn || line.name}))}/>}
      </article>)}
    </section>;
  } catch {
    if (!counter && !placing) return null;
    return <p role="status" className="mt-4">{pt ? 'Não foi possível carregar os pedidos.' : 'Unable to load orders.'}</p>;
  }
}
