import Link from 'next/link';

export default function BusinessAbout({ language }: { language: 'pt' | 'en' }) {
  const pt = language === 'pt';
  const sections = pt
    ? [
        { title: 'A nossa missão', body: 'Ajudar empresas legítimas a construir uma presença digital credível, a estabelecer ligações entre mercados nacionais e internacionais e a disponibilizar informação mais clara para decisões informadas.' },
        { title: 'Verificação de empresas', body: 'A nossa abordagem de verificação baseia-se em evidências. O processo poderá incluir a análise de registos empresariais, identidade e responsabilidade pelo negócio, contactos, localização e documentos relevantes. O estado Verificado só poderá ser atribuído após avaliação dos requisitos aplicáveis.' },
        { title: 'Ligação entre empresas', body: 'Começamos pelos restaurantes, turismo e serviços relacionados, com o objetivo de facilitar ligações entre o Reino Unido e Angola. Queremos apoiar a visibilidade, a colaboração e o acesso a informação útil.' },
        { title: 'Confiança digital', body: 'Os sites falsos, a usurpação de identidade e as alegações enganosas podem prejudicar os utilizadores. Procuramos reduzir a incerteza através de informação transparente, verificação de identidade empresarial e educação para a prevenção de fraudes.' },
      ]
    : [
        { title: 'Our mission', body: 'Help legitimate businesses build a credible digital presence, connect across national and international markets, and provide clearer information so people can make informed decisions.' },
        { title: 'Business verification', body: 'Our verification approach is evidence-based. Assessments may include reviewing business registrations, identity and responsibility for a business, contact details, operating locations and relevant documents. Verified status may only be granted after applicable requirements have been assessed.' },
        { title: 'Connecting businesses', body: 'We are starting with restaurants, tourism and related services, aiming to support connections between the United Kingdom and Angola. Our goal is to improve visibility, collaboration and access to useful information.' },
        { title: 'Digital trust', body: 'Fake websites, impersonation and misleading claims can harm online users. We aim to reduce uncertainty through transparent information, business identity checks and education about fraud prevention.' },
      ];
  return (
    <main className="min-h-screen bg-[#fafafa] px-4 py-10 text-[#252525] sm:px-8">
      <article className="mx-auto max-w-5xl border border-[#e9e5db] bg-white px-6 py-10 sm:px-12 sm:py-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#987515]">
          {pt ? 'AngolaLab · Ligação entre empresas' : 'AngolaLab · Business Connection'}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">{pt ? 'Sobre nós' : 'About Us'}</h1>
        <p className="mt-4 text-xl font-semibold text-[#866415]">
          {pt ? 'Ligamos empresas. Construímos confiança digital.' : 'Connecting Businesses. Building Digital Trust.'}
        </p>
        <div className="mt-7 h-[3px] bg-[#D2AC37]" />
        <p className="mt-8 max-w-3xl text-lg leading-relaxed">
          {pt
            ? 'A AngolaLab foi criada para ajudar empresas a estabelecer uma presença online credível, ligar mercados e contribuir para a proteção dos utilizadores contra fraudes relacionadas com sites falsos, identidades empresariais fraudulentas e alegações enganosas.'
            : 'AngolaLab was created to help businesses establish a credible online presence, connect markets and support the protection of internet users against fraud involving fake websites, fraudulent business identities and misleading claims.'}
        </p>
        <div className="mt-9 grid gap-8 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-[#e9e5db] pt-5">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-[#555]">{section.body}</p>
            </section>
          ))}
        </div>
        <section className="mt-10 rounded-xl border border-[#e9e5db] bg-[#fbf7ed] p-6">
          <h2 className="text-xl font-semibold">{pt ? 'O nosso compromisso' : 'Our commitment'}</h2>
          <p className="mt-3 leading-relaxed text-[#555]">
            {pt
              ? 'A verificação depende das evidências analisadas e não garante a segurança de todas as transações. O pagamento por uma avaliação não garante aprovação. Incentivamos os utilizadores a confirmar informações antes de pagar ou partilhar dados sensíveis.'
              : 'Verification reflects the evidence reviewed and cannot guarantee the safety of every transaction. Payment for an assessment does not guarantee approval. We encourage users to check information before paying or sharing sensitive details.'}
          </p>
          <p className="mt-4 text-sm font-medium text-[#866415]">
            {pt
              ? 'A plataforma e os procedimentos de verificação estão em desenvolvimento. Esta página descreve a nossa missão e os princípios previstos, não uma certificação atualmente disponível.'
              : 'The platform and verification procedures are in development. This page describes our mission and intended principles, not a certification currently available.'}
          </p>
        </section>
        <p className="mt-9 text-lg font-semibold">
          {pt
            ? 'Verificamos empresas. Promovemos a transparência. Ajudamos os utilizadores a tomar decisões informadas.'
            : 'We verify businesses. We promote transparency. We help users make informed decisions.'}
        </p>
        <Link href={pt ? '/pt' : '/en'} className="mt-8 inline-block font-semibold text-[#866415] hover:underline">
          ← {pt ? 'Voltar ao início' : 'Back to home'}
        </Link>
      </article>
    </main>
  );
}
