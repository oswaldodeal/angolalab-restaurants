import Link from 'next/link';

type Language = 'en' | 'pt';

export default function ProfessionalProfileDemo({ language }: { language: Language }) {
  const pt = language === 'pt';
  return (
    <main className="min-h-screen bg-[#f4f4f2] px-4 py-10 text-[#252525] sm:py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#927018]">
          {pt ? 'AngolaLab · Conexões digitais' : 'AngolaLab · Digital Connections'}
        </p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          {pt ? 'Perfil profissional gratuito' : 'Free Professional Profile'}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#555]">
          {pt
            ? 'Conheça as competências, os interesses e os projetos de outras pessoas. Esta página é uma demonstração fictícia: não existem perfis públicos nem pedidos de ligação ativos.'
            : 'Discover people through their skills, interests and projects. This is a fictional demonstration: no public profiles or connection requests are active.'}
        </p>

        <section aria-label={pt ? 'Perfil de demonstração' : 'Demonstration profile'}
          className="mt-8 overflow-hidden rounded-2xl border border-[#dedbd3] bg-white shadow-sm">
          <div className="h-3 bg-[#b6923b]" />
          <div className="p-6 sm:p-9">
            <div className="flex flex-wrap items-start gap-5">
              <div aria-hidden="true" className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#e9ddbc] text-3xl font-bold text-[#5f4a18]">W</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6a20]">
                  {pt ? 'Perfil fictício · Não publicado' : 'Fictional profile · Not published'}
                </p>
                <h2 className="mt-1 text-2xl font-bold">Waldo</h2>
                <p className="mt-1 text-base text-[#555]">{pt ? 'Desenvolvedor Web' : 'Web Developer'}</p>
                <p className="mt-2 text-sm text-[#666]">
                  {pt ? 'Interesse em projetos educativos, tecnologia e colaboração internacional.' : 'Interested in education projects, technology and international collaboration.'}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Competências' : 'Skills'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'Desenvolvimento Web · Criação de sites' : 'Web development · Website building'}</p>
              </div>
              <div className="rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Idiomas' : 'Languages'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'Inglês · Português · Neerlandês' : 'English · Portuguese · Dutch'}</p>
              </div>
              <div className="rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Interesses' : 'Interests'}</h3>
                <p className="mt-2 text-sm leading-6 text-[#555]">{pt ? 'Leitura · Escrita · Tecnologia' : 'Reading · Writing · Technology'}</p>
              </div>
              <div className="rounded-xl bg-[#f7f6f2] p-5">
                <h3 className="font-bold">{pt ? 'Publicação de exemplo' : 'Example publication'}</h3>
                <p className="mt-2 text-sm italic leading-6 text-[#555]">The Structure Beneath the Noise</p>
              </div>
            </div>

            <div className="mt-7 rounded-xl border border-[#e4d5a6] bg-[#fff9e9] p-5">
              <h3 className="font-bold">{pt ? 'Colaboração' : 'Collaboration'}</h3>
              <p className="mt-2 text-sm leading-6 text-[#555]">
                {pt
                  ? 'Imagine que está a desenvolver um projeto e procura alguém com estas competências. No futuro, poderá pedir uma ligação e decidir em conjunto se querem colaborar.'
                  : 'Imagine you are building a project and need these skills. In future, you could request a connection and decide together whether to collaborate.'}
              </p>
              <button type="button" disabled aria-disabled="true"
                className="mt-4 cursor-not-allowed rounded-lg bg-[#dedbd3] px-5 py-3 text-sm font-semibold text-[#666]">
                {pt ? 'Pedir ligação · Em desenvolvimento' : 'Request connection · Planned'}
              </button>
            </div>
            <p className="mt-5 text-xs leading-5 text-[#666]">
              {pt
                ? 'Privacidade primeiro: os futuros titulares escolherão o que partilhar. Nenhuma mensagem é enviada nesta demonstração.'
                : 'Privacy first: future profile owners will choose what to share. No messages are sent in this demonstration.'}
            </p>
          </div>
        </section>
        <Link href={pt ? '/pt/cartoes' : '/en/cards'} className="mt-7 inline-flex rounded-lg border border-[#d6caa8] bg-white px-5 py-3 text-sm font-semibold text-[#6b5319] hover:bg-[#fff9e9]">
          {pt ? '← Voltar aos Cartões Digitais' : '← Back to Digital Cards'}
        </Link>
      </div>
    </main>
  );
}
