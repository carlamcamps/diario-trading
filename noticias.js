/* Aba Notícias: notícias de alto impacto da semana (dados do Forex Factory, guardados em noticias.json
   por uma tarefa automática do GitHub), com explicações simples em português. */
(function () {
  "use strict";

  const TZ = "Europe/Lisbon";
  const BANK = {
    USD: ["a Reserva Federal (Fed)", "Estados Unidos", "o dólar americano"],
    EUR: ["o Banco Central Europeu (BCE)", "Zona Euro", "o euro"],
    GBP: ["o Banco de Inglaterra", "Reino Unido", "a libra"],
    JPY: ["o Banco do Japão", "Japão", "o iene"],
    CAD: ["o Banco do Canadá", "Canadá", "o dólar canadiano"],
    AUD: ["o Banco da Reserva da Austrália", "Austrália", "o dólar australiano"],
    NZD: ["o Banco da Reserva da Nova Zelândia", "Nova Zelândia", "o dólar neozelandês"],
    CHF: ["o Banco Nacional Suíço", "Suíça", "o franco suíço"],
    CNY: ["o Banco Popular da China", "China", "o yuan"],
    ALL: ["os bancos centrais", "Vários países", "cada moeda"]
  };
  const bank = c => (BANK[c] || ["o banco central", c, "a moeda " + c]);

  // Explicações simples. Cada uma: nome em português, o que é, porque é importante, como mexe no mercado.
  const G = [
    { re: /minutes/i, name: "Atas da reunião do banco central",
      what: c => "Imagina que " + bank(c)[0] + " fez uma reunião importante há umas semanas. As atas são o \"caderno de apontamentos\" dessa reunião: contam o que cada pessoa disse e o que as preocupava.",
      why: () => "Ajudam a adivinhar o que o banco vai fazer a seguir com os juros. É como ler o diário de alguém para perceber o que vai fazer amanhã.",
      move: c => "Se as atas mostram que estão preocupados com preços altos (vontade de subir juros), " + bank(c)[2] + " costuma ficar mais forte. Se mostram vontade de baixar juros, costuma ficar mais fraco." },
    { re: /federal funds rate|cash rate|official bank rate|main refinancing rate|overnight rate|policy rate|interest rate|rate decision/i, name: "Decisão da taxa de juro",
      what: c => bank(c)[0] + " decide quanto custa pedir dinheiro emprestado no país. É como decidir o \"preço\" do dinheiro.",
      why: () => "É das notícias mais fortes que existem. Os juros mexem com tudo: empréstimos, poupanças, casas, empresas, e o valor da moeda.",
      move: c => "Juros a subir (ou mais altos do que se esperava) costumam deixar " + bank(c)[2] + " mais forte, porque o dinheiro lá \"rende\" mais. Juros a descer costumam deixá-lo mais fraco." },
    { re: /statement|policy report|monetary policy/i, name: "Comunicado do banco central",
      what: c => "É a carta que " + bank(c)[0] + " escreve a explicar o que decidiu e porquê.",
      why: () => "Não interessa só o que decidiram hoje, mas as pistas sobre o futuro. Uma palavra diferente pode mudar tudo.",
      move: c => "Se o tom for \"duro\" (preocupado com preços altos), " + bank(c)[2] + " tende a subir. Se for \"suave\" (preocupado com a economia fraca), tende a descer." },
    { re: /press conference/i, name: "Conferência de imprensa do banco central",
      what: c => "O chefe de " + bank(c)[0] + " fala com os jornalistas e responde a perguntas, ao vivo.",
      why: () => "Como é ao vivo, qualquer resposta inesperada pode mexer o mercado em segundos.",
      move: () => "O mercado pode andar para cima e para baixo várias vezes enquanto ele fala. É uma hora para ter muito cuidado." },
    { re: /speaks|testifies|testimony|speech/i, name: "Discurso de um chefe de banco central",
      what: c => "Uma pessoa muito importante de " + bank(c)[0] + " vai falar em público.",
      why: () => "Estas pessoas decidem os juros. Se derem uma pista sobre o que vão fazer, toda a gente reage.",
      move: c => "Se falar em subir juros ou em preços altos, " + bank(c)[2] + " costuma ficar mais forte. Se falar em baixar juros, costuma ficar mais fraco. Se não disser nada de novo, pode nem mexer." },
    { re: /pce/i, name: "Inflação preferida da Fed (PCE)",
      what: () => "Mede quanto ficaram mais caras as coisas que as pessoas compram. É o \"termómetro de preços\" de que a Fed mais gosta.",
      why: () => "A Fed usa-o para decidir os juros. Se os preços sobem demasiado depressa, a Fed tem de agir.",
      move: () => "Acima do previsto: o dólar costuma subir. Abaixo do previsto: o dólar costuma descer." },
    { re: /cpi/i, name: "Inflação (CPI)",
      what: c => "Imagina um cesto com as coisas do dia a dia: pão, leite, gasolina, renda. O CPI mede quanto esse cesto ficou mais caro em " + bank(c)[1] + ". As versões \"Core\", \"Median\" ou \"Trimmed\" tiram as coisas que mudam muito de preço (como comida e energia) para ver a tendência verdadeira.",
      why: c => "É das notícias mais importantes. Se os preços sobem muito, " + bank(c)[0] + " pode subir os juros para os acalmar.",
      move: c => "Inflação acima do previsto: " + bank(c)[2] + " costuma subir (mais hipóteses de juros altos). Abaixo do previsto: costuma descer." },
    { re: /ppi/i, name: "Preços na produção (PPI)",
      what: () => "Mede se ficou mais caro para as fábricas e empresas fazerem as coisas. É a inflação \"antes\" de chegar às lojas.",
      why: () => "Se fica caro produzir, daqui a pouco fica caro comprar. É um aviso do que vem aí.",
      move: c => "Acima do previsto: " + bank(c)[2] + " tende a subir. Abaixo: tende a descer. Costuma mexer menos do que o CPI." },
    { re: /non-farm|nonfarm|nfp/i, name: "Empregos criados nos EUA (NFP)",
      what: () => "Conta quantos empregos novos apareceram nos Estados Unidos no último mês (sem contar a agricultura). Sai normalmente na primeira sexta-feira do mês.",
      why: () => "É a notícia mais famosa do Forex. Muitos empregos = economia forte. Poucos empregos = economia a abrandar.",
      move: () => "Mais empregos do que o previsto: o dólar costuma subir. Menos: o dólar costuma descer. Nos primeiros minutos o mercado pode \"enlouquecer\", cuidado!" },
    { re: /unemployment claims|jobless claims/i, name: "Pedidos de subsídio de desemprego",
      what: () => "Conta quantas pessoas pediram subsídio de desemprego pela primeira vez na última semana.",
      why: () => "Mostra, todas as semanas, se as empresas estão a despedir mais ou menos gente.",
      move: () => "Aqui é ao contrário: MAIS pedidos é mau sinal (dólar costuma descer). MENOS pedidos é bom sinal (dólar costuma subir)." },
    { re: /unemployment rate|claimant count/i, name: "Taxa de desemprego",
      what: c => "De todas as pessoas que querem trabalhar em " + bank(c)[1] + ", mostra quantas (em %) não têm emprego.",
      why: () => "Diz se a economia está saudável. Pouco desemprego = as pessoas têm dinheiro para gastar.",
      move: c => "Aqui é ao contrário: desemprego MAIS ALTO do que o previsto costuma enfraquecer " + bank(c)[2] + ". Mais BAIXO costuma fortalecê-lo." },
    { re: /employment change|adp/i, name: "Empregos criados",
      what: c => "Conta quantos empregos novos (ou perdidos, se o número for negativo) houve em " + bank(c)[1] + " no último mês.",
      why: () => "Mais empregos = mais gente a ganhar e a gastar dinheiro = economia mais forte.",
      move: c => "Mais empregos do que o previsto: " + bank(c)[2] + " costuma subir. Menos: costuma descer." },
    { re: /average hourly earnings|wage|earnings/i, name: "Salários",
      what: () => "Mede quanto subiram os salários das pessoas.",
      why: () => "Salários a subir muito depressa podem fazer os preços subir também, e o banco central fica atento.",
      move: c => "Salários acima do previsto: " + bank(c)[2] + " tende a subir. Abaixo: tende a descer." },
    { re: /jolts|job openings/i, name: "Vagas de emprego (JOLTS)",
      what: () => "Conta quantos empregos estão disponíveis à espera de alguém.",
      why: () => "Muitas vagas = as empresas estão a crescer e precisam de gente.",
      move: () => "Mais vagas do que o previsto: o dólar costuma subir. Menos: costuma descer." },
    { re: /retail sales/i, name: "Vendas nas lojas",
      what: c => "Mede quanto as pessoas gastaram nas lojas em " + bank(c)[1] + " no último mês. A versão \"Core\" tira os carros, que mudam muito.",
      why: () => "Quando as pessoas compram muito, a economia está contente. Quando compram pouco, é sinal de que estão a apertar o cinto.",
      move: c => "Vendas acima do previsto: " + bank(c)[2] + " costuma subir. Abaixo: costuma descer." },
    { re: /gdp/i, name: "Crescimento da economia (PIB)",
      what: c => "É a \"nota\" da economia de " + bank(c)[1] + ": mede tudo o que o país produziu e vendeu.",
      why: () => "Mostra se o país está a crescer ou a encolher. Dois trimestres a encolher é o que se chama recessão.",
      move: c => "Crescimento acima do previsto: " + bank(c)[2] + " costuma subir. Abaixo: costuma descer." },
    { re: /pmi|ism/i, name: "Humor das empresas (PMI)",
      what: () => "Pergunta-se aos chefes das empresas se o negócio está a melhorar ou a piorar. Acima de 50 = a crescer. Abaixo de 50 = a encolher.",
      why: () => "É dos primeiros sinais do mês sobre como vai a economia.",
      move: c => "Acima do previsto: " + bank(c)[2] + " costuma subir. Abaixo: costuma descer." },
    { re: /consumer sentiment|consumer confidence/i, name: "Confiança dos consumidores",
      what: () => "Pergunta-se às pessoas se se sentem otimistas com o dinheiro e com o futuro.",
      why: () => "Pessoas confiantes gastam mais. Pessoas com medo poupam.",
      move: c => "Mais confiança do que o previsto: " + bank(c)[2] + " tende a subir. Menos: tende a descer." },
    { re: /inflation expectations/i, name: "Expectativas de inflação",
      what: () => "Pergunta-se às pessoas e empresas quanto acham que os preços vão subir no futuro.",
      why: c => "Se toda a gente espera preços muito mais altos, " + bank(c)[0] + " fica preocupado e pode subir os juros.",
      move: c => "Expectativas acima do previsto: " + bank(c)[2] + " tende a subir. Abaixo: tende a descer." },
    { re: /trade balance/i, name: "Balança comercial",
      what: c => "Compara o que " + bank(c)[1] + " vende para fora com o que compra de fora.",
      why: () => "Vender mais do que se compra faz entrar dinheiro no país.",
      move: c => "Melhor do que o previsto: " + bank(c)[2] + " tende a subir." },
    { re: /holiday/i, name: "Feriado",
      what: c => "É feriado em " + bank(c)[1] + ". Os bancos estão fechados.",
      why: () => "Com menos gente a negociar, o mercado costuma andar devagar, mas às vezes dá saltos estranhos.",
      move: () => "Normalmente mexe pouco. Bom dia para ter calma." },
    { re: /election|vote|referendum/i, name: "Eleições",
      what: c => "Há eleições em " + bank(c)[1] + ".",
      why: () => "Um novo governo pode mudar muitas regras da economia.",
      move: () => "Resultados inesperados podem mexer muito a moeda, às vezes durante dias." }
  ];
  function explain(ev) {
    const g = G.find(x => x.re.test(ev.title));
    if (g) return { name: g.name, what: g.what(ev.country), why: g.why(ev.country), move: g.move(ev.country) };
    return {
      name: ev.title,
      what: "É uma notícia económica de " + bank(ev.country)[1] + " que o Forex Factory marca como de alto impacto.",
      why: "As notícias vermelhas são as que mais costumam mexer o mercado.",
      move: "Se o número sair muito diferente do previsto, " + bank(ev.country)[2] + " pode mexer bastante. Cuidado com as entradas perto desta hora."
    };
  }


  // ---------- icons (one per kind of news) ----------
  const IC = {
    infl: '<path d="M4 8h16l-1.6 9.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8z"/><path d="M8.5 8 11 3.5M15.5 8 13 3.5"/><path d="M9 12v3M12 12v3M15 12v3"/>',
    jobs: '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M8.5 7.5V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8v1.7"/><path d="M3 12.5h18"/>',
    bank: '<path d="M3 9.5 12 4l9 5.5"/><path d="M5 10v7M9.5 10v7M14.5 10v7M19 10v7"/><path d="M3 20h18"/>',
    talk: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7"/>',
    shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>',
    gdp: '<path d="M3 20h18"/><path d="M4 16l5-5 4 3 7-8"/><path d="M15 6h5v5"/>',
    pmi: '<path d="M3 20V10l5 3V10l5 3V6l8 4v10z"/><path d="M7 20v-3h3v3"/>',
    mood: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.2a4.5 4.5 0 0 0 7 0"/><path d="M9 9.8h.01M15 9.8h.01" stroke-width="2.4"/>',
    hol: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>',
    vote: '<rect x="4" y="11" width="16" height="9" rx="1.5"/><path d="M8 11 10 4h5l-1.5 7"/><path d="M9.5 15.5h5"/>',
    other: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>'
  };
  const KIND_NAME = { infl: "Inflação e preços", jobs: "Emprego", bank: "Juros e banco central", talk: "Discursos", shop: "Consumo e vendas", gdp: "Crescimento (PIB)", pmi: "Empresas", mood: "Confiança", hol: "Feriado", vote: "Eleições", other: "Outras" };
  function kind(e) {
    const t = e.title || "";
    if (e.impact === "Holiday" || /holiday|daylight saving/i.test(t)) return "hol";
    if (/election|vote|referendum/i.test(t)) return "vote";
    if (/speaks|testif|speech|press conference|symposium/i.test(t)) return "talk";
    if (/rate|fomc|statement|minutes|projections|monetary/i.test(t)) return "bank";
    if (/cpi|ppi|pce|inflation|price/i.test(t)) return "infl";
    if (/employ|payroll|claims|earnings|wage|jolts|jobs|claimant/i.test(t)) return "jobs";
    if (/retail|sales/i.test(t)) return "shop";
    if (/gdp/i.test(t)) return "gdp";
    if (/pmi|ism/i.test(t)) return "pmi";
    if (/sentiment|confidence/i.test(t)) return "mood";
    return "other";
  }
  const icon = (k, cls) => '<svg class="' + (cls || "ic") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>';
  const FLAG = { USD: "us", EUR: "eu", GBP: "gb", JPY: "jp", CAD: "ca", AUD: "au", NZD: "nz", CHF: "ch", CNY: "cn" };
  const flag = c => FLAG[c] ? '<img class="flag" src="https://flagcdn.com/w40/' + FLAG[c] + '.png" alt="" loading="lazy">' : '<span class="flag nf">' + esc(c).slice(0, 2) + '</span>';

  // ---------- helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtTime = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  const fmtKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const fmtLong = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
  const fmtShort = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, weekday: "short", day: "numeric", month: "short" });
  const MONTHS = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const dayKey = d => fmtKey.format(d);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const timeOf = e => (e.impact === "Holiday" ? "Todo o dia" : fmtTime.format(e.d));
  function until(d) {
    const ms = d - Date.now(); if (ms <= 0) return "já saiu";
    const m = Math.round(ms / 60000), h = Math.floor(m / 60), dd = Math.floor(h / 24);
    if (dd >= 1) return "daqui a " + dd + (dd === 1 ? " dia" : " dias");
    if (h >= 1) return "daqui a " + h + " h " + (m % 60) + " min";
    return "daqui a " + m + " min";
  }

  // ---------- data ----------
  let all = null, err = null, loading = false, root = null;
  const LS_CUR = "diario-noticias-moeda";
  let cur = "ALL"; try { cur = localStorage.getItem(LS_CUR) || "ALL"; } catch (_) {}
  const nowD = new Date();
  let vy = nowD.getFullYear(), vm = nowD.getMonth(), sel = null;
  async function load() {
    if (loading) return; loading = true;
    try {
      const r = await fetch("noticias-arquivo.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("http " + r.status);
      const list = await r.json();
      all = (Array.isArray(list) ? list : []).map(e => ({ ...e, d: new Date(e.date) })).filter(e => !isNaN(e.d)).sort((a, b) => a.d - b.d);
      all.forEach((e, i) => { e.i = i; e.k = kind(e); e.day = dayKey(e.d); });
      err = null;
    } catch (e) { err = e; }
    loading = false; draw();
  }
  const visible = () => (all || []).filter(e => cur === "ALL" || e.country === cur);

  // ---------- styles ----------
  const css = `
.nw { padding-block: 22px 70px; display: flex; flex-direction: column; gap: 18px; max-width: 1000px; margin: 0 auto; }
.nw .flag { width: 20px; height: 14px; border-radius: 3px; object-fit: cover; box-shadow: 0 0 0 1px rgba(0,0,0,.25); display: inline-block; vertical-align: -2px; }
.nw .flag.nf { background: #2A0711; color: #EFDCC6; font-size: 9px; text-align: center; line-height: 14px; }
.nw-hero { position: relative; border-radius: 24px; padding: 22px 24px 20px; background: linear-gradient(135deg, rgba(92, 26, 44, .92), rgba(52, 12, 22, .92)); border: 1px solid rgba(236,170,188,.2); overflow: hidden; box-shadow: 0 24px 50px -24px rgba(0,0,0,.8); }
.nw-hero::after { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(205,167,94,.45); border-radius: 18px; pointer-events: none; }
.nw-hero .bg { position: absolute; right: -40px; top: -50px; width: 260px; height: 260px; color: rgba(205,167,94,.10); }
.nw-hero .k { font-family: var(--script); font-size: 32px; color: var(--gold); line-height: 1; position: relative; }
.nw-hero h2 { position: relative; margin: 2px 0 0; font-family: var(--display); font-weight: 400; font-size: clamp(30px, 5vw, 48px); color: var(--champ); line-height: 1.05; }
.nw-hero p { position: relative; margin: 6px 0 0; font-size: 13px; color: var(--soft); max-width: 560px; }
.nw-next { position: relative; display: flex; gap: 10px; overflow-x: auto; padding: 14px 2px 4px; scroll-snap-type: x mandatory; scrollbar-width: none; }
.nw-next::-webkit-scrollbar { display: none; }
.nw-card { flex: 0 0 auto; width: 210px; scroll-snap-align: start; border: 0; border-radius: 16px; background: #FBF3EE; color: #3A1018; padding: 12px; text-align: left; cursor: pointer; font: inherit; display: flex; flex-direction: column; gap: 6px; transition: transform .2s ease, box-shadow .2s ease; }
.nw-card:hover { transform: translateY(-3px); box-shadow: 0 10px 22px -10px rgba(0,0,0,.6); }
.nw-card .top { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.nw-card .bubble { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; background: #2A0711; color: #E7C989; }
.nw-card .bubble .ic { width: 19px; height: 19px; }
.nw-card .when { font-size: 11.5px; color: #B03F55; font-weight: 600; text-align: right; }
.nw-card b { font-family: var(--display); font-weight: 600; font-size: 16px; line-height: 1.2; }
.nw-card small { color: #8C6168; font-size: 11.5px; display: flex; align-items: center; gap: 6px; }
.nw-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.nw-mnav { display: inline-flex; align-items: center; gap: 4px; border: 1px solid var(--line); border-radius: 999px; padding: 3px; background: rgba(0,0,0,.2); }
.nw-mnav span { min-width: 170px; text-align: center; font-family: var(--display); font-size: 19px; color: var(--champ); }
.nw-mnav button { width: 34px; height: 34px; border-radius: 50%; border: 0; background: transparent; color: var(--gold); font-size: 18px; cursor: pointer; }
.nw-mnav button:hover { background: rgba(205,167,94,.14); }
.nw-cur { display: flex; gap: 6px; flex-wrap: wrap; }
.nw-cur button { border: 1px solid var(--line); background: rgba(0,0,0,.2); color: var(--champ); border-radius: 999px; padding: 5px 11px 5px 8px; font: 500 12.5px/1 var(--sans); cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
.nw-cur button[aria-pressed="true"] { background: var(--champ); color: #2A0A11; border-color: var(--champ); }
.nw-cal { border-radius: 22px; padding: 16px; background: rgba(61, 34, 25, .82); border: 1px solid rgba(232,200,160,.18); box-shadow: 0 24px 50px -24px rgba(0,0,0,.8); }
.nw-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)) repeat(2, minmax(0, .62fr)); gap: 6px; }
.nw-grid.anim { animation: nwIn .35s ease; }
@keyframes nwIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.nw-wh { text-align: center; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--soft); padding-bottom: 2px; }
.nw-d { position: relative; min-height: 96px; border-radius: 13px; border: 0; background: #FBF3EE; color: #3A1018; padding: 7px 8px; display: flex; flex-direction: column; gap: 5px; text-align: left; cursor: pointer; font: inherit; transition: transform .15s ease, box-shadow .15s ease; min-width: 0; }
.nw-d:hover { transform: translateY(-2px); box-shadow: 0 8px 18px -8px rgba(0,0,0,.6); }
.nw-d.out { visibility: hidden; }
.nw-d.we { background: #E9DDD8; }
.nw-d.past { background: #EFE3DE; }
.nw-d.past .ics { opacity: .7; }
.nw-d.hol { background: #CFCACB; color: #4E4648; }
.nw-d.today { box-shadow: inset 0 0 0 2px #C9A55E; }
.nw-d.sel { box-shadow: inset 0 0 0 2px #3A1018; }
.nw-d .dn { font-family: var(--display); font-size: 19px; font-weight: 600; line-height: 1; display: flex; justify-content: space-between; align-items: baseline; }
.nw-d .dn em { font-style: normal; font-family: var(--sans); font-size: 10px; font-weight: 600; color: #B03F55; }
.nw-d .ics { display: flex; flex-wrap: wrap; gap: 4px; }
.nw-d .chip { width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: #2A0711; color: #E7C989; }
.nw-d.hol .chip { background: #7D7476; color: #F1EEEE; }
.nw-d .chip .ic { width: 15px; height: 15px; }
.nw-d .more { font-size: 11px; font-weight: 600; color: #8C6168; align-self: center; }
.nw-d .lbl { font-size: 10.5px; color: #8C6168; line-height: 1.2; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.nw-d.hol .lbl { color: #4E4648; }
.nw-legend { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-top: 12px; font-size: 12px; color: var(--soft); }
.nw-legend span { display: inline-flex; align-items: center; gap: 6px; }
.nw-legend .chip { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: #2A0711; color: #E7C989; }
.nw-legend .chip .ic { width: 13px; height: 13px; }
.nw-legend .chip.g { background: #7D7476; color: #F1EEEE; }
.nw-msg { text-align: center; color: var(--soft); padding: 50px 10px; }
/* day panel */
.nw-sheet { position: fixed; inset: 0; z-index: 25; pointer-events: none; }
.nw-sheet .scrim { position: absolute; inset: 0; background: rgba(8,2,4,.55); opacity: 0; transition: opacity .25s ease; }
.nw-sheet .panel { position: absolute; top: 0; right: 0; bottom: 0; width: min(460px, 100%); background: #2A0711; border-left: 1px solid rgba(205,167,94,.4); box-shadow: -24px 0 50px -20px rgba(0,0,0,.8); transform: translateX(104%); transition: transform .32s cubic-bezier(.2,.8,.2,1); display: flex; flex-direction: column; padding: max(18px, env(safe-area-inset-top, 0px)) 18px max(18px, env(safe-area-inset-bottom, 0px)); overflow-y: auto; }
.nw-sheet.open { pointer-events: auto; }
.nw-sheet.open .scrim { opacity: 1; }
.nw-sheet.open .panel { transform: none; }
.nw-ph { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; padding-bottom: 12px; border-bottom: 1px solid rgba(205,167,94,.25); margin-bottom: 14px; }
.nw-ph .k { font-family: var(--script); color: var(--gold); font-size: 26px; line-height: 1; }
.nw-ph h3 { margin: 2px 0 0; font-family: var(--display); font-weight: 400; font-size: 28px; color: var(--champ); line-height: 1.1; }
.nw-ph button { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(205,167,94,.35); background: transparent; color: var(--champ); font-size: 18px; cursor: pointer; flex: 0 0 auto; }
.nw-list { display: flex; flex-direction: column; gap: 10px; }
.nw-ev { background: #FBF3EE; color: #3A1018; border-radius: 16px; padding: 12px; animation: nwIn .35s ease both; }
.nw-ev.hol { background: #D6D1D2; color: #3E3739; }
.nw-ev .row { display: flex; gap: 10px; align-items: flex-start; }
.nw-ev .bubble { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; background: #2A0711; color: #E7C989; flex: 0 0 auto; }
.nw-ev.hol .bubble { background: #7D7476; color: #F1EEEE; }
.nw-ev .bubble .ic { width: 22px; height: 22px; }
.nw-ev .meta { font-size: 12px; color: #8C6168; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nw-ev .meta b { color: #3A1018; }
.nw-ev h4 { margin: 3px 0 0; font-family: var(--display); font-weight: 600; font-size: 18px; line-height: 1.2; }
.nw-ev .orig { font-size: 11.5px; color: #8C6168; }
.nw-ev .nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 6px; margin-top: 10px; }
.nw-ev .nums div { background: rgba(58,16,24,.06); border-radius: 10px; padding: 6px 8px; }
.nw-ev .nums small { display: block; font-size: 10.5px; color: #8C6168; }
.nw-ev .nums b { font-family: var(--display); font-size: 17px; }
.nw-ev .more { margin-top: 10px; width: 100%; border: 1px solid rgba(58,16,24,.18); background: transparent; border-radius: 10px; padding: 8px; font: 600 13px/1 var(--sans); color: #6B1A2C; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.nw-ev .more span { transition: transform .2s ease; }
.nw-ev .more[aria-expanded="true"] span { transform: rotate(180deg); }
.nw-ev .exp { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s ease; }
.nw-ev .exp > div { overflow: hidden; }
.nw-ev .exp.open { grid-template-rows: 1fr; }
.nw-ev .exp h5 { margin: 12px 0 3px; font-family: var(--display); font-weight: 600; font-size: 15px; color: #6B1A2C; }
.nw-ev .exp p { margin: 0; font-size: 13.5px; line-height: 1.55; }
.nw-ev .warn { margin-top: 10px; background: rgba(201,165,94,.18); border-radius: 10px; padding: 8px 10px; font-size: 12.5px; }
.nw-empty { color: var(--soft); text-align: center; padding: 30px 10px; }
@media (max-width: 700px) {
  .nw-grid { grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 3px; }
  .nw-cal { padding: 10px 6px; border-radius: 18px; }
  .nw-d { min-height: 58px; padding: 4px 3px; border-radius: 9px; align-items: center; gap: 3px; }
  .nw-d .dn { font-size: 14px; justify-content: center; }
  .nw-d .dn em, .nw-d .lbl { display: none; }
  .nw-d .chip { width: 17px; height: 17px; }
  .nw-d .chip .ic { width: 11px; height: 11px; }
  .nw-d .ics { justify-content: center; gap: 2px; }
  .nw-d .ics .chip:nth-child(n+3) { display: none; }
  .nw-wh { font-size: 9px; letter-spacing: .02em; }
  .nw-mnav span { min-width: 130px; font-size: 16px; }
  .nw-hero { padding: 18px; }
  .nw-sheet .panel { top: auto; left: 0; width: 100%; max-height: 86vh; border-left: 0; border-top: 1px solid rgba(205,167,94,.4); border-radius: 22px 22px 0 0; transform: translateY(104%); }
}
@media (prefers-reduced-motion: reduce) { .nw-grid.anim, .nw-ev { animation: none; } .nw-sheet .panel, .nw-sheet .scrim, .nw-card, .nw-d { transition: none; } }
`;
  function injectCss() { if (document.getElementById("nw-css")) return; const s = document.createElement("style"); s.id = "nw-css"; s.textContent = css; document.head.appendChild(s); }

  // ---------- render ----------
  function draw(anim) {
    if (!root || !document.contains(root)) return;
    if (!all) { root.innerHTML = '<div class="nw"><div class="nw-msg">' + (err ? "Não foi possível carregar as notícias. Tenta outra vez daqui a pouco." : "A carregar as notícias…") + '</div></div>'; return; }
    const evs = visible(), now = Date.now(), todayK = dayKey(new Date());
    const curs = [...new Set(all.map(e => e.country))].sort((a, b) => (a === "USD" ? -1 : b === "USD" ? 1 : a.localeCompare(b)));
    const next = evs.filter(e => e.d.getTime() > now - 10 * 60000 && e.impact !== "Holiday").slice(0, 8);
    let h = '<div class="nw">';
    // hero with the next strong news as cards
    h += '<section class="nw-hero"><svg class="bg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".6">' + IC.talk + '</svg>' +
      '<div class="k">Notícias</div><h2>O que vem aí</h2><p>Só as notícias de alto impacto do Forex Factory, em horas de Portugal. Toca numa para saberes o que é.</p>';
    if (next.length) {
      h += '<div class="nw-next">' + next.map(e => { const x = explain(e); return '<button type="button" class="nw-card" data-ev="' + e.i + '"><span class="top"><span class="bubble">' + icon(e.k) + '</span><span class="when">' + esc(until(e.d)) + '</span></span><b>' + esc(x.name) + '</b><small>' + flag(e.country) + esc(e.country) + ' · ' + esc(cap(fmtShort.format(e.d))) + ', ' + esc(timeOf(e)) + '</small></button>'; }).join("") + '</div>';
    } else h += '<p style="margin-top:12px">Não há notícias fortes marcadas para os próximos dias.</p>';
    h += '</section>';
    // month bar
    h += '<div class="nw-bar"><div class="nw-mnav"><button type="button" data-mv="-1" aria-label="Mês anterior">‹</button><span>' + cap(MONTHS[vm]) + ' ' + vy + '</span><button type="button" data-mv="1" aria-label="Mês seguinte">›</button></div>' +
      '<div class="nw-cur" role="group" aria-label="Moeda"><button type="button" data-cur="ALL" aria-pressed="' + (cur === "ALL") + '">Todas</button>' +
      curs.map(c => '<button type="button" data-cur="' + esc(c) + '" aria-pressed="' + (cur === c) + '">' + flag(c) + esc(c) + '</button>').join("") + '</div></div>';
    // month grid
    const first = new Date(Date.UTC(vy, vm, 1, 12)), startOff = (first.getUTCDay() + 6) % 7, nDays = new Date(Date.UTC(vy, vm + 1, 0)).getUTCDate();
    const byDay = {}; for (const e of evs) (byDay[e.day] = byDay[e.day] || []).push(e);
    h += '<section class="nw-cal"><div class="nw-grid' + (anim ? " anim" : "") + '">' + ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(n => '<div class="nw-wh">' + n + '</div>').join("");
    const cells = Math.ceil((startOff + nDays) / 7) * 7;
    for (let i = 0; i < cells; i++) {
      const dnum = i - startOff + 1;
      if (dnum < 1 || dnum > nDays) { h += '<div class="nw-d out"></div>'; continue; }
      const k = vy + "-" + String(vm + 1).padStart(2, "0") + "-" + String(dnum).padStart(2, "0");
      const list = byDay[k] || [], hol = list.length && list.every(e => e.impact === "Holiday");
      const strong = list.filter(e => e.impact !== "Holiday");
      const cls = (i % 7 >= 5 ? " we" : "") + (k < todayK ? " past" : "") + (hol ? " hol" : "") + (k === todayK ? " today" : "") + (sel === k ? " sel" : "");
      const kinds = [...new Set(list.map(e => e.k))];
      h += '<button type="button" class="nw-d' + cls + '" data-day="' + k + '" aria-label="' + dnum + ' de ' + MONTHS[vm] + (list.length ? ", " + (hol ? "feriado" : strong.length + " notícias fortes") : ", sem notícias") + '"><span class="dn">' + dnum + (strong.length ? '<em>' + strong.length + '</em>' : '') + '</span>';
      if (kinds.length) h += '<span class="ics">' + kinds.slice(0, 3).map(kk => '<span class="chip" title="' + KIND_NAME[kk] + '">' + icon(kk) + '</span>').join("") + (kinds.length > 3 ? '<span class="more">+' + (kinds.length - 3) + '</span>' : '') + '</span>';
      if (list.length) h += '<span class="lbl">' + esc(hol ? "Feriado" : explain(strong[0]).name) + '</span>';
      h += '</button>';
    }
    h += '</div><div class="nw-legend">' + ["infl", "jobs", "bank", "talk", "shop", "gdp", "pmi"].map(kk => '<span><span class="chip">' + icon(kk) + '</span>' + KIND_NAME[kk] + '</span>').join("") + '<span><span class="chip g">' + icon("hol") + '</span>Feriado</span></div></section>';
    h += '</div>';
    root.innerHTML = h;
  }

  // ---------- day panel ----------
  let sheet = null, lastFocus = null;
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement("div"); sheet.className = "nw-sheet"; sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = '<div class="scrim"></div><div class="panel" role="dialog" aria-modal="true" aria-labelledby="nwPT"><div class="nw-ph"><div><div class="k" id="nwPK">Notícias do dia</div><h3 id="nwPT"></h3></div><button type="button" class="nw-x" aria-label="Fechar">✕</button></div><div class="nw-list" id="nwPL"></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener("click", e => {
      if (e.target.classList.contains("scrim") || e.target.closest(".nw-x")) { closeSheet(); return; }
      const b = e.target.closest("button.more");
      if (b) { const x = b.nextElementSibling, open = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(open)); x.classList.toggle("open", open); }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });
    return sheet;
  }
  function evHtml(e, openIt, n) {
    const x = explain(e), hol = e.impact === "Holiday";
    let h = '<article class="nw-ev' + (hol ? " hol" : "") + '" style="animation-delay:' + (n * 60) + 'ms"><div class="row"><span class="bubble">' + icon(e.k) + '</span><div><div class="meta">' + flag(e.country) + '<b>' + esc(e.country) + '</b> · ' + esc(timeOf(e)) + ' · ' + esc(KIND_NAME[e.k]) + '</div><h4>' + esc(hol ? "Feriado (" + bank(e.country)[1] + ")" : x.name) + '</h4><div class="orig">' + esc(e.title) + '</div></div></div>';
    if (!hol) h += '<div class="nums"><div><small>Atual</small><b>' + esc(e.actual || "—") + '</b></div><div><small>Previsto</small><b>' + esc(e.forecast || "—") + '</b></div><div><small>Anterior</small><b>' + esc(e.previous || "—") + '</b></div></div>';
    h += '<button type="button" class="more" aria-expanded="' + (openIt ? "true" : "false") + '">O que é isto? <span>⌄</span></button><div class="exp' + (openIt ? " open" : "") + '"><div><h5>O que é</h5><p>' + esc(x.what) + '</p><h5>Porque é importante</h5><p>' + esc(x.why) + '</p><h5>Como mexe no mercado</h5><p>' + esc(x.move) + '</p>' + (hol ? '' : '<div class="warn">Nos minutos antes e depois desta notícia o preço pode dar saltos grandes. Muitas traders preferem não abrir operações nessa altura.</div>') + '</div></div></article>';
    return h;
  }
  function openDay(k, focusEv) {
    ensureSheet(); sel = k; draw();
    const list = visible().filter(e => e.day === k);
    const [y, m, d] = k.split("-").map(Number);
    sheet.querySelector("#nwPT").textContent = cap(fmtLong.format(new Date(Date.UTC(y, m - 1, d, 12))));
    sheet.querySelector("#nwPK").textContent = list.length ? (list.length === 1 ? "1 notícia" : list.length + " notícias") : "Dia calmo";
    sheet.querySelector("#nwPL").innerHTML = list.length ? list.map((e, n) => evHtml(e, focusEv != null ? e.i === focusEv : list.length === 1, n)).join("") : '<div class="nw-empty">Sem notícias de alto impacto neste dia. ' + (cur !== "ALL" ? "(A mostrar só " + esc(cur) + ".)" : "") + '</div>';
    lastFocus = document.activeElement;
    sheet.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => sheet.classList.add("open"));
    setTimeout(() => sheet.querySelector(".nw-x").focus({ preventScroll: true }), 50);
  }
  function closeSheet() { sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true"); sel = null; draw(); if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); }

  window.Noticias = {
    mount(el) {
      injectCss(); root = el;
      el.addEventListener("click", e => {
        const mv = e.target.closest("[data-mv]");
        if (mv) { vm += +mv.dataset.mv; if (vm < 0) { vm = 11; vy--; } if (vm > 11) { vm = 0; vy++; } draw(true); return; }
        const c = e.target.closest("[data-cur]");
        if (c) { cur = c.dataset.cur; try { localStorage.setItem(LS_CUR, cur); } catch (_) {} draw(); return; }
        const dd = e.target.closest("[data-day]");
        if (dd) { openDay(dd.dataset.day); return; }
        const ev = e.target.closest("[data-ev]");
        if (ev && all) { const x = all[+ev.dataset.ev]; if (x) { vy = +x.day.slice(0, 4); vm = +x.day.slice(5, 7) - 1; openDay(x.day, x.i); } }
      });
      draw();
      load();
      setInterval(() => { if (root && document.contains(root) && !(sheet && sheet.classList.contains("open"))) draw(); }, 60000);
    }
  };
})();
