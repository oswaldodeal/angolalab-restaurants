import Link from 'next/link';
import HomeDigitalCards from '@/components/HomeDigitalCards';
import HomeEducationCard from '@/components/HomeEducationCard';

export default function EcosystemHomePage() {
 return (<>
  <section className="lab-dark-section w-full px-5 py-16 sm:py-20">
   <div className="mx-auto max-w-6xl">
    <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c94c]">AngolaLab · Research · Technology · Education</p>
    <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl">Research that informs. Technology that connects.</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">AngolaLab brings together evidence-based economic intelligence, digital business connections and practical education. Founded in England. Rooted in Angola. Open to the world.</p>
    <div className="mt-8 flex flex-wrap gap-3">
     <a href="#aeis" className="inline-flex min-h-12 items-center rounded-lg bg-[#d4af37] px-6 py-3 font-semibold text-[#171717] hover:bg-[#f2c94c]">Explore AEIS Research</a>
     <a href="#connections" className="inline-flex min-h-12 items-center rounded-lg border border-[#d4af37] px-6 py-3 font-semibold text-[#f2c94c] hover:bg-white/10">Digital Connections</a>
    </div>
   </div>
  </section>
  <section id="aeis" aria-labelledby="aeis-heading" className="scroll-mt-24 bg-[#f3f2ef] px-5 py-14 text-[#252525] sm:py-16">
   <div className="mx-auto max-w-6xl">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">AngolaLab Economic Intelligence System</p>
    <div className="mt-3 grid gap-5 md:grid-cols-[1.2fr_1fr] md:items-end">
     <h2 id="aeis-heading" className="text-3xl font-bold leading-tight sm:text-4xl">AEIS · Research & Intelligence</h2>
     <p className="leading-7 text-[#555]">We examine evidence, relationships and possible outcomes to support informed decisions.</p>
    </div>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
     <article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Research</p><h3 className="mt-3 text-xl font-bold">Economic Intelligence</h3><p className="mt-3 leading-7 text-[#555]">Research briefs, systems thinking and evidence-led questions about business, technology and development.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Research in development</p></article>
<article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Tourism</p><h3 className="mt-3 text-xl font-bold">Tourism Intelligence</h3><p className="mt-3 leading-7 text-[#555]">Research into accommodation, visitor businesses and local connections through carefully evaluated pilots.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Research in development</p></article>
<article className="rounded-2xl border border-[#e4d8bc] bg-white p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#927018]">Markets</p><h3 className="mt-3 text-xl font-bold">Trading Intelligence</h3><p className="mt-3 leading-7 text-[#555]">Macroeconomic drivers and market scenarios for research and education, not personal investment advice.</p><p className="mt-5 text-sm font-semibold text-[#725716]">Research in development</p></article>
    </div>
   </div>
  </section>
  <div id="connections" className="scroll-mt-24"><HomeDigitalCards language="en" /></div>
  <section className="bg-[#f3f2ef] px-5 pb-14 text-[#252525]" aria-labelledby="fpp-home-title">
   <div className="mx-auto max-w-6xl rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Professional Connections</p>
    <h2 id="fpp-home-title" className="mt-3 text-3xl font-bold">Skills can connect across borders.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Free Professional Profiles help people present their skills and collaboration countries. The directory is a demonstration; live verification and connections are not yet enabled.</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <Link href="/en/professionals" className="rounded-lg bg-[#252a32] px-5 py-3 font-semibold text-white hover:bg-[#424850]">Explore FPP Profile →</Link>
     <Link href="/en/professionals/directory" className="rounded-lg border border-[#bca36b] px-5 py-3 font-semibold text-[#725716] hover:bg-[#fbf6e9]">View Directory Demo →</Link>
    </div>
   </div>
  </section>
  <HomeEducationCard language="en" />
  <section className="bg-[#f3f2ef] px-5 pb-16 text-[#252525]" aria-labelledby="business-home-title">
   <div className="mx-auto max-w-6xl rounded-3xl bg-[#252a32] p-6 text-white sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f2c94c]">AngolaLab · Business Services</p>
    <h2 id="business-home-title" className="mt-3 text-3xl font-bold">Discover restaurants and local businesses.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-slate-300">Restaurant profiles are one practical part of AngolaLab, with free listings and richer details subject to verification.</p>
    <Link href="/en/restaurants" className="mt-6 inline-flex rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700">Browse Restaurants →</Link>
   </div>
  </section>
 </>);
}
