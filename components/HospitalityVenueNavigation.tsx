import Link from 'next/link';
import { BUSINESS_TYPES } from '@/lib/business-types';

export default function HospitalityVenueNavigation({
  language, directory = false, showDemo = true,
}: { language: 'pt' | 'en'; directory?: boolean; showDemo?: boolean }) {
  const pt = language === 'pt';
  const restaurantHref = pt ? '/pt/restaurantes' : '/en/restaurants';

  return (
    <nav aria-label={pt ? 'Tipos de estabelecimento' : 'Hospitality venues'} className="mt-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium sm:gap-x-7">
        {BUSINESS_TYPES.map((type) => type.id === 'restaurant' ? (
          <Link key={type.id} href={directory ? '#restaurant-filters' : restaurantHref}
            aria-current={directory ? 'page' : undefined}
            className="inline-flex min-h-11 items-center whitespace-nowrap font-semibold text-[#987515] underline decoration-[#D2AC37] decoration-2 underline-offset-8 hover:text-[#6d5210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b18a23]">
            {type[language]}
          </Link>
        ) : (
          <span key={type.id} title={pt ? 'Em breve' : 'Planned'} className="inline-flex min-h-11 items-center whitespace-nowrap text-[#777777]">
            {type[language]}
          </span>
        ))}
      </div>
      {showDemo && (
        <Link href={pt ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}
          className="mt-4 inline-flex text-xs font-medium text-[#82620f] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#b18a23]">
          {pt ? 'Demonstração de Perfis Adaptáveis' : 'Adaptive Profile Demo'}
        </Link>
      )}
    </nav>
  );
}
