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

  // ---------- data ----------
  let data = null, err = null, loading = false, mountEl = null, timer = null;
  async function load() {
    if (loading) return; loading = true;
    try {
      const r = await fetch("noticias.json?t=" + Date.now(), { cache: "no-store" });
      if (!r.ok) throw new Error("http " + r.status);
      const list = await r.json();
      const lm = r.headers.get("last-modified");
      data = { list: Array.isArray(list) ? list : [], updated: lm ? new Date(lm) : null };
      err = null;
    } catch (e) { err = e; }
    loading = false;
    if (mountEl && document.contains(mountEl)) draw();
  }

  // ---------- helpers ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtDay = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
  const fmtShort = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, day: "numeric", month: "short" });
  const fmtTime = new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  const fmtKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  const dayKey = d => fmtKey.format(d);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  function until(d) {
    const ms = d - Date.now(); if (ms <= 0) return "a decorrer ou já saiu";
    const m = Math.round(ms / 60000), h = Math.floor(m / 60), dd = Math.floor(h / 24);
    if (dd >= 1) return "daqui a " + dd + (dd === 1 ? " dia" : " dias") + (h % 24 ? " e " + (h % 24) + " h" : "");
    if (h >= 1) return "daqui a " + h + " h" + (m % 60 ? " " + (m % 60) + " min" : "");
    return "daqui a " + m + " min";
  }
  function ago(d) {
    if (!d) return "";
    const m = Math.round((Date.now() - d) / 60000);
    if (m < 2) return "atualizado agora mesmo";
    if (m < 60) return "atualizado há " + m + " min";
    const h = Math.round(m / 60); return "atualizado há " + h + (h === 1 ? " hora" : " horas");
  }

  // ---------- styles ----------
  const css = `
.nw { padding-block: 22px 70px; display: flex; flex-direction: column; gap: 16px; max-width: 980px; margin: 0 auto; }
.nw-head { border-radius: 22px; padding: 22px 24px; background: rgba(71, 20, 31, .8); border: 1px solid rgba(236, 170, 188, .18); box-shadow: 0 24px 50px -24px rgba(0,0,0,.8); position: relative; }
.nw-head::after { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(205,167,94,.45); border-radius: 16px; pointer-events: none; }
.nw-head .k { font-family: var(--script); font-size: 30px; color: var(--gold); line-height: 1; }
.nw-head h2 { margin: 4px 0 0; font-family: var(--display); font-weight: 400; font-size: clamp(28px, 4.6vw, 44px); line-height: 1.05; color: var(--champ); }
.nw-head p { margin: 8px 0 0; color: var(--soft); font-size: 13px; }
.nw-next { margin-top: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: #FBF3EE; color: #3A1018; border-radius: 14px; padding: 12px 14px; border: 0; width: 100%; text-align: left; cursor: pointer; font: inherit; }
.nw-next:hover { box-shadow: inset 0 0 0 1.5px rgba(58,16,24,.25); }
.nw-next small { display: block; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #8C6168; }
.nw-next b { font-family: var(--display); font-weight: 600; font-size: 19px; }
.nw-next .when { font-size: 13px; color: #8C6168; text-align: right; }
.nw-next .when strong { display: block; color: #B03F55; font-size: 15px; }
.nw-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; }
.nw-day { border-radius: 16px; background: rgba(61, 34, 25, .8); border: 1px solid rgba(232, 200, 160, .16); padding: 10px; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.nw-day.today { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }
.nw-day.past { opacity: .62; }
.nw-dh { display: flex; justify-content: space-between; align-items: baseline; gap: 6px; padding: 2px 2px 4px; }
.nw-dh b { font-family: var(--display); font-weight: 500; font-size: 16px; color: var(--champ); }
.nw-dh span { font-size: 11px; color: var(--soft); }
.nw-ev { border: 0; border-radius: 11px; background: #FBF3EE; color: #3A1018; padding: 8px 9px; text-align: left; cursor: pointer; display: flex; flex-direction: column; gap: 3px; font: inherit; min-width: 0; }
.nw-ev:hover { box-shadow: inset 0 0 0 1.5px rgba(58,16,24,.28); }
.nw-ev.done { background: #E9DDD8; }
.nw-ev .t { display: flex; align-items: center; gap: 6px; font-size: 12px; font-variant-numeric: tabular-nums; color: #8C6168; }
.nw-ev .c { font-weight: 600; font-size: 10.5px; letter-spacing: .05em; background: #2A0711; color: #EFDCC6; border-radius: 6px; padding: 1px 6px; }
.nw-ev .n { font-weight: 600; font-size: 13px; line-height: 1.25; overflow-wrap: anywhere; }
.nw-ev .o { font-size: 11px; color: #8C6168; overflow-wrap: anywhere; }
.nw-none { font-size: 12px; color: var(--soft); font-style: italic; padding: 4px 2px; }
.nw-tip { text-align: center; color: var(--soft); font-size: 12.5px; }
.nw-msg { text-align: center; color: var(--soft); padding: 40px 10px; }
.nw-dlg .dlg-card { width: min(520px, 100%); max-height: calc(100vh - 32px); overflow: auto; }
.nw-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.nw-meta div { background: rgba(0,0,0,.25); border-radius: 12px; padding: 8px 10px; }
.nw-meta small { display: block; color: var(--soft); font-size: 11px; }
.nw-meta b { font-family: var(--display); font-size: 18px; color: var(--champ); font-weight: 600; }
.nw-sec h4 { margin: 0 0 4px; font-family: var(--display); font-weight: 500; color: var(--gold); font-size: 16px; }
.nw-sec p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--champ); }
.nw-warn { background: rgba(205,167,94,.12); border: 1px solid rgba(205,167,94,.35); border-radius: 12px; padding: 10px 12px; font-size: 13px; color: var(--champ); }
@media (max-width: 860px) { .nw-grid { grid-template-columns: minmax(0, 1fr); } .nw-head { padding: 18px; } }
`;
  function injectCss() { if (document.getElementById("nw-css")) return; const s = document.createElement("style"); s.id = "nw-css"; s.textContent = css; document.head.appendChild(s); }

  // ---------- render ----------
  let byId = [];
  function draw() {
    if (!mountEl) return;
    if (!data) { mountEl.innerHTML = '<div class="nw"><div class="nw-msg">' + (err ? "Não foi possível carregar as notícias. Tenta outra vez daqui a pouco." : "A carregar as notícias…") + '</div></div>'; return; }
    const evs = data.list.filter(e => e && e.impact === "High").map(e => ({ ...e, d: new Date(e.date) })).filter(e => !isNaN(e.d)).sort((a, b) => a.d - b.d);
    byId = evs;
    const now = Date.now(), todayK = dayKey(new Date());
    // days of the week shown: Monday..Friday of the week in the file, plus weekend days that have events
    const all = data.list.map(e => new Date(e.date)).filter(d => !isNaN(d)).sort((a, b) => a - b);
    // the file's week starts on Sunday evening, so take a mid-week event to find that week's Monday (in Lisbon time)
    const base = all.length ? all[Math.floor(all.length / 2)] : new Date();
    const [by, bm, bd] = dayKey(base).split("-").map(Number);
    const wd = new Date(Date.UTC(by, bm - 1, bd)).getUTCDay();
    const days = [];
    for (let i = 0; i < 7; i++) days.push(new Date(Date.UTC(by, bm - 1, bd - ((wd + 6) % 7) + i, 12)));
    const evKeys = new Set(evs.map(e => dayKey(e.d)));
    const shownDays = days.filter((d, i) => i < 5 || evKeys.has(dayKey(d)));
    const next = evs.find(e => e.d.getTime() > now - 5 * 60000);
    let h = '<div class="nw">';
    h += '<div class="nw-head"><div class="k">Notícias</div><h2>Alto impacto desta semana</h2>' +
      '<p>' + (shownDays.length ? cap(fmtShort.format(shownDays[0])) + " a " + fmtShort.format(shownDays[shownDays.length - 1]) : "") + ' · horas de Portugal · ' + esc(ago(data.updated)) + ' · dados do Forex Factory</p>';
    if (next) {
      const i = evs.indexOf(next), x = explain(next);
      h += '<button type="button" class="nw-next" data-nw="' + i + '"><span><small>Próxima notícia forte</small><b>' + esc(x.name) + '</b> <span style="color:#8C6168;font-size:13px">' + esc(next.country) + '</span></span>' +
        '<span class="when"><strong>' + esc(until(next.d)) + '</strong>' + esc(cap(fmtDay.format(next.d))) + ', ' + esc(fmtTime.format(next.d)) + '</span></button>';
    }
    h += '</div>';
    h += '<div class="nw-grid" style="grid-template-columns:repeat(' + Math.max(1, shownDays.length) + ',minmax(0,1fr))">';
    for (const d of shownDays) {
      const k = dayKey(d), list = evs.filter(e => dayKey(e.d) === k);
      const st = k === todayK ? " today" : k < todayK ? " past" : "";
      h += '<section class="nw-day' + st + '"><div class="nw-dh"><b>' + esc(cap(new Intl.DateTimeFormat("pt-PT", { timeZone: TZ, weekday: "long" }).format(d)).replace("-feira", "")) + '</b><span>' + esc(fmtShort.format(d)) + (k === todayK ? " · hoje" : "") + '</span></div>';
      if (!list.length) h += '<div class="nw-none">Sem notícias fortes</div>';
      for (const e of list) {
        const x = explain(e), done = e.d.getTime() < now;
        h += '<button type="button" class="nw-ev' + (done ? " done" : "") + '" data-nw="' + evs.indexOf(e) + '"><span class="t"><span class="c">' + esc(e.country) + '</span>' + esc(fmtTime.format(e.d)) + '</span><span class="n">' + esc(x.name) + '</span><span class="o">' + esc(e.title) + '</span></button>';
      }
      h += '</section>';
    }
    h += '</div><p class="nw-tip">Toca numa notícia para veres a explicação.</p></div>';
    mountEl.innerHTML = h;
  }
  // mobile: drop the inline column count so the grid stacks
  const mq = window.matchMedia("(max-width: 860px)");
  function fixGrid() { const g = mountEl && mountEl.querySelector(".nw-grid"); if (g && mq.matches) g.style.gridTemplateColumns = ""; }

  // ---------- dialog ----------
  let dlg = null;
  function ensureDlg() {
    if (dlg) return dlg;
    dlg = document.createElement("div");
    dlg.className = "dlg nw-dlg"; dlg.hidden = true;
    dlg.innerHTML = '<div class="dlg-card" role="dialog" aria-modal="true" aria-labelledby="nwT"><div><div class="sub" id="nwS"></div><h3 id="nwT"></h3></div>' +
      '<div class="nw-meta"><div><small>Quando</small><b id="nwW"></b></div><div><small>Previsto</small><b id="nwF"></b></div><div><small>Anterior</small><b id="nwP"></b></div></div>' +
      '<div class="nw-sec"><h4>O que é</h4><p id="nwA"></p></div><div class="nw-sec"><h4>Porque é importante</h4><p id="nwB"></p></div><div class="nw-sec"><h4>Como mexe no mercado</h4><p id="nwC"></p></div>' +
      '<div class="nw-warn">Nos minutos antes e depois desta notícia o preço pode dar saltos grandes. Muitas traders preferem não abrir operações nessa altura.</div>' +
      '<div class="dlg-actions"><button type="button" class="btn primary" id="nwX">Percebi</button></div></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener("click", e => { if (e.target === dlg || e.target.id === "nwX") close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && dlg && !dlg.hidden) close(); });
    return dlg;
  }
  let lastFocus = null;
  function open(i) {
    const e = byId[i]; if (!e) return; ensureDlg();
    const x = explain(e), b = bank(e.country);
    dlg.querySelector("#nwS").textContent = e.country + " · " + b[1];
    dlg.querySelector("#nwT").textContent = x.name;
    dlg.querySelector("#nwW").textContent = cap(fmtShort.format(e.d)) + ", " + fmtTime.format(e.d);
    dlg.querySelector("#nwF").textContent = e.forecast || "—";
    dlg.querySelector("#nwP").textContent = e.previous || "—";
    dlg.querySelector("#nwA").textContent = x.what + (x.name !== e.title ? " (No Forex Factory aparece como \"" + e.title + "\".)" : "");
    dlg.querySelector("#nwB").textContent = x.why;
    dlg.querySelector("#nwC").textContent = x.move;
    lastFocus = document.activeElement;
    dlg.hidden = false; setTimeout(() => dlg.querySelector("#nwX").focus(), 30);
  }
  function close() { dlg.hidden = true; if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); }

  window.Noticias = {
    mount(el) {
      injectCss(); mountEl = el;
      el.addEventListener("click", e => { const b = e.target.closest("[data-nw]"); if (b) open(+b.dataset.nw); });
      draw(); fixGrid();
      if (!data || (data.updated && Date.now() - data.updated > 30 * 60000)) load().then(fixGrid);
      clearInterval(timer); timer = setInterval(() => { if (mountEl && document.contains(mountEl)) { draw(); fixGrid(); } else clearInterval(timer); }, 60000);
    }
  };
  mq.addEventListener ? mq.addEventListener("change", () => { draw(); fixGrid(); }) : null;
})();
