import Link from 'next/link';
import HospitalityVenueNavigation from '@/components/HospitalityVenueNavigation';
import { CITIES, COUNTRIES, CUISINES, SAMPLE_RESTAURANT_COVER, SAMPLE_MENU_PHOTO, getGoogleMapsUrl, type Restaurant } from '@/lib/store';
import { demoRestaurantPhoto } from '@/lib/demo-photos';
import RestaurantMenuPreview from '@/components/RestaurantMenuPreview';

export default function RestaurantResearchProfile({ restaurant, language }: {
  restaurant: Restaurant;
  language: 'pt' | 'en';
}) {
  const pt = language === 'pt';
  const refinedBasic = restaurant.ownerId === 'demo' && restaurant.id === 'rest-002' && restaurant.status === 'basic';
  const city = CITIES.find((c) => c.id === restaurant.city)?.[language] ?? restaurant.city;
  const country = COUNTRIES.find((c) => c.id === restaurant.country)?.[language] ?? restaurant.country;
  const cuisine = CUISINES.find((c) => c.id === restaurant.cuisine)?.[language] ?? restaurant.cuisine;
  const photo = refinedBasic ? '/demo/sabor-cover.webp' : restaurant.ownerId === 'demo' ? demoRestaurantPhoto(restaurant.id) : restaurant.photos[0];
  const verified = restaurant.status === 'verified';
  const illustrativePhoto = photo === SAMPLE_RESTAURANT_COVER;
  const isDemo = restaurant.ownerId === 'demo';
  const isPro = verified && !isDemo && restaurant.profilePlan === 'pro';
  const mapPinIcon = (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0">
      <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
  const phoneIcon = (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-4 shrink-0 ${isPro ? 'text-[#b38a24]' : ''}`}>
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-1.5 2a14 14 0 0 1-7.5-7.5L9 8 7 3Z" />
    </svg>
  );
  // Illustrative Basic-profile offers only; replace with reviewed owner-submitted data later.
  const demoBasicOffers = isDemo && restaurant.status === 'basic' ? [
    {
      key: 'breakfast',
      title: pt ? 'Pequeno-almoço' : 'Breakfast',
      image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=640&q=80',
      price: restaurant.country === 'GB' ? '£8.50' : 'AOA 3 500',
      period: pt ? 'Dias úteis' : 'Weekdays',
    },
    {
      key: 'lunch',
      title: pt ? 'Almoço' : 'Lunch',
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=640&q=80',
      price: restaurant.country === 'GB' ? '£12.00' : 'AOA 5 000',
      period: pt ? 'Fins de semana' : 'Weekends',
    },
  ] : [];


  return (
    <div className="bg-[#f3f2ef] text-[#242424]">
      <article className="page-rail overflow-hidden">
        {refinedBasic && (
          <div className="flex flex-wrap items-center justify-between gap-5 pt-8">
            <div className="flex min-w-0 items-center gap-4">
              {/* Illustrative identity for the fictional restaurant. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/demo/sabor-logo.svg" alt="" width={110} height={72} className="w-20 shrink-0 sm:w-28" />
              <div className="border-l border-[#d9d5c9] pl-4">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">{restaurant.name}</h1>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#555]">{pt ? 'Restaurante' : 'Restaurant'}</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800">
              {pt ? 'Perfil Básico · Demonstração' : 'Basic profile · Demo'}
            </span>
          </div>
        )}
        {refinedBasic && <HospitalityVenueNavigation language={language} />}
        {/* Mobile: photograph immediately below the header, inside the shared page width. */}
        <section className={refinedBasic ? 'mt-6 sm:hidden' : 'sm:hidden'} aria-label={pt ? 'Fotografia do restaurante' : 'Restaurant photograph'}>
          <div className="relative h-[290px] w-full overflow-hidden bg-gradient-to-br from-[#ad8b50] to-[#252a32]">
            {!photo && !isDemo && <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-white">{pt ? 'Fotografia ainda não adicionada' : 'Photograph not yet added'}</div>}
            {photo && (
              // Temporary illustrative imagery; not a photo of a verified business.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={isDemo || illustrativePhoto ? (pt ? 'Fotografia ilustrativa de restaurante' : 'Illustrative restaurant photograph') : (pt ? `Fotografia de capa de ${restaurant.name}` : `${restaurant.name} cover photo`)} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            )}
            {(isDemo || illustrativePhoto) && <span className="absolute bottom-4 left-4 right-4 rounded-md bg-[#fff0b0] px-3 py-2 text-center text-xs font-bold text-[#57410c]">
              AngolaLab Test · {pt ? 'Imagem ilustrativa' : 'Illustrative image'}
            </span>}
          </div>
        </section>

        {/* Desktop: retain the approved Research Archive order and gold divider. */}
        <div className={refinedBasic ? 'hidden' : 'hidden pt-7 sm:block sm:pt-10'}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#987515]">
            {pt ? 'AngolaLab · Perfil do restaurante' : 'AngolaLab · Restaurant profile'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{restaurant.name}</h1>
          <p className="mt-3 text-base text-[#555]">{cuisine} · {city}, {country}</p>
          <HospitalityVenueNavigation language={language} />
          <div className="mt-7 h-[2px] w-full bg-[#D2AC37]" aria-hidden="true" />
        </div>
        <section className="hidden pt-7 sm:block" aria-label={pt ? 'Fotografia do restaurante' : 'Restaurant photograph'}>
          <div className="relative h-[390px] overflow-hidden rounded-xl border border-[#e9e5db] bg-gradient-to-br from-[#ad8b50] to-[#252a32] lg:h-[510px]">
            {!photo && !isDemo && <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-white">{pt ? 'Fotografia ainda não adicionada' : 'Photograph not yet added'}</div>}
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={isDemo || illustrativePhoto ? (pt ? 'Fotografia ilustrativa de restaurante' : 'Illustrative restaurant photograph') : (pt ? `Fotografia de capa de ${restaurant.name}` : `${restaurant.name} cover photo`)} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            )}
            {(isDemo || illustrativePhoto) && <span className="absolute bottom-6 left-6 rounded-md bg-[#fff0b0] px-4 py-2 text-sm font-bold text-[#57410c]">
              AngolaLab Test · {pt ? 'Imagem ilustrativa' : 'Illustrative image'}
            </span>}
          </div>
        </section>

        <div className="pb-12 pt-7 sm:pt-8">
          {!isDemo && !verified && <p className="mb-7 border-l-4 border-[#D2AC37] bg-[#fbf7ed] p-4 text-sm">{pt ? 'Registo Básico analisado pela equipa. A verificação do negócio ainda não foi concluída. Contactos, morada completa e mapa permanecem privados.' : 'Staff-reviewed Basic listing. Business verification is not complete. Contacts, full address and map remain private.'}</p>}
          {isDemo && (
            <p className="mb-7 border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-4 py-4 text-sm leading-relaxed text-[#514321] sm:mb-8 sm:px-5">
              {pt
                ? 'Perfil fictício para testes de design. As fotografias, os dados e o estado apresentado não representam um restaurante real ou verificado.'
                : 'Fictional profile for design testing. Photos, details and status do not represent a real or verified restaurant.'}
            </p>
          )}
          <div className={refinedBasic ? 'hidden' : 'mb-7 sm:hidden'}>
            <h1 className="text-3xl font-semibold tracking-tight">{restaurant.name}</h1>
            <p className="mt-3 text-base text-[#555]">{cuisine} · {city}, {country}</p>
          <HospitalityVenueNavigation language={language} />
            <div className="mt-6 h-[2px] w-full bg-[#D2AC37]" aria-hidden="true" />
          </div>

          {verified && !isDemo && restaurant.address && (
            <section className="mb-7 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-5 sm:p-6">
              <div className="flex min-w-0 items-stretch gap-4 sm:gap-5">
                <div className="flex shrink-0 items-center border-r border-[#e9e5db] pr-4 sm:pr-5">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-10 text-emerald-700 sm:size-12">
                    <path fill="currentColor" d="m12 1 3 2.2 3.7.2 1.4 3.4 2.9 2.3-1 3.6.4 3.7-3.2 1.8-2 3.1-3.6-.6L12 23l-3.4-2.3-3.6.6-2-3.1-3-1.8.4-3.7L0 9.1l2.9-2.3 1.4-3.4 3.7-.2L12 1Z" />
                    <path d="m7.5 12 3 3 6-6" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{pt ? 'Morada e contacto público' : 'Address and public contact'}</h2>
                  <p className="mt-2 flex items-start gap-2 text-sm text-[#555]">
                    {mapPinIcon}
                    <span className="min-w-0 break-words">{restaurant.address}</span>
                  </p>
                  {restaurant.phone && (
                    <p className="mt-1 flex items-start gap-2 text-sm text-[#555]">
                      {phoneIcon}
                      <span className="min-w-0 break-words">{pt ? 'Telefone público' : 'Public phone'}: {restaurant.phone}</span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {isPro && (
                  <Link href={`/findme?lang=${language}&city=${encodeURIComponent(restaurant.city)}`} className="inline-flex items-center gap-2 rounded-lg border border-[#d9d5c9] px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                    {mapPinIcon}
                    {pt ? 'Explorar com MeAcha' : 'Explore with FindMe'}
                  </Link>
                )}
                <a href={getGoogleMapsUrl(restaurant)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#b18a23] px-4 py-2 text-sm font-semibold text-[#75570d] hover:bg-[#fbf7ed]">
                  {mapPinIcon}
                  {pt ? 'Como chegar' : 'Get directions'}
                </a>
                {restaurant.phone && (
                  <a href={'tel:' + restaurant.phone.replace(/[^+0-9]/g, '')} className="inline-flex items-center gap-2 rounded-lg bg-[#252a32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#424850]">
                    {phoneIcon}
                    {pt ? 'Ligar' : 'Call'}
                  </a>
                )}
              </div>
            </section>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(270px,1fr)]">
            <div className="space-y-6">
              <section className="rounded-xl border border-[#e9e5db] p-6 sm:p-8">
                <h2 className="text-xl font-semibold">{pt ? '01 · Sobre o restaurante' : '01 · About the restaurant'}</h2>
                <p className="mt-4 leading-relaxed text-[#555]">
                  {restaurant.description || (pt ? 'Mais informações serão adicionadas após análise.' : 'More information will be added after review.')}
                </p>
              </section>
              <section className="rounded-xl border border-[#e9e5db] p-6 sm:p-8">
                <h2 className="text-xl font-semibold">{pt ? '02 · Ementa' : '02 · Menu'}</h2>
                <p className="mt-4 text-[#555]">
                  {restaurant.menuPhotos.length === 0 && !restaurant.menuPdf && !isDemo
                    ? (pt ? 'A ementa ainda não foi adicionada.' : 'The menu has not been added yet.')
                    : null}
                </p>
                {restaurant.menuPhotos.includes(SAMPLE_MENU_PHOTO) && (
                  <figure className="mt-5 overflow-hidden rounded-xl border border-[#e9e5db] bg-white">
                    {/* Bundled sample, displayed only when staff select the demo cover. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={SAMPLE_MENU_PHOTO}
                      alt={pt ? 'Peixe grelhado com funge e legumes' : 'Grilled fish with funge and greens'}
                      loading="lazy"
                      width={1000}
                      height={750}
                      className="h-auto w-full"
                    />
                    <figcaption className="px-4 py-3">
                      <span className="block font-semibold">{pt ? 'Peixe grelhado com funge' : 'Grilled fish with funge'}</span>
                      <span className="text-sm text-[#555]">{pt ? 'Imagem ilustrativa · Exemplo de prato' : 'Illustrative image · Sample dish'}</span>
                    </figcaption>
                  </figure>
                )}
                {!refinedBasic && demoBasicOffers.length > 0 && (
                  <div className="mt-5 space-y-4">
                    <p className="text-sm text-[#6b5b35]">{pt ? 'Exemplos ilustrativos de refeições, preços e períodos. Não são ofertas reais.' : 'Illustrative meals, prices and availability periods. These are not real offers.'}</p>
                    {demoBasicOffers.map((offer) => (
                      <article key={offer.key} className="flex flex-col gap-4 rounded-xl border border-[#e9e5db] bg-white p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold">{offer.title}</h3>
                          <p className="mt-3 text-sm text-[#555]"><span className="font-semibold text-[#242424]">{pt ? 'Preço ilustrativo' : 'Illustrative price'}:</span> {offer.price}</p>
                          <p className="mt-2 text-sm text-[#555]"><span className="font-semibold text-[#242424]">{pt ? 'Disponibilidade ilustrativa' : 'Illustrative availability'}:</span> {offer.period}</p>
                          <span className="mt-4 inline-block rounded-md bg-[#fbf7ed] px-3 py-1.5 text-xs font-semibold text-[#866415]">{pt ? 'Demonstração · Sem reservas' : 'Demo · No bookings'}</span>
                        </div>
                        {/* Temporary illustrative food photograph, not owner-submitted. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={offer.image} alt={pt ? `Imagem ilustrativa: ${offer.title}` : `Illustrative image: ${offer.title}`} className="aspect-[4/3] w-full rounded-lg object-cover sm:w-2/5 sm:max-w-72 sm:shrink-0" />
                      </article>
                    ))}
                  </div>
                )}
                {refinedBasic ? (
                  <>
                    <p className="mt-4 text-sm text-[#555]">{pt ? 'Demonstração · Pratos e preços ilustrativos' : 'Demo · Illustrative dishes and prices'}</p>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      {[
                        { image: '/demo/moamba.webp', pt: 'Moamba de galinha', en: 'Chicken moamba', price: 'AOA 5 500', period: pt ? 'Dias úteis' : 'Weekdays' },
                        { image: '/demo/espetada.webp', pt: 'Espetada com mandioca', en: 'Beef skewers with cassava', price: 'AOA 6 000', period: pt ? 'Fins de semana' : 'Weekends' },
                      ].map(dish => (
                        <figure key={dish.image} className="overflow-hidden rounded-2xl border border-[#e9e5db] bg-white">
                          {/* Bundled illustrative meal photograph. */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={dish.image} alt={dish[language]} width={700} height={525} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                          <figcaption className="p-4">
                            <h3 className="text-lg font-semibold">{dish[language]}</h3>
                            <p className="mt-2 text-xl font-semibold text-emerald-800">{dish.price}</p>
                            <p className="mt-2 text-sm text-[#555]">{pt ? 'Disponibilidade ilustrativa' : 'Illustrative availability'} · {dish.period}</p>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-4 rounded-xl border border-[#e9e5db] bg-white p-5">
                      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-8 shrink-0 text-emerald-800">
                        <rect x="5" y="10" width="14" height="11" rx="2" />
                        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                      </svg>
                      <div>
                        <h3 className="font-semibold">{pt ? 'Ementa completa em perfis Verificados' : 'Full menu on Verified profiles'}</h3>
                        <p className="mt-1 text-sm text-[#555]">{pt ? 'O Perfil Básico apresenta duas refeições em destaque.' : 'Basic profiles show two featured meals.'}</p>
                      </div>
                    </div>
                  </>
                ) : <RestaurantMenuPreview restaurant={restaurant} language={language} />}
                {isDemo && (
                  <a
                    href={pt ? '/pt/editor-ementa' : '/en/menu-editor'}
                    className="mt-5 inline-block rounded-lg border border-[#b18a23] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#75570d] hover:bg-[#fbf7ed]"
                  >
                    {pt ? '🧱 Brick 008 · Experimentar o editor de ementa (demonstração) →' : '🧱 Brick 008 · Try the menu editor (demo) →'}
                  </a>
                )}
                {restaurant.menuPhotos.some(src => src !== SAMPLE_MENU_PHOTO) && (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {restaurant.menuPhotos.filter(src => src !== SAMPLE_MENU_PHOTO).map((src, index) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src + index} src={src} alt={pt ? `Ementa, página ${index + 1}` : `Menu, page ${index + 1}`} className="w-full rounded-lg border border-[#e9e5db] object-contain" />
                    ))}
                  </div>
                )}
                {restaurant.menuPdf && (
                  <a href={restaurant.menuPdf} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-lg border border-[#b18a23] px-4 py-2 text-sm font-semibold text-[#75570d] hover:bg-[#fbf7ed]">
                    {pt ? 'Abrir ementa ↗' : 'Open menu ↗'}
                  </a>
                )}
              </section>
              <section className="rounded-xl border border-[#e9e5db] p-6 sm:p-8">
                <h2 className="text-xl font-semibold">{pt ? '03 · Comentários' : '03 · Comments'}</h2>
                <p className="mt-4 text-[#555]">{pt ? 'Os comentários exigirão uma conta verificada. Funcionalidade em desenvolvimento.' : 'Comments will require a verified account. Feature in development.'}</p>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-6">
                <h2 className="text-lg font-semibold">{pt ? 'Informação do perfil' : 'Profile information'}</h2>
                {!isDemo && restaurant.hours && <p className="mt-4 text-sm text-[#555]">{pt ? 'Horário' : 'Hours'}: {restaurant.hours}</p>}
                <p className="mt-4 text-sm text-[#555]">{pt ? 'Cidade' : 'City'}: {city}</p>
                <p className="mt-2 text-sm text-[#555]">{pt ? 'Cozinha' : 'Cuisine'}: {cuisine}</p>
                <p className={`mt-4 border-t border-[#e9e5db] pt-4 text-sm font-medium ${verified && !isDemo ? 'text-emerald-700' : 'text-[#866415]'}`}>
                  {isDemo
                    ? (pt ? 'Demonstração · Sem verificação real' : 'Demo · Not actually verified')
                    : verified
                      ? (
                        <Link
                          href={pt ? '/pt/restaurantes?verified=1' : '/en/restaurants?verified=1'}
                          aria-label={pt ? `${isPro ? 'Pro Verificado' : 'Perfil verificado'}. Ver todos os restaurantes verificados` : `${isPro ? 'Pro Verified' : 'Verified profile'}. Browse all verified restaurants`}
                          className="rounded-sm underline underline-offset-4 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                          {isPro ? (pt ? 'Pro Verificado' : 'Pro Verified') : (pt ? 'Perfil verificado' : 'Verified profile')}
                        </Link>
                      )
                      : (pt ? 'Perfil básico / em análise' : 'Basic / under review')}
                </p>
              </section>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
