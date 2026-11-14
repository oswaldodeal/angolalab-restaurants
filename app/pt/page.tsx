import Link from 'next/link';
import HomeDigitalCards from '@/components/HomeDigitalCards';
import HomeTourismCard from '@/components/HomeTourismCard';

export default function EcosystemHomePage() {
 return (<>
  <section className="lab-dark-section w-full py-10 sm:py-20">
   <div className="page-rail">
    <p className="mb-4 hidden text-xs font-bold uppercase tracking-[0.18em] text-[#f2c94c] sm:block">AngolaLab · Investigação · Tecnologia · Educação</p>
    <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">Descubra negócios. Conecte pessoas.</h1>
    <p className="mt-6 hidden max-w-3xl text-lg leading-8 text-slate-300 sm:block">A AngolaLab ajuda negócios a ganhar visibilidade, profissionais a apresentar competências e pessoas a desenvolver projectos digitais. A investigação e a educação sustentam esta missão.</p>
    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
     <a href="#business-directory" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#171717] hover:bg-[#f2c94c] sm:px-6 sm:text-base"><span className="sm:hidden">Investigação AEIS</span><span className="hidden sm:inline">Inteligência Económica</span></a>
     <a href="#connections" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 sm:px-6 sm:text-base"><span className="sm:hidden">Conexões</span><span className="hidden sm:inline">Conexões Digitais</span></a>
     <a href="#tourism" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c94c] sm:px-6 sm:text-base">Inteligência Turística</a>
     <a href="#website-design" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c94c] sm:px-6 sm:text-base">Criação e Manutenção de Websites</a>
    </div>
   </div>
  </section>
  <section id="business-directory" aria-labelledby="business-directory-title" className="scroll-mt-24 bg-[#f3f2ef] py-14 text-[#252525] sm:py-16">
   <div className="page-rail">
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
  <a href="/business-connection/index.html?lang=pt" className="block border-b-4 border-[#e4bd62] bg-[#181817] py-10 text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#e4bd62] sm:py-16">
   <div className="page-rail">
    <p className="text-sm font-bold uppercase tracking-widest text-[#e4bd62]">Business Connection</p>
    <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-6xl">Ligamos a sua empresa a fornecedores e parceiros internacionais.</h2>
    <p className="mt-4">Um serviço gratuito de ligação para empresas angolanas verificadas.</p>
    <span className="mt-6 inline-block rounded-lg bg-[#e4bd62] px-5 py-3 font-bold text-[#181817]">Explorar Business Connection →</span>
   </div>
  </a>
  <div id="connections" className="scroll-mt-24"><HomeDigitalCards language="pt" /></div>
  <section className="bg-[#f3f2ef] pb-14 text-[#252525]" aria-labelledby="fpp-home-title">
   <div className="page-rail rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Conexões Profissionais</p>
    <h2 id="fpp-home-title" className="mt-3 text-3xl font-bold">Competências que atravessam fronteiras.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Os Perfis Profissionais Gratuitos permitem apresentar competências e países de colaboração. O directório é uma demonstração; a verificação e as conexões reais ainda não estão activas.</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <Link href="/pt/profissionais" className="rounded-lg bg-[#252a32] px-5 py-3 font-semibold text-white hover:bg-[#424850]">Explorar Perfil Profissional →</Link>
     <Link href="/pt/profissionais/diretorio" className="rounded-lg border border-[#bca36b] px-5 py-3 font-semibold text-[#725716] hover:bg-[#fbf6e9]">Ver Directório de Demonstração →</Link>
    </div>
   </div>
  </section>
  <HomeTourismCard language="pt" />
  <section id="website-design" aria-labelledby="website-design-heading" className="scroll-mt-24 bg-[#f3f2ef] pb-14 text-[#252525] sm:pb-20">
   <div className="page-rail rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Serviços Digitais</p>
    <h2 id="website-design-heading" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Criação e Manutenção de Websites</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Criamos e mantemos websites para ajudar empresas a estabelecer a sua presença online e a crescer. Um novo website, melhorias ou apoio contínuo — fale connosco sobre o seu projecto.</p>
    <a href="https://angolalab-web-design.oswaldodeal.chatgpt.site/" className="mt-6 inline-flex max-w-full items-center justify-center rounded-lg bg-[#252a32] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]">Explorar Criação de Websites ↗</a>
   </div>
  </section>
 </>);
}