import Link from 'next/link';
import HomeDigitalCards from '@/components/HomeDigitalCards';
import HomeEducationCard from '@/components/HomeEducationCard';

export default function EcosystemHomePage() {
 return (<>
  <section className="lab-dark-section w-full px-5 py-16 sm:py-20">
   <div className="mx-auto max-w-6xl">
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c94c]">AngolaLab · Investigação · Tecnologia · Educação</p>
    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl">Investigação que informa. Tecnologia que conecta.</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">A AngolaLab reúne inteligência económica baseada em evidências, conexões digitais e educação prática. Fundada em Inglaterra. Com raízes em Angola. Aberta ao mundo.</p>
    <div className="mt-8 flex flex-wrap gap-3">
     <a href="#aeis" className="inline-flex min-h-12 items-center rounded-lg bg-[#d4af37] px-6 py-3 font-semibold text-[#171717] hover:bg-[#f2c94c]">Explorar a Investigação AEIS</a>
     <a href="#connections" className="inline-flex min-h-12 items-center rounded-lg border border-[#d4af37] px-6 py-3 font-semibold text-[#f2c94c] hover:bg-white/10">Conexões Digitais</a>
    </div>
   </div>
  </section>
  <section id="aeis" aria-labelledby="aeis-heading" className="scroll-mt-24 bg-[#f3f2ef] px-5 py-14 text-[#252525] sm:py-16">
   <div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">Sistema de Inteligência Económica AngolaLab</p>
    <div className="mt-3 grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-end">
     <h2 id="aeis-heading" className="text-3xl font-bold leading-tight sm:text-4xl">AEIS · Investigação e Inteligência</h2>
     <p className="leading-7 text-[#555]">Estudamos evidências, relações e possíveis resultados para apoiar decisões informadas.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
     <article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Investigação</p><h3 className="mt-3 text-xl font-bold">Inteligência Económica</h3><p className="mt-3 leading-7 text-[#555]">Boletins de investigação, pensamento sistémico e questões sobre empresas, tecnologia e desenvolvimento.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Investigação em desenvolvimento</p></article>
<article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Turismo</p><h3 className="mt-3 text-xl font-bold">Inteligência do Turismo</h3><p className="mt-3 leading-7 text-[#555]">Investigação sobre alojamentos, negócios turísticos e conexões locais através de projectos-piloto avaliados.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Investigação em desenvolvimento</p></article>
<article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Mercados</p><h3 className="mt-3 text-xl font-bold">Inteligência dos Mercados</h3><p className="mt-3 leading-7 text-[#555]">Factores macroeconómicos e cenários de mercado para investigação e educação, não aconselhamento financeiro pessoal.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Investigação em desenvolvimento</p></article>
    </div>
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
  <section className="bg-[#f3f2ef] px-5 pb-16 text-[#252525]" aria-labelledby="business-home-title">
   <div className="mx-auto max-w-6xl rounded-3xl bg-[#252a32] p-6 text-white sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f2c94c]">AngolaLab · Serviços Empresariais</p>
    <h2 id="business-home-title" className="mt-3 text-3xl font-bold">Descubra restaurantes e negócios locais.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-slate-300">Os perfis de restaurantes são uma parte prática da AngolaLab, com registos gratuitos e informações adicionais sujeitas a verificação.</p>
    <Link href="/pt/restaurantes" className="mt-6 inline-flex rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">Ver Restaurantes →</Link>
   </div>
  </section>
 </>);
}
