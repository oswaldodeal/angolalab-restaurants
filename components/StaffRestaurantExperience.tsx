import { prepareRestaurantOrders } from '@/lib/restaurant-orders';
import { experienceCriteria } from '@/lib/experience-criteria';
import { executePrivateSql, sqlRows } from '@/lib/turso';
import { StaffExperienceReviewForm } from './RestaurantExperienceForms';

export default async function StaffRestaurantExperience() {
  try {
    await prepareRestaurantOrders();
    const rows = sqlRows(await executePrivateSql(`SELECT s.*, i.restaurant_name
      FROM restaurant_experience_surveys s JOIN restaurant_orders r ON r.id=s.order_id
      LEFT JOIN restaurant_intake i ON i.id=r.restaurant_id
      ORDER BY s.reviewed_at IS NULL DESC,s.submitted_at DESC LIMIT 100`));
    return <details className="mt-6 rounded-xl border border-[#ded8c5] p-4">
      <summary className="cursor-pointer font-semibold">Restaurant experience surveys</summary>
      {!rows.length && <p className="mt-3 text-sm">No surveys yet.</p>}
      {rows.map(row => {
        const ratings = JSON.parse(row.ratings!);
        return <article key={row.order_id} className="mt-3 rounded-lg border border-[#ded8c5] p-3 text-sm">
          <h2 className="font-semibold">{row.restaurant_name} · {row.reviewed_at ? 'Reviewed' : 'Awaiting review'}</h2>
          <p className="mt-1 break-all">{row.order_id}</p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">{experienceCriteria.map(({key,en}) =>
            <div key={key}><dt>{en}</dt><dd className="font-semibold">{ratings[key] === 'na' ? 'Not applicable' : `${ratings[key]}/5`}</dd></div>)}</dl>
          {row.comment && <p className="mt-2 whitespace-pre-wrap break-words">{row.comment}</p>}
          <StaffExperienceReviewForm key={row.reviewed_at ?? ''} orderId={row.order_id!} reviewedAt={row.reviewed_at ?? ''}
            analysis={row.analysis ?? ''} visit={row.visit_analysis ?? ''}/>
        </article>;
      })}
    </details>;
  } catch { return <p className="mt-6">Unable to load restaurant experience surveys.</p>; }
}
