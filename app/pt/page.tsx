import Link from 'next/link';
import HomeDigitalCards from '@/components/HomeDigitalCards';
import HomeEducationCard from '@/components/HomeEducationCard';

export default function EcosystemHomePage() {
 return (<>
  <section className="lab-dark-section w-full px-5 py-10 sm:py-20">
   <div className="mx-auto max-w-6xl">
    <p className="mb-4 hidden text-xs font-bold uppercase tracking-[0.18em] text-[#f2c94c] sm:block">AngolaLab · Investigação · Tecnologia · Educação</p>
    <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">Descubra negócios. Conecte pessoas.</h1>
    <p className="mt-6 hidden max-w-3xl text-lg leading-8 text-slate-300 sm:block">A AngolaLab ajuda negócios a ganhar visibilidade, profissionais a apresentar competências e pessoas a desenvolver projectos digitais. A investigação e a educação sustentam esta missão.</p>
    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
     <a href="#aeis" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#171717] hover:bg-[#f2c94c] sm:px-6 sm:text-base"><span className="sm:hidden">Investigação AEIS</span><span className="hidden sm:inline">Inteligência Económica</span></a>
     <a href="#connections" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 sm:px-6 sm:text-base"><span className="sm:hidden">Conexões</span><span className="hidden sm:inline">Conexões Digitais</span></a>
    </div>
   </div>
  </section>
  <section id="business-directory" aria-labelledby="business-directory-title" className="scroll-mt-24 bg-[#f3f2ef] px-5 py-14 text-[#252525] sm:py-16">
   <div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">AngolaLab · Conexões Empresariais</p>
    <h2 id="business-directory-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Inteligência Económica</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Explore categorias empresariais e descubra serviços locais. Começamos pelos restaurantes e desenvolvemos as restantes categorias gradualmente, com critérios claros de verificação.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
     <Link href="/pt/restaurantes" className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#c9ae72] bg-white p-5 transition-colors hover:border-[#927018] hover:bg-[#fffcf4]"><span className="text-lg font-bold">Restaurantes</span><span className="mt-3 text-sm font-semibold text-emerald-700">Explorar registos →</span></Link>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Hotéis</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Imóveis</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Aluguer de Viaturas</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Comércio Grossista</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Universidades</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Bancos</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Concessionários Automóveis</span><span className="mt-3 text-sm text-[#70695b]">Categoria prevista · Ainda não disponível</span></div>
     <a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/home" className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#c9ae72] bg-white p-5 transition-colors hover:border-[#927018] hover:bg-[#fffcf4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]"><span className="text-lg font-bold">Educação</span><span className="mt-3 text-sm font-semibold text-emerald-700">Explorar AEIS ↗</span></a>
    </div>
    <p className="mt-5 text-sm leading-6 text-[#70695b]">Restaurantes abre o directório de negócios; Educação liga à plataforma AEIS. As restantes categorias empresariais estão previstas e ainda não aceitam registos.</p>
   </div>
  </section>
  <div id="connections" className="scroll-mt-24"><HomeDigitalCards language="pt" /></div>
  <section className="bg-[#f3f2ef] px-5 pb-14 text-[#252525]" aria-labelledby="fpp-home-title">
   <div className="mx-auto max-w-6xl rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Conexões Profissionais</p>
    <h2 id="fpp-home-title" className="mt-3 text-3xl font-bold">Competências que atravessam fronteiras.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Os Perfis Profissionais Gratuitos permitem apresentar competências e países de colaboração. O directório é uma demonstração; a verificação e as conexões reais ainda não estão activas.</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <Link href="/pt/profissionais" className="rounded-lg bg-[#252a32] px-5 py-3 font-semibold text-white hover:bg-[#424850]">Explorar Perfil Profissional →</Link>
     <Link href="/pt/profissionais/diretorio" className="rounded-lg border border-[#bca36b] px-5 py-3 font-semibold text-[#725716] hover:bg-[#fbf6e9]">Ver Directório de Demonstração →</Link>
    </div>
   </div>
  </section>
  <HomeEducationCard language="pt" />
  <section id="aeis" aria-labelledby="aeis-heading" className="scroll-mt-24 bg-[#f3f2ef] px-5 py-14 text-[#252525] sm:py-16">
   <div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">Sistema de Inteligência Económica AngolaLab</p>
    <div className="mt-3 grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-end">
     <h2 id="aeis-heading" className="text-3xl font-bold leading-tight sm:text-4xl">AEIS · Investigação e Inteligência</h2>
     <p className="leading-7 text-[#555]">Estudamos evidências, relações e possíveis resultados para apoiar decisões informadas.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
     <article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Investigação</p><h3 className="mt-3 text-xl font-bold">Inteligência Económica</h3><p className="mt-3 leading-7 text-[#555]">Boletins de investigação, pensamento sistémico e questões sobre empresas, tecnologia e desenvolvimento.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Investigação em desenvolvimento</p></article>
<a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/tourism-intelligence/index.html" className="block rounded-2xl border border-[#e4d8bc] bg-white p-6 transition-colors hover:border-[#927018] hover:bg-[#fffcf4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Turismo</p><h3 className="mt-3 text-xl font-bold">Inteligência do Turismo</h3><p className="mt-3 leading-7 text-[#555]">Investigação sobre alojamentos, negócios turísticos e conexões locais através de projectos-piloto avaliados.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Explorar Inteligência do Turismo ↗</p></a>
<a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/trading" className="block rounded-2xl border border-[#e4d8bc] bg-white p-6 transition-colors hover:border-[#927018] hover:bg-[#fffcf4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]" aria-label="Abrir Trading Intelligence na plataforma AEIS"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Mercados</p><h3 className="mt-3 text-xl font-bold">Inteligência dos Mercados</h3><p className="mt-3 leading-7 text-[#555]">Factores macroeconómicos e cenários de mercado para investigação e educação, não aconselhamento financeiro pessoal.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Explorar Trading Intelligence ↗</p></a>
    </div>
   </div>
  </section>


 </>);
}
