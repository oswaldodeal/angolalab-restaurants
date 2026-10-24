import { CITIES, COUNTRIES, CUISINES, getGoogleMapsUrl, type Restaurant } from '@/lib/store';
import { demoRestaurantPhoto } from '@/lib/demo-photos';

export default function RestaurantResearchProfile({ restaurant, language }: {
  restaurant: Restaurant;
  language: 'pt' | 'en';
}) {
  const pt = language === 'pt';
  const city = CITIES.find((c) => c.id === restaurant.city)?.[language] ?? restaurant.city;
  const country = COUNTRIES.find((c) => c.id === restaurant.country)?.[language] ?? restaurant.country;
  const cuisine = CUISINES.find((c) => c.id === restaurant.cuisine)?.[language] ?? restaurant.cuisine;
  const photo = demoRestaurantPhoto(restaurant.id);
  const verified = restaurant.status === 'verified';
  const isDemo = restaurant.ownerId === 'demo';

  return (
    <div className="bg-[#fafafa] px-4 py-10 text-[#242424] sm:px-8 sm:py-14">
      <article className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-[#e9e5db] bg-white shadow-[0_12px_36px_rgba(0,0,0,0.05)]">
        <div className="px-5 pt-7 sm:px-10 sm:pt-10 lg:px-14">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#987515]">
            {pt ? 'AngolaLab · Perfil do restaurante' : 'AngolaLab · Restaurant profile'}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{restaurant.name}</h1>
          <p className="mt-3 text-base text-[#555]">{cuisine} · {city}, {country}</p>
          <div className="mt-7 h-[2px] w-full bg-[#D2AC37]" aria-hidden="true" />
        </div>

        <section className="px-5 pt-7 sm:px-10 lg:px-14" aria-label={pt ? 'Fotografia do restaurante' : 'Restaurant photograph'}>
          <div className="relative h-[260px] overflow-hidden rounded-xl border border-[#e9e5db] bg-gradient-to-br from-[#ad8b50] to-[#252a32] sm:h-[390px] lg:h-[510px]">
            {photo && (
              // Remote images are temporary illustrative imagery, not business photography.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={pt ? 'Fotografia ilustrativa de restaurante' : 'Illustrative restaurant interior photograph'} className="h-full w-full object-cover" />
            )}
            {isDemo && (
              <span className="absolute bottom-4 left-4 rounded-md bg-[#fff0b0] px-4 py-2 text-xs font-bold text-[#57410c] sm:bottom-6 sm:left-6 sm:text-sm">
                AngolaLab Test · {pt ? 'Imagem ilustrativa' : 'Illustrative image'}
              </span>
            )}
          </div>
        </section>

        <div className="px-5 pb-12 pt-8 sm:px-10 lg:px-14">
          {isDemo && (
            <p className="mb-8 border-l-4 border-[#D2AC37] bg-[#fbf7ed] px-5 py-4 text-sm leading-relaxed text-[#514321]">
              {pt
                ? 'Perfil fictício para testes de design. As fotografias, os dados e o estado apresentado não representam um restaurante real ou verificado.'
                : 'Fictional profile for design testing. Photos, details and status do not represent a real or verified restaurant.'}
            </p>
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
                  {verified
                    ? (pt ? 'As imagens e os pratos da ementa serão adicionados aqui.' : 'Menu images and dishes will be added here.')
                    : (pt ? 'A ementa ficará disponível após a análise do perfil.' : 'The menu will be available after profile review.')}
                </p>
              </section>
              <section className="rounded-xl border border-[#e9e5db] p-6 sm:p-8">
                <h2 className="text-xl font-semibold">{pt ? '03 · Comentários' : '03 · Comments'}</h2>
                <p className="mt-4 text-[#555]">{pt ? 'Os comentários exigirão uma conta verificada. Funcionalidade em desenvolvimento.' : 'Comments will require a verified account. Feature in development.'}</p>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-xl border border-[#e9e5db] bg-[#fffdf8] p-6">
                <h2 className="text-lg font-semibold">{pt ? 'Informação do perfil' : 'Profile information'}</h2>
                <p className="mt-4 text-sm text-[#555]">{pt ? 'Cidade' : 'City'}: {city}</p>
                <p className="mt-2 text-sm text-[#555]">{pt ? 'Cozinha' : 'Cuisine'}: {cuisine}</p>
                <p className="mt-4 border-t border-[#e9e5db] pt-4 text-sm font-medium text-[#866415]">
                  {isDemo
                    ? (pt ? 'Demonstração · Sem verificação real' : 'Demo · Not actually verified')
                    : verified
                      ? (pt ? 'Perfil verificado' : 'Verified profile')
                      : (pt ? 'Perfil básico / em análise' : 'Basic / under review')}
                </p>
              </section>
              {verified && (
                <section className="rounded-xl border border-[#e9e5db] p-6">
                  <h2 className="text-lg font-semibold">{pt ? 'Localização e horário' : 'Location and hours'}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-[#555]">{restaurant.address}</p>
                  {restaurant.hours && <p className="mt-3 text-sm text-[#555]">{restaurant.hours}</p>}
                  <a href={getGoogleMapsUrl(restaurant)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-lg border border-[#b18a23] px-4 py-2 text-sm font-semibold text-[#75570d] hover:bg-[#fbf7ed]">
                    {pt ? 'Ver no mapa ↗' : 'View map ↗'}
                  </a>
                </section>
              )}
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
