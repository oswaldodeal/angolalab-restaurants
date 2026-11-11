export default function HomeTourismCard({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  return (
    <section id="tourism" aria-labelledby="tourism-heading" className="bg-[#f3f2ef] pb-14 text-[#252525] sm:pb-20">
      <div className="page-rail overflow-hidden rounded-3xl border border-[#e4d8bc] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
        <div className="grid min-w-0 items-center gap-7 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">{pt ? 'AngolaLab · Turismo' : 'AngolaLab · Tourism'}</p>
            <h2 id="tourism-heading" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              {pt ? 'Conheça o alojamento antes de escolher.' : 'Understand your stay before you choose.'}
            </h2>
            <p className="mt-4 text-lg font-semibold leading-7 text-[#303945]">
              {pt ? 'Analisamos hotéis, B&Bs e casas de hóspedes em Angola.' : 'Analysing hotels, B&Bs and guest houses in Angola.'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5b5b5b] sm:text-base">
              {pt ? 'Explore a investigação da AngolaLab sobre alojamento. Compare informações de verificação, indicadores de qualidade e actualizações das equipas para conhecer melhor cada opção.' : 'Explore AngolaLab accommodation research. Compare verification information, quality indicators and updates from accommodation teams to understand each option.'}
            </p>
            <a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/tourism-intelligence/index.html"
              className="mt-6 inline-flex max-w-full items-center justify-center rounded-lg bg-[#252a32] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2">
              {pt ? 'Explorar Tourism Intelligence →' : 'Explore Tourism Intelligence →'}
            </a>
            <p className="mt-3 text-xs text-[#666]">{pt ? 'Directório em fase de protótipo, com dados para testar o sistema.' : 'Prototype directory with data for system testing.'}</p>
          </div>
          <a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/tourism-intelligence/index.html"
            className="block min-w-0 overflow-hidden rounded-2xl border border-[#e4d8bc] bg-[#e9dfc6] focus-visible:outline-2 focus-visible:outline-offset-4"
            aria-label={pt ? 'Abrir Tourism Intelligence' : 'Open Tourism Intelligence'}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/angolalab-tourism-analysis.webp"
              alt={pt ? 'Ilustração de uma analista a comparar um hotel, um B&B e uma casa de hóspedes numa paisagem costeira de Luanda' : 'Illustration of an analyst comparing a hotel, B&B and guest house against a Luanda coastal landscape'}
              width={1536} height={1024} className="block h-auto w-full" loading="lazy" />
          </a>
        </div>
      </div>
    </section>
  );
}