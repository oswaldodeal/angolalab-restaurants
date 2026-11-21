'use client';
import { useState } from 'react';
type Language = 'en' | 'pt';
const countries = [
  { code:'AO', en:'Angola', pt:'Angola' }, { code:'BR', en:'Brazil', pt:'Brasil' },
  { code:'DK', en:'Denmark', pt:'Dinamarca' }, { code:'FR', en:'France', pt:'França' },
  { code:'DE', en:'Germany', pt:'Alemanha' }, { code:'NL', en:'Netherlands', pt:'Países Baixos' },
  { code:'PT', en:'Portugal', pt:'Portugal' }, { code:'ZA', en:'South Africa', pt:'África do Sul' },
  { code:'GB', en:'United Kingdom', pt:'Reino Unido' }, { code:'US', en:'United States', pt:'Estados Unidos' }
];
export default function FppLocationDemo({language}:{language:Language}) {
  const pt = language === 'pt';
  const [country,setCountry] = useState('DK');
  const [city,setCity] = useState('Copenhagen');
  const [markets,setMarkets] = useState<string[]>(['AO','DK','GB']);
  const [remote,setRemote] = useState(true);
  const [showCountry,setShowCountry] = useState(true);
  const [showCity,setShowCity] = useState(false);
  const [showMarkets,setShowMarkets] = useState(true);
  const [showRemote,setShowRemote] = useState(true);
  const [visitor,setVisitor] = useState(false);
  const name = (code:string) => {const c=countries.find(x=>x.code===code);return c ? (pt?c.pt:c.en) : code;};
  const cb='h-4 w-4 shrink-0 accent-[#927018]';
  const field='mt-2 block w-full rounded-lg border border-[#c9c9c4] bg-white px-3 py-3 text-sm';
  return <section aria-label={pt?'Localização e colaboração':'Location and collaboration'} className="mt-7 rounded-2xl border border-[#dedbd3] bg-white p-5 text-[#252525] sm:p-7">
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#927018]">FPP · {pt?'Protótipo V1':'V1 prototype'}</p>
    <h2 className="mt-2 text-xl font-bold">{pt?'Localização e países de colaboração':'Location and collaboration countries'}</h2>
    <p className="mt-2 text-sm leading-6 text-[#555]">{pt?'Exemplo local. As alterações não são guardadas, publicadas nem transferidas para o diretório.':'Local demonstration. Changes are not saved, published, or transferred to the directory.'}</p>
    <div className="mt-5 flex flex-wrap gap-2">
      <button type="button" onClick={()=>setVisitor(false)} aria-pressed={!visitor} className={`rounded-lg px-4 py-2 text-sm font-semibold ${!visitor?'bg-[#252a32] text-white':'border bg-white'}`}>{pt?'Editar exemplo':'Edit example'}</button>
      <button type="button" onClick={()=>setVisitor(true)} aria-pressed={visitor} className={`rounded-lg px-4 py-2 text-sm font-semibold ${visitor?'bg-[#252a32] text-white':'border bg-white'}`}>{pt?'Vista do visitante':'Visitor preview'}</button>
    </div>
    {!visitor ? <div className="mt-5 grid gap-5 sm:grid-cols-2">
      <label className="block text-sm font-semibold">{pt?'País de residência':'Country of residence'}<select value={country} onChange={e=>setCountry(e.target.value)} className={field}>{countries.map(c=><option key={c.code} value={c.code}>{pt?c.pt:c.en}</option>)}</select></label>
      <label className="block text-sm font-semibold">{pt?'Cidade ou localidade (opcional)':'City or place (optional)'}<input type="text" maxLength={80} value={city} onChange={e=>setCity(e.target.value)} className={field} placeholder={pt?'Ex.: Copenhaga':'e.g. Copenhagen'}/></label>
      <fieldset className="sm:col-span-2"><legend className="text-sm font-bold">{pt?'Países onde gostaria de colaborar':'Countries where you want to collaborate'}</legend>
        <p className="mt-1 text-xs text-[#666]">{pt?'Selecione vários países. Lista curta apenas para demonstração.':'Select multiple countries. Short sample list for this demonstration only.'}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">{countries.map(c=><label key={c.code} className="flex items-center gap-2 text-sm"><input type="checkbox" className={cb} checked={markets.includes(c.code)} onChange={e=>setMarkets(prev=>e.target.checked?[...prev,c.code]:prev.filter(v=>v!==c.code))}/>{pt?c.pt:c.en}</label>)}</div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" className={cb} checked={remote} onChange={e=>setRemote(e.target.checked)}/>{pt?'Disponível para projetos digitais à distância':'Available for remote digital projects'}</label>
      <fieldset className="rounded-xl border border-[#dedbd3] p-4 sm:col-span-2"><legend className="px-1 text-sm font-bold">{pt?'Permissões de visibilidade':'Visibility permissions'}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            [showCountry,setShowCountry,pt?'Mostrar país':'Show country'],
            [showCity,setShowCity,pt?'Mostrar cidade':'Show city'],
            [showMarkets,setShowMarkets,pt?'Mostrar países de colaboração':'Show collaboration countries'],
            [showRemote,setShowRemote,pt?'Mostrar disponibilidade remota':'Show remote availability']
          ] as const).map(([value,set,label],i)=><label key={i} className="flex items-center gap-2 text-sm"><input type="checkbox" className={cb} checked={value} onChange={e=>set(e.target.checked)}/>{label}</label>)}
        </div>
        <p className="mt-3 text-xs text-[#666]">{pt?'A cidade começa privada. Ocultar o país também oculta a cidade.':'City is private by default. Hiding country also hides city.'}</p>
      </fieldset>
    </div> : <div className="mt-5 rounded-xl bg-[#f7f6f2] p-5 text-sm leading-7">
      <h3 className="font-bold">{pt?'Informação visível ao visitante':'Information visible to visitors'}</h3>
      {showCountry && <p>{pt?'País':'Country'}: {name(country)}</p>}
      {showCountry && showCity && city.trim() && <p>{pt?'Cidade':'City'}: {city.trim()}</p>}
      {showMarkets && markets.length>0 && <p>{pt?'Colaboração':'Collaboration'}: {markets.map(name).join(' · ')}</p>}
      {showRemote && <p>{pt?'Projetos remotos':'Remote projects'}: {remote?(pt?'Disponível':'Available'):(pt?'Não indicado':'Not selected')}</p>}
      {!showCountry && (!showMarkets || markets.length===0) && !showRemote && <p>{pt?'Nenhuma informação partilhada.':'No location or collaboration information shared.'}</p>}
    </div>}
    <p className="mt-4 text-xs leading-5 text-[#666]">{pt?'Antes do lançamento real: lista completa de países, consentimento e validação no servidor.':'Before launch: complete country list, consent and server-side permission checks.'}</p>
  </section>;
}
