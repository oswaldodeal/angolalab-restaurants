import Link from 'next/link';

export default function HomeEducationCard({ language }: { language: 'en' | 'pt' }) {
  const pt = language === 'pt';
  return (
    <section id="education" aria-labelledby="education-heading" className="bg-[#f3f2ef] px-5 pb-14 text-[#252525] sm:pb-20">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[#e4d8bc] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.06)]">
        <div className="grid min-w-0 items-center gap-7 p-5 sm:p-8 lg:grid-cols-2 lg:gap-10 lg:p-10">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">{pt ? 'AngolaLab · Educação' : 'AngolaLab · Education'}</p>
            <h2 id="education-heading" className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              {pt ? 'APRENDER · INVESTIGAR NA PRÁTICA · CRIAR PROJECTOS REAIS' : 'LEARN · LIVE RESEARCH · CREATE REAL PROJECTS'}
            </h2>
            <p className="mt-4 text-lg font-semibold leading-7 text-[#303945]">
              {pt ? 'Beneficie do nosso plano de educação e comece a desenvolver aplicações como a AngolaLab.' : 'Benefit from our education plan and start building applications like AngolaLab.'}
            </p>
            <p className="mt-3 text-sm leading-7 text-[#5b5b5b] sm:text-base">
              {pt ? 'Aprenda conceitos, investigue problemas reais e transforme os seus conhecimentos em projectos práticos. Desenvolva competências e apresente os seus trabalhos no seu Perfil Profissional Gratuito.' : 'Understand the concepts, research real problems and turn knowledge into working projects. Build skills and showcase your work through your Free Professional Profile.'}
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              {['English', pt ? 'Desenvolvimento Web' : 'Web Design', pt ? 'Trading (bases)' : 'Trading (basics)'].map(item => (
                <span key={item} className="rounded-full border border-[#e7dcc4] bg-[#fbf6e9] px-3 py-2 text-[#6d531b]">{item}</span>
              ))}
            </div>
            <details className="group mt-6 rounded-xl border border-[#e4d8bc] bg-[#faf9f5] p-4">
              <summary className="cursor-pointer text-sm font-bold text-[#725716] focus-visible:outline-2 focus-visible:outline-offset-2">
                {pt ? 'Conhecer o plano de aprendizagem' : 'Explore the learning plan'}
              </summary>
              <p className="mt-3 text-sm leading-6 text-[#555]">
                {pt ? 'Inglês: comunicação prática. Desenvolvimento Web: compreender e alterar pequenos blocos de código, usar GitHub e publicar um projecto. Trading: fundamentos, análise e consciência dos riscos. Os cursos estão em planeamento; esta secção apresenta a proposta educativa.' : 'English: practical communication. Web Design: understand and change small pieces of code, use GitHub and publish a project. Trading: fundamentals, analysis and risk awareness. Courses are being planned; this section introduces the education concept.'}
              </p>
            </details>
            <Link href={pt ? '/pt/profissionais' : '/en/professionals'}
              className="mt-5 inline-flex max-w-full items-center justify-center rounded-lg bg-[#252a32] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#424850] focus-visible:outline-2 focus-visible:outline-offset-2">
              {pt ? 'Ver demonstração do Perfil Profissional →' : 'Explore Professional Profile Demo →'}
            </Link>
            <p className="mt-3 text-xs text-[#666]">{pt ? 'Plano educativo em desenvolvimento. Não existem inscrições abertas nesta demonstração.' : 'Education plan in development. No course enrolment is open in this demo.'}</p>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e4d8bc] bg-[#e9dfc6]">
            {/* Original project illustration; no external media or user data. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/angolalab-education.svg"
              alt={pt ? 'Ilustração de um computador com código de projecto, livros e apontamentos de investigação' : 'Illustration of a laptop showing project code, study books and a research notebook'}
              className="block h-auto w-full" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}
