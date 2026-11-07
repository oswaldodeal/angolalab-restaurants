import Link from 'next/link';
export default function AccountUnavailable({ language }: { language: 'pt' | 'en' }) {
  const pt = language === 'pt';
  return <main className="min-h-[60vh] bg-white px-5 py-16 text-[#242424]">
    <div className="mx-auto max-w-xl rounded-xl border border-[#ded8c5] p-8">
      <h1 className="text-3xl font-semibold">{pt ? 'Contas em preparação' : 'Accounts are in preparation'}</h1>
      <p className="mt-5 leading-7">{pt ? 'O acesso de proprietários e clientes ainda não está disponível. Não introduza palavras-passe. Pode enviar os dados de um restaurante para análise da equipa.' : 'Owner and customer accounts are not available yet. Do not enter passwords. You can submit a restaurant for staff review.'}</p>
      <Link className="mt-6 inline-block rounded-lg bg-[#252a32] px-5 py-3 font-semibold text-white" href={pt ? '/pt/restaurantes/registar' : '/en/restaurants/submit'}>{pt ? 'Enviar restaurante para análise' : 'Submit a restaurant for review'}</Link>
    </div>
  </main>;
}
