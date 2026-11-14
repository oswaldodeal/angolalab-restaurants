import Link from 'next/link';
import HomeDigitalCards from '@/components/HomeDigitalCards';
import HomeTourismCard from '@/components/HomeTourismCard';

export default function EcosystemHomePage() {
 return (<>
  <section className="lab-dark-section w-full py-10 sm:py-20">
   <div className="page-rail">
    <p className="mb-4 hidden text-xs font-bold uppercase tracking-[0.18em] text-[#f2c94c] sm:block">AngolaLab · Research · Technology · Education</p>
    <h1 className="max-w-4xl text-3xl font-bold leading-tight text-white sm:text-5xl">Discover businesses. Connect people.</h1>
    <p className="mt-6 hidden max-w-3xl text-lg leading-8 text-slate-300 sm:block">AngolaLab helps businesses become visible, professionals share skills and people build digital projects. Research and education support this mission.</p>
    <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:gap-3">
     <a href="#business-directory" className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#171717] hover:bg-[#f2c94c] sm:px-6 sm:text-base"><span className="sm:hidden">AEIS Research</span><span className="hidden sm:inline">Economic Intelligence</span></a>
     <a href="#connections" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 sm:px-6 sm:text-base"><span className="sm:hidden">Connections</span><span className="hidden sm:inline">Digital Connections</span></a>
     <a href="#tourism" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c94c] sm:px-6 sm:text-base">Tourism Intelligence</a>
     <a href="#website-design" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#d4af37] px-2 py-3 text-center text-sm font-semibold text-[#f2c94c] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2c94c] sm:px-6 sm:text-base">Website Design &amp; Maintenance</a>
    </div>
   </div>
  </section>
  <section id="business-directory" aria-labelledby="business-directory-title" className="scroll-mt-24 bg-[#f3f2ef] py-14 text-[#252525] sm:py-16">
   <div className="page-rail">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#927018]">AngolaLab · Business Connections</p>
    <h2 id="business-directory-title" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Economic Intelligence</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Explore business categories and discover local services. We are starting with restaurants and developing the other categories step by step, with clear verification standards.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
     <Link href="/en/restaurants" className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#c9ae72] bg-white p-5 transition-colors hover:border-[#927018] hover:bg-[#fffcf4]"><span className="text-lg font-bold">Restaurants</span><span className="mt-3 text-sm font-semibold text-emerald-700">Explore listings →</span></Link>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Hotels</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Property</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Car Rental</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Wholesale</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Universities</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Banks</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <div className="flex min-h-28 flex-col justify-between rounded-xl border border-[#e4d8bc] bg-white p-5"><span className="text-lg font-bold">Car Dealers</span><span className="mt-3 text-sm text-[#70695b]">Planned category · Not yet available</span></div>
     <a href="https://angolalab-63iw-git-feature-home-a-f0a44a-oswaldodeal-s-projects.vercel.app/home" className="group flex min-h-28 flex-col justify-between rounded-xl border border-[#c9ae72] bg-white p-5 transition-colors hover:border-[#927018] hover:bg-[#fffcf4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]"><span className="text-lg font-bold">Education</span><span className="mt-3 text-sm font-semibold text-emerald-700">Explore AEIS ↗</span></a>
    </div>
    <p className="mt-5 text-sm leading-6 text-[#70695b]">Restaurants opens the business directory; Education links to the AEIS platform. Other business categories are planned and are not yet open for registration or listing.</p>
   </div>
  </section>
  <a href="/business-connection/index.html?lang=en" className="block border-b-4 border-[#e4bd62] bg-[#181817] py-10 text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#e4bd62] sm:py-16">
   <div className="page-rail">
    <p className="text-sm font-bold uppercase tracking-widest text-[#e4bd62]">Business Connection</p>
    <h2 className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-6xl">We connect your business to Angola.</h2>
    <p className="mt-4">A free connection service for verified Angolan businesses.</p>
    <span className="mt-6 inline-block rounded-lg bg-[#e4bd62] px-5 py-3 font-bold text-[#181817]">Explore Business Connection →</span>
   </div>
  </a>
  <div id="connections" className="scroll-mt-24"><HomeDigitalCards language="en" /></div>
  <section className="bg-[#f3f2ef] pb-14 text-[#252525]" aria-labelledby="fpp-home-title">
   <div className="page-rail rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Professional Connections</p>
    <h2 id="fpp-home-title" className="mt-3 text-3xl font-bold">Skills can connect across borders.</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">Free Professional Profiles help people present their skills and collaboration countries. The directory is a demonstration; live verification and connections are not yet enabled.</p>
    <div className="mt-6 flex flex-wrap gap-3">
     <Link href="/en/professionals" className="rounded-lg bg-[#252a32] px-5 py-3 font-semibold text-white hover:bg-[#424850]">Explore FPP Profile →</Link>
     <Link href="/en/professionals/directory" className="rounded-lg border border-[#bca36b] px-5 py-3 font-semibold text-[#725716] hover:bg-[#fbf6e9]">View Directory Demo →</Link>
    </div>
   </div>
  </section>
  <HomeTourismCard language="en" />
  <section id="website-design" aria-labelledby="website-design-heading" className="scroll-mt-24 bg-[#f3f2ef] pb-14 text-[#252525] sm:pb-20">
   <div className="page-rail rounded-3xl border border-[#e4d8bc] bg-white p-6 shadow-sm sm:p-9">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">AngolaLab · Digital Services</p>
    <h2 id="website-design-heading" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Website Design &amp; Maintenance</h2>
    <p className="mt-4 max-w-3xl leading-7 text-[#555]">We build and maintain websites that help businesses establish their online presence and grow. From a new website to improvements and ongoing support, talk to us about your project.</p>
    <a href="https://angolalab-web-design.oswaldodeal.chatgpt.site/" className="mt-6 inline-flex max-w-full items-center justify-center rounded-lg bg-[#252a32] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#927018]">Explore Website Design ↗</a>
   </div>
  </section>
 </>);
}