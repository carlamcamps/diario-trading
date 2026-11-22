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

  // O que acontece se o número sair acima / abaixo do previsto: na economia americana e no mundo.
  // inv = aqui um número mais alto é MAU sinal (desemprego). tone = não há número, conta o "tom" (discursos, atas).
  const TONE = { hiL: "Se o tom for duro (preocupados com preços altos)", loL: "Se o tom for suave (a pensar em baixar juros)",
    up: "EUA: os juros podem ficar altos durante mais tempo. Empréstimos e casas continuam caros, a bolsa costuma cair e o dólar sobe. Mundo: o dinheiro corre para os EUA, por isso o euro, a libra e o ouro costumam descer, e os países que devem dinheiro em dólares sofrem.",
    down: "EUA: os juros podem descer mais cedo. O crédito fica mais barato, a bolsa costuma subir e o dólar desce. Mundo: o euro, a libra e o ouro costumam ganhar força, e é um alívio para os países que devem dinheiro em dólares." };
  const FX = {
    rate: { hiL: "Se os juros ficarem acima do previsto", loL: "Se os juros ficarem abaixo do previsto",
      up: "EUA: pedir dinheiro emprestado fica mais caro (casas, carros, empresas). A economia abranda, a bolsa costuma cair e o dólar sobe com força. Mundo: o dinheiro sai de outros países para ir render nos EUA; as outras moedas e o ouro descem.",
      down: "EUA: o dinheiro fica mais barato, as empresas investem mais e a bolsa costuma subir. O dólar desce. Mundo: as outras moedas e o ouro sobem; é bom para os países com dívidas em dólares." },
    infl: { up: "EUA: as coisas estão a ficar caras mais depressa do que se esperava. A Fed pode manter ou subir os juros, por isso o dólar costuma subir e a bolsa e o ouro costumam cair. Mundo: juros americanos altos puxam o dinheiro para os EUA; o euro e as outras moedas enfraquecem.",
      down: "EUA: a inflação está a acalmar. A Fed pode baixar os juros mais cedo, por isso o dólar costuma descer e a bolsa costuma subir. Mundo: o euro, as outras moedas e o ouro ganham força; é um alívio para a economia mundial." },
    jobs: { up: "EUA: as empresas estão a contratar, a economia está forte. A Fed não tem pressa em baixar juros, por isso o dólar costuma subir. Mundo: uma América forte compra mais ao resto do mundo, mas o dólar forte faz descer o euro e o ouro.",
      down: "EUA: a economia está a abrandar e há menos contratações. Aumentam as hipóteses de a Fed baixar juros, por isso o dólar costuma descer. Mundo: há medo de um abrandamento global; o ouro e o euro costumam subir." },
    claims: { inv: true, hiL: "Se houver MAIS pedidos do que o previsto (mau sinal)", loL: "Se houver MENOS pedidos do que o previsto (bom sinal)",
      up: "EUA: há mais pessoas a perder o emprego, a economia pode estar a arrefecer. A Fed pode baixar juros, por isso o dólar costuma descer. Mundo: o ouro e o euro costumam subir.",
      down: "EUA: quase ninguém está a ser despedido, o mercado de trabalho continua forte. O dólar costuma subir. Mundo: o euro e o ouro costumam descer." },
    unemp: { inv: true, hiL: "Se o desemprego sair ACIMA do previsto (mau sinal)", loL: "Se o desemprego sair ABAIXO do previsto (bom sinal)",
      up: "EUA: mais gente sem trabalho significa menos dinheiro para gastar e uma economia mais fraca. A Fed pode baixar juros, por isso o dólar costuma descer. Mundo: medo de abrandamento; o ouro sobe.",
      down: "EUA: quase toda a gente que quer trabalhar tem emprego, a economia está saudável. O dólar costuma subir. Mundo: o euro e o ouro costumam descer." },
    wage: { up: "EUA: os salários sobem depressa, e isso pode fazer os preços subir também. A Fed fica atenta e o dólar costuma subir. Mundo: juros altos nos EUA durante mais tempo fazem descer as outras moedas.",
      down: "EUA: os salários sobem devagar, por isso há menos pressão nos preços. A Fed pode baixar juros e o dólar costuma descer. Mundo: as outras moedas e o ouro ganham força." },
    shop: { up: "EUA: as pessoas estão a gastar mais (o consumo é cerca de 2/3 da economia americana), a economia está forte e o dólar costuma subir. Mundo: os EUA compram mais ao resto do mundo, o que é bom para os países que exportam para lá.",
      down: "EUA: as pessoas estão a apertar o cinto, a economia pode abrandar e o dólar costuma descer. Mundo: menos encomendas para os países que vendem aos EUA; o ouro costuma subir." },
    gdp: { up: "EUA: a economia cresceu mais do que se esperava. O dólar sobe e a bolsa costuma gostar. Mundo: os EUA são a maior economia do mundo, e quando crescem puxam pelos outros países.",
      down: "EUA: a economia cresceu menos (ou encolheu), há risco de recessão. O dólar costuma descer e o ouro subir. Mundo: menos procura americana, o que é mau para os países que exportam para os EUA." },
    pmi: { up: "EUA: as empresas estão otimistas e com mais encomendas (acima de 50 = a crescer). O dólar costuma subir. Mundo: fábricas americanas ativas compram mais matérias-primas ao resto do mundo.",
      down: "EUA: as empresas estão a abrandar (abaixo de 50 = a encolher). O dólar costuma descer. Mundo: é sinal de que a economia mundial pode estar a arrefecer." },
    mood: { up: "EUA: as pessoas sentem-se confiantes e vão gastar mais, por isso o dólar tende a subir. Mundo: um consumidor americano confiante ajuda as empresas de todo o mundo.",
      down: "EUA: as pessoas estão com medo e vão poupar mais, por isso o dólar tende a descer. Mundo: menos compras dos americanos, o que é mau para quem lhes vende." },
    trade: { up: "EUA: venderam mais (ou compraram menos) ao estrangeiro do que se esperava. É ligeiramente bom para o dólar. Mundo: os outros países venderam menos aos EUA.",
      down: "EUA: compraram mais ao estrangeiro do que venderam. É ligeiramente mau para o dólar. Mundo: os países que exportam para os EUA venderam mais." },
    gen: { up: "EUA: normalmente um número acima do previsto mostra uma economia mais forte, e o dólar tende a subir. Mundo: o euro e o ouro tendem a descer.",
      down: "EUA: normalmente um número abaixo do previsto mostra uma economia mais fraca, e o dólar tende a descer. Mundo: o euro e o ouro tendem a subir." }
  };
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
  function fxFor(t) {
    if (/holiday|election|vote|referendum|daylight/i.test(t)) return null;
    if (/minutes|statement|press conference|speaks|testif|speech|monetary policy|projections/i.test(t)) return TONE;
    if (/federal funds rate|rate decision|interest rate|policy rate/i.test(t)) return FX.rate;
    if (/claims/i.test(t)) return FX.claims;
    if (/unemployment rate/i.test(t)) return FX.unemp;
    if (/pce|cpi|ppi|inflation|price/i.test(t)) return FX.infl;
    if (/non-farm|nonfarm|employment change|adp|jolts|job openings|payroll/i.test(t)) return FX.jobs;
    if (/earnings|wage|employment cost/i.test(t)) return FX.wage;
    if (/retail sales/i.test(t)) return FX.shop;
    if (/gdp/i.test(t)) return FX.gdp;
    if (/pmi|ism/i.test(t)) return FX.pmi;
    if (/sentiment|confidence/i.test(t)) return FX.mood;
    if (/trade balance/i.test(t)) return FX.trade;
    return FX.gen;
  }
  function explain(ev) {
    const g = G.find(x => x.re.test(ev.title)), fx = fxFor(ev.title || "");
    if (g) return { name: g.name, what: g.what(ev.country), why: g.why(ev.country), move: g.move(ev.country), fx };
    return {
      name: ev.title,
      what: "É uma notícia económica de " + bank(ev.country)[1] + " que o Forex Factory marca como de alto impacto.",
      why: "As notícias vermelhas são as que mais costumam mexer o mercado.",
      move: "Se o número sair muito diferente do previsto, " + bank(ev.country)[2] + " pode mexer bastante.", fx
    };
  }
  // "0.3%", "245K", "-1.2B", "52.1" → number (K/M/B/T scaled) or null
  function num(s) {
    if (s == null) return null;
    const m = String(s).replace(/−/g, "-").replace(/,/g, "").match(/^\s*([<>]?)\s*(-?\d+(?:\.\d+)?)\s*([KMBT%])?/i);
    if (!m) return null;
    const k = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[(m[3] || "").toUpperCase()] || 1;
    return parseFloat(m[2]) * k;
  }
  // compares the result with the forecast (or with the previous value when there is no forecast)
  function verdict(e) {
    const a = num(e.actual); if (a == null) return null;
    let ref = num(e.forecast), vs = "previsto";
    if (ref == null) { ref = num(e.previous); vs = "anterior"; }
    if (ref == null) return null;
    const d = a - ref, eps = Math.max(Math.abs(ref), 1) * 1e-9;
    return { dir: d > eps ? "up" : d < -eps ? "down" : "eq", vs, ref: vs === "previsto" ? e.forecast : e.previous };
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
  // small American flag on the holiday days of the calendar
  const US_FLAG = '<svg class="nw-flag" viewBox="0 0 19 13" aria-hidden="true"><rect width="19" height="13" fill="#B22234"/><path d="M0 1.5h19M0 3.5h19M0 5.5h19M0 7.5h19M0 9.5h19M0 11.5h19" stroke="#fff" stroke-width="1"/><rect width="8" height="7" fill="#3C3B6E"/><g fill="#fff"><circle cx="1.6" cy="1.4" r=".45"/><circle cx="4" cy="1.4" r=".45"/><circle cx="6.4" cy="1.4" r=".45"/><circle cx="2.8" cy="3.5" r=".45"/><circle cx="5.2" cy="3.5" r=".45"/><circle cx="1.6" cy="5.6" r=".45"/><circle cx="4" cy="5.6" r=".45"/><circle cx="6.4" cy="5.6" r=".45"/></g></svg>';
  // a colour for each kind of news (the edge of its card), a small clock for the times
  const KIND_COL = { infl: "#E07A16", jobs: "#D02C3A", bank: "#7A4CC0", talk: "#3F78C2", shop: "#2F8F8A", gdp: "#3C7859", pmi: "#9C7330", mood: "#C25E9A", hol: "#8A8284", vote: "#5C6B7A", other: "#9C8B90" };
  const kc = k => ' style="--kc:' + (KIND_COL[k] || "#9C8B90") + '"';
  const CLOCK = '<svg class="nw-clk" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.3"/><path d="M8 4.6V8l2.3 1.5"/></svg>';
  const QCHIP_IC = { NFP: "jobs", CPI: "infl", FOMC: "bank", PCE: "infl", PPI: "infl", GDP: "gdp", Powell: "talk" };
  // countdown that flips like an airport board: days · hours · minutes · seconds
  function flipHtml(d) {
    const ms = Math.max(0, d - Date.now()), s = Math.floor(ms / 1000), parts = [[Math.floor(s / 86400), "dias"], [Math.floor(s / 3600) % 24, "horas"], [Math.floor(s / 60) % 60, "min"], [s % 60, "seg"]];
    return '<span class="flipc" data-t="' + d.getTime() + '">' + parts.map(([v, l]) => '<span class="fg"><span class="fd">' + String(v).padStart(2, "0").split("").map(c => '<i>' + c + '</i>').join("") + '</span><small>' + l + '</small></span>').join("") + '</span>';
  }
  setInterval(() => {
    document.querySelectorAll(".flipc").forEach(fc => {
      const t = +fc.dataset.t, ms = Math.max(0, t - Date.now()), s = Math.floor(ms / 1000), vals = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
      fc.querySelectorAll(".fd").forEach((fd, gi) => { const txt = String(vals[gi]).padStart(2, "0"); fd.querySelectorAll("i").forEach((el, k) => { if (el.textContent !== txt[k]) { el.textContent = txt[k]; el.classList.remove("flp"); void el.offsetWidth; el.classList.add("flp"); } }); });
      const first = fc.closest(".nw-first"); if (first) first.classList.toggle("soon", ms > 0 && ms < 30 * 60000);
    });
  }, 1000);
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
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loading = true;
    loadP = (async () => {
      try {
        const r = await fetch("noticias-arquivo.json?t=" + Date.now(), { cache: "no-store" });
        if (!r.ok) throw new Error("http " + r.status);
        const list = await r.json();
        all = (Array.isArray(list) ? list : []).map(e => ({ ...e, d: new Date(e.date) })).filter(e => !isNaN(e.d)).sort((a, b) => a.d - b.d);
        all.forEach((e, i) => { e.i = i; e.k = kind(e); e.day = dayKey(e.d); });
        err = null;
      } catch (e) { err = e; loadP = null; }
      loading = false; draw();
    })();
    return loadP;
  }

  // ---------- American holidays: which one it is and what it means ----------
  const nthDow = (y, m, dow, n) => { const d = new Date(Date.UTC(y, m, 1)); const off = (dow - d.getUTCDay() + 7) % 7; return 1 + off + (n - 1) * 7; };
  const lastDow = (y, m, dow) => { const d = new Date(Date.UTC(y, m + 1, 0)); return d.getUTCDate() - ((d.getUTCDay() - dow + 7) % 7); };
  function easter(y) { const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451), mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1; return [mo - 1, da]; }
  const HOL_MKT_CLOSED = "A bolsa americana e os bancos estão fechados. Há muito menos gente a negociar, por isso o dólar costuma mexer pouco, mas às vezes dá saltos estranhos por falta de liquidez. Não há notícias económicas americanas neste dia.";
  function usHolidays(y) {
    const H = [
      [0, 1, "New Year's Day", "Dia de Ano Novo", "O primeiro dia do ano. É feriado em quase todo o mundo.", "Os mercados de quase todo o mundo estão fechados ou muito parados. É um dos dias mais calmos do ano."],
      [0, nthDow(y, 0, 1, 3), "Martin Luther King Jr. Day", "Dia de Martin Luther King Jr.", "Homenageia Martin Luther King, o líder que lutou pelos direitos das pessoas negras nos EUA. É sempre na 3.ª segunda-feira de janeiro.", HOL_MKT_CLOSED],
      [1, nthDow(y, 1, 1, 3), "Presidents' Day", "Dia dos Presidentes", "Homenageia os presidentes americanos, sobretudo George Washington (nasceu em fevereiro). É na 3.ª segunda-feira de fevereiro.", HOL_MKT_CLOSED],
      (function () { const [m, d] = easter(y), g = new Date(Date.UTC(y, m, d - 2)); return [g.getUTCMonth(), g.getUTCDate(), "Good Friday", "Sexta-feira Santa", "A sexta-feira antes da Páscoa. Nos EUA não é feriado oficial, mas a bolsa fecha.", "A bolsa americana fecha, mas às vezes saem notícias (como os empregos). Com pouca gente a negociar, os movimentos podem ser exagerados."]; })(),
      [4, lastDow(y, 4, 1), "Memorial Day", "Dia da Memória", "Homenageia os militares americanos que morreram em guerra. É na última segunda-feira de maio e marca o início do verão nos EUA.", HOL_MKT_CLOSED],
      [5, 19, "Juneteenth", "Juneteenth (Dia da Libertação)", "Celebra o fim da escravatura nos EUA (19 de junho de 1865).", HOL_MKT_CLOSED],
      [6, 4, "Independence Day", "Dia da Independência", "O dia mais importante dos EUA: celebra a independência em 1776. Há fogo de artifício e festas em todo o país.", HOL_MKT_CLOSED + " No dia antes, a bolsa costuma fechar mais cedo."],
      [8, nthDow(y, 8, 1, 1), "Labor Day", "Dia do Trabalhador", "O dia do trabalhador americano (lá não é a 1 de maio). É na 1.ª segunda-feira de setembro e marca o fim do verão.", HOL_MKT_CLOSED],
      [9, nthDow(y, 9, 1, 2), "Columbus Day", "Dia de Colombo / Dia dos Povos Indígenas", "Lembra a chegada de Cristóvão Colombo à América e, cada vez mais, os povos indígenas. É na 2.ª segunda-feira de outubro.", "Os bancos e a Fed estão fechados, mas a bolsa abre. O mercado costuma estar mais calmo."],
      [10, 11, "Veterans Day", "Dia dos Veteranos", "Homenageia todos os militares que serviram nas forças armadas americanas.", "Os bancos e o mercado das obrigações estão fechados, mas a bolsa abre. O dólar costuma mexer pouco."],
      [10, nthDow(y, 10, 4, 4), "Thanksgiving Day", "Dia de Ação de Graças", "As famílias juntam-se para um grande jantar (com peru) e agradecer o ano. É na 4.ª quinta-feira de novembro e é dos feriados mais importantes dos EUA.", HOL_MKT_CLOSED + " No dia seguinte (Black Friday) a bolsa fecha mais cedo e o mercado continua muito parado."],
      [11, 25, "Christmas Day", "Natal", "O dia de Natal.", "Os mercados de quase todo o mundo estão fechados. A semana entre o Natal e o Ano Novo costuma ser muito calma."]
    ];
    const out = {};
    for (const h of H) {
      const d = new Date(Date.UTC(y, h[0], h[1])), wd = d.getUTCDay();
      // when it falls on a weekend, the day off moves to Friday / Monday
      const obs = wd === 6 ? new Date(Date.UTC(y, h[0], h[1] - 1)) : wd === 0 ? new Date(Date.UTC(y, h[0], h[1] + 1)) : d;
      const k = obs.toISOString().slice(0, 10);
      out[k] = { en: h[2], pt: h[3], what: h[4], mkt: h[5], moved: obs !== d };
    }
    return out;
  }
  const HCACHE = {};
  function holidayOf(dayK) { const y = +dayK.slice(0, 4); if (!HCACHE[y]) HCACHE[y] = Object.assign({}, usHolidays(y - 1), usHolidays(y), usHolidays(y + 1)); return HCACHE[y][dayK] || null; }
  // other "pay attention" days that are not numbers
  function specialOf(e) {
    if (/daylight saving/i.test(e.title)) return { en: e.title, pt: "Mudança da hora nos EUA", what: "Os EUA mudam a hora (horário de verão / inverno). Durante umas semanas a diferença para Portugal muda, por isso as notícias e a abertura de Nova Iorque saem a horas diferentes do costume.", mkt: "Não mexe o mercado, mas atenção às horas: confirma a que horas abre Nova Iorque nesses dias." };
    if (/election|vote|referendum/i.test(e.title)) return { en: e.title, pt: "Eleições nos EUA", what: "Há eleições nos Estados Unidos. Podem mudar quem manda no governo ou no Congresso, e com isso as regras de impostos, gastos e comércio.", mkt: "Resultados inesperados podem mexer muito o dólar e a bolsa, às vezes durante vários dias. Na noite das eleições o mercado pode estar muito nervoso." };
    return null;
  }
  function holidayInfo(e) {
    if (e.impact === "Holiday" || /holiday/i.test(e.title)) {
      const h = holidayOf(e.day);
      return h || { en: e.title, pt: "Feriado nos EUA", what: "É feriado nos Estados Unidos. Os bancos estão fechados.", mkt: HOL_MKT_CLOSED };
    }
    return specialOf(e);
  }
  // only the American (USD) news
  const visible = () => (all || []).filter(e => e.country === "USD");
  void cur; void LS_CUR;

  // ---------- styles ----------
  const css = `
.nw { padding-block: 22px 70px; display: flex; flex-direction: column; gap: 18px; max-width: 1000px; margin: 0 auto; }
.nw .flag { width: 20px; height: 14px; border-radius: 3px; object-fit: cover; box-shadow: 0 0 0 1px rgba(0,0,0,.25); display: inline-block; vertical-align: -2px; }
.nw .flag.nf { background: #2A0711; color: #EFDCC6; font-size: 9px; text-align: center; line-height: 14px; }
.nw-hero { position: relative; border-radius: 24px; padding: 22px 24px 20px; background: linear-gradient(135deg, rgba(92, 26, 44, .92), rgba(52, 12, 22, .92)); border: 1px solid rgba(236,170,188,.2); overflow: hidden; box-shadow: 0 24px 50px -24px rgba(0,0,0,.8); }
.nw-hero::after { content: ""; position: absolute; inset: 8px; border: 1px solid rgba(205,167,94,.45); border-radius: 18px; pointer-events: none; }
.nw-hero .bg { position: absolute; right: -40px; top: -50px; width: 260px; height: 260px; color: rgba(205,167,94,.10); }
.nw-hero .k { font-family: var(--display); font-size: clamp(34px, 5vw, 48px); color: var(--champ); line-height: 1.05; position: relative; display: flex; align-items: center; gap: 12px; }
.nw-hero .k .globe { width: .9em; height: .9em; color: var(--gold); flex: 0 0 auto; }
.nw-hero h2 { position: relative; margin: 6px 0 0; font-family: var(--script); font-weight: 400; font-size: clamp(22px, 3vw, 28px); color: var(--gold); line-height: 1.1; }
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
.nw-flag { display: block; width: 22px; height: 15px; border-radius: 2.5px; box-shadow: 0 1px 3px rgba(0,0,0,.35); }
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
.nw-ev .nums .act { background: rgba(58,16,24,.12); }
.nw-ev .res { margin-top: 10px; border-radius: 12px; padding: 10px 12px; background: rgba(58,16,24,.06); border-left: 4px solid #8C6168; }
.nw-ev .res.good { background: rgba(60,120,89,.12); border-left-color: #3C7859; }
.nw-ev .res.bad { background: rgba(176,63,85,.10); border-left-color: #B03F55; }
.nw-ev .res .rh { font-weight: 600; font-size: 13.5px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.nw-ev .res .usd { margin-left: auto; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; background: rgba(58,16,24,.08); }
.nw-ev .res.good .arr { color: #3C7859; } .nw-ev .res.bad .arr { color: #B03F55; }
.nw-ev .res p { margin: 5px 0 0; font-size: 13.5px; line-height: 1.55; }
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
    const next = evs.filter(e => e.d.getTime() > now - 10 * 60000 && e.impact !== "Holiday").slice(0, 8);
    let h = '<div class="nw">';
    // hero with the next strong news as cards (names as on Forex Factory)
    h += '<section class="nw-hero"><svg class="bg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width=".6">' + IC.talk + '</svg>' +
      '<div class="k"><svg class="globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4M12 2.8c2.6 2.6 3.9 5.7 3.9 9.2s-1.3 6.6-3.9 9.2c-2.6-2.6-3.9-5.7-3.9-9.2S9.4 5.4 12 2.8z"/><path d="M4.4 7.2h15.2M4.4 16.8h15.2"/></svg>Notícias</div><h2>O que vem aí</h2><p>As notícias de alto impacto dos Estados Unidos, com os nomes do Forex Factory e em horas de Portugal. Toca numa para veres a explicação e o resultado.</p>';
    if (next.length) {
      const e0 = next[0];
      // the next one, big and highlighted; then the ones after it
      const soon = e0.d - now > 0 && e0.d - now < 30 * 60000;
      h += '<button type="button" class="nw-first' + (soon ? " soon" : "") + '" data-ev="' + e0.i + '"' + kc(e0.k) + '><span class="nf-tag">✦ A próxima</span><span class="nf-row"><span class="bubble">' + icon(e0.k) + '</span><span class="nf-t"><b>' + esc(e0.title) + '</b><small>' + esc(explain(e0).name || "") + '</small></span></span><span class="nf-when">' + (e0.d - now > 0 ? flipHtml(e0.d) : '<b>' + esc(until(e0.d)) + '</b>') + '<small>' + CLOCK + esc(cap(fmtShort.format(e0.d))) + ', ' + esc(timeOf(e0)) + '</small></span></button>';
      if (next.length > 1) h += '<div class="nf-after">Depois</div><div class="nw-next">' + next.slice(1).map(e => '<button type="button" class="nw-card" data-ev="' + e.i + '"' + kc(e.k) + '><span class="top"><span class="bubble">' + icon(e.k) + '</span><span class="when">' + esc(until(e.d)) + '</span></span><b>' + esc(e.title) + '</b><small>' + CLOCK + esc(cap(fmtShort.format(e.d))) + ', ' + esc(timeOf(e)) + '</small></button>').join("") + '</div>';
    } else h += '<p style="margin-top:12px">Não há notícias fortes marcadas para os próximos dias.</p>';
    h += '</section>';
    const heroH = h.slice('<div class="nw">'.length); h = '<div class="nw">';
    // search every strong news since 2024 (shown under the calendar)
    let srchH = '<section class="nw-srch"><div class="nw-sh"><b>Procurar notícias</b><small>todos os dias desde 2024</small></div><input id="nwQ" type="search" enterkeyhint="search" placeholder="Ex.: NFP, CPI, FOMC, Powell…" value="' + esc(q) + '" autocomplete="off" aria-label="Procurar notícias">' +
      '<div class="nw-qchips">' + ["NFP", "CPI", "FOMC", "PCE", "PPI", "GDP", "Powell", "Feriados"].map(c => '<button type="button" data-q="' + c + '"' + (q.toLowerCase() === c.toLowerCase() ? ' class="on"' : '') + '>' + (QCHIP_IC[c] ? icon(QCHIP_IC[c]) : c === "Feriados" ? US_FLAG : "") + c + '</button>').join("") + '</div><div id="nwSR"></div></section>';
    // month bar (the calendar comes first)
    h += '<div class="nw-bar"><div class="nw-mnav"><button type="button" data-mv="-1" aria-label="Mês anterior">‹</button><span>' + cap(MONTHS[vm]) + ' ' + vy + '</span><button type="button" data-mv="1" aria-label="Mês seguinte">›</button></div></div>';
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
      if (hol) h += '<span class="ics">' + US_FLAG + '</span>';
      else if (kinds.length) h += '<span class="ics">' + kinds.slice(0, 3).map(kk => '<span class="chip" title="' + KIND_NAME[kk] + '">' + icon(kk) + '</span>').join("") + (kinds.length > 3 ? '<span class="more">+' + (kinds.length - 3) + '</span>' : '') + '</span>';
      if (list.length) { const hi = hol ? holidayInfo(list[0]) : null; h += '<span class="lbl">' + esc(hol ? (hi ? hi.en : "Holiday") : strong[0].title) + '</span>'; }
      h += '</button>';
    }
    h += '</div><div class="nw-legend">' + ["infl", "jobs", "bank", "talk", "shop", "gdp", "pmi"].map(kk => '<span><span class="chip">' + icon(kk) + '</span>' + KIND_NAME[kk] + '</span>').join("") + '<span>' + US_FLAG + 'Feriado</span></div></section>';
    h = '<div class="nw">' + heroH + h.slice('<div class="nw">'.length) + srchH + '</div>';
    root.innerHTML = h;
    drawSearch();
  }
  // ---------- search ----------
  let q = "";
  function qMatch(qq) {
    const t = String(qq || "").trim(); if (!t) return null;
    const A = [[/^nfp$|payroll|^empregos?$/i, e => /^(?!.*\bADP\b).*non-farm/i.test(e.title)], [/^cpi$|infla/i, e => /\bCPI\b/.test(e.title)], [/^fomc$|^juros$|^fed$/i, e => /federal funds rate|fomc statement|fomc press/i.test(e.title)],
      [/^pce$/i, e => /\bPCE\b/.test(e.title)], [/^ppi$/i, e => /\bPPI\b/.test(e.title)], [/^(gdp|pib)$/i, e => /\bGDP\b/.test(e.title)], [/powell|warsh/i, e => /powell|warsh|fed chair/i.test(e.title)],
      [/^claims$|subs[ií]dio/i, e => /unemployment claims/i.test(e.title)], [/^(feriados?|holidays?)$/i, e => e.impact === "Holiday"]];
    for (const [re, f] of A) if (re.test(t)) return f;
    const lo = t.toLowerCase();
    return e => e.title.toLowerCase().includes(lo) || (e.impact !== "Holiday" && String(explain(e).name || "").toLowerCase().includes(lo));
  }
  function drawSearch() {
    const box = root && root.querySelector("#nwSR"); if (!box || !all) return;
    root.querySelectorAll("[data-q]").forEach(b => b.classList.toggle("on", b.dataset.q.toLowerCase() === q.trim().toLowerCase()));
    const f = qMatch(q); if (!f) { box.innerHTML = ""; return; }
    const hits = all.filter(e => e.country === "USD" && f(e));
    if (!hits.length) { box.innerHTML = '<div class="nw-empty">Nada encontrado. Experimenta NFP, CPI, FOMC ou o nome em inglês.</div>'; return; }
    const byDay = new Map(); for (const e of hits) { if (!byDay.has(e.day)) byDay.set(e.day, []); byDay.get(e.day).push(e); }
    const days = [...byDay.keys()].sort().reverse(), todayK = dayKey(new Date()), H = window.DiarioHook;
    let h = '<div class="nw-sc">' + days.length + (days.length === 1 ? ' dia' : ' dias') + (days.length > 300 ? ' (a mostrar os 300 mais recentes)' : '') + '</div>', yr = "";
    for (const k of days.slice(0, 300)) {
      const list = byDay.get(k), e0 = list[0], y = k.slice(0, 4), R = H ? H.result(k) : null;
      if (y !== yr) { yr = y; h += '<div class="nw-sy">' + y + '</div>'; }
      const nums = e0.actual ? esc(e0.actual) + (e0.forecast ? ' <span>prev. ' + esc(e0.forecast) + '</span>' : '') : (k > todayK ? '<span>por vir</span>' : '');
      h += '<div class="nw-sr"><button type="button" class="nw-srd" data-day="' + k + '"><b>' + esc(cap(fmtShort.format(e0.d))) + '</b><small>' + esc(timeOf(e0)) + ' · ' + esc(list.map(x => x.title).slice(0, 2).join(", ")) + (list.length > 2 ? "…" : "") + '</small>' + (nums ? '<em>' + nums + '</em>' : '') + '</button>' +
        '<span class="nw-res ' + (R ? R.cls : "none") + '">' + (R ? esc(R.txt) : "—") + '</span>' + (H ? '<button type="button" class="nw-go" data-godiario="' + k + '">Diário ›</button>' : '') + '</div>';
    }
    box.innerHTML = h;
  }

  // ---------- day panel ----------
  let sheet = null, lastFocus = null;
  function ensureSheet() {
    if (sheet) return sheet;
    sheet = document.createElement("div"); sheet.className = "nw-sheet"; sheet.setAttribute("aria-hidden", "true");
    sheet.innerHTML = '<div class="scrim"></div><div class="panel" role="dialog" aria-modal="true" aria-labelledby="nwPT"><i class="nw-grab" aria-hidden="true"></i><div class="nw-ph"><div><div class="k" id="nwPK">Notícias do dia</div><h3 id="nwPT"></h3></div><button type="button" class="nw-x" aria-label="Fechar">✕</button></div><div class="nw-list" id="nwPL"></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener("click", e => {
      if (e.target.classList.contains("scrim") || e.target.closest(".nw-x")) { closeSheet(); return; }
      const g = e.target.closest("[data-godiario]"); if (g) { const k = g.dataset.godiario; closeSheet(); if (window.DiarioHook) window.DiarioHook.goDay(k); return; }
      const b = e.target.closest("button.more");
      if (b) { const x = b.nextElementSibling, open = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(open)); x.classList.toggle("open", open); }
    });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && sheet.classList.contains("open")) closeSheet(); });
    return sheet;
  }
  function evHtml(e, openIt, n) {
    const hi = holidayInfo(e);
    if (hi) {
      // holidays, clock change, elections: say what the day is and what it does to the market
      const hol = e.impact === "Holiday" || /holiday/i.test(e.title);
      return '<article class="nw-ev' + (hol ? " hol" : "") + '" style="animation-delay:' + (n * 60) + 'ms;--kc:' + (KIND_COL[e.k] || "#9C8B90") + '"><div class="row"><span class="bubble">' + icon(e.k) + '</span><div><div class="meta">' + CLOCK + '<b>' + esc(timeOf(e)) + '</b> · ' + esc(hol ? "Feriado nos EUA" : KIND_NAME[e.k]) + '</div><h4>' + esc(hi.en) + '</h4><div class="orig">' + esc(hi.pt) + (hi.moved ? " (calha ao fim de semana, por isso a folga passa para este dia)" : "") + '</div></div></div>' +
        '<div class="exp open"><div><h5>O que é</h5><p>' + esc(hi.what) + '</p><h5>O que acontece no mercado</h5><p>' + esc(hi.mkt) + '</p></div></div></article>';
    }
    const x = explain(e), hol = e.impact === "Holiday", fx = x.fx, v = hol ? null : verdict(e);
    const hasNums = !hol && (e.actual || e.forecast || e.previous);
    let h = '<article class="nw-ev' + (hol ? " hol" : "") + '" style="animation-delay:' + (n * 60) + 'ms;--kc:' + (KIND_COL[e.k] || "#9C8B90") + '">' + (e.actual ? '<span class="saiu" aria-hidden="true">Saiu</span>' : '') + '<div class="row"><span class="bubble">' + icon(e.k) + '</span><div><div class="meta">' + CLOCK + '<b>' + esc(timeOf(e)) + '</b> · ' + esc(KIND_NAME[e.k]) + '</div><h4>' + esc(e.title) + '</h4><div class="orig">' + esc(hol ? "Feriado nos Estados Unidos" : x.name) + '</div></div></div>';
    if (hasNums) h += '<div class="nums"><div class="act"><small>Resultado</small><b>' + esc(e.actual || "—") + '</b></div><div><small>Previsto</small><b>' + esc(e.forecast || "—") + '</b></div><div><small>Anterior</small><b>' + esc(e.previous || "—") + '</b></div></div>';
    // what the result means
    if (v && fx) {
      const good = v.dir === "eq" ? null : ((v.dir === "up") !== !!fx.inv);
      const word = v.dir === "up" ? "acima do " + v.vs : v.dir === "down" ? "abaixo do " + v.vs : "igual ao " + v.vs;
      h += '<div class="res ' + (v.dir === "eq" ? "eq" : good ? "good" : "bad") + '"><div class="rh"><span class="arr">' + (v.dir === "up" ? "▲" : v.dir === "down" ? "▼" : "=") + '</span>Saiu ' + esc(word) + ' (' + esc(e.actual) + ' vs ' + esc(v.ref) + ')' + (good == null ? '' : '<span class="usd">' + (good ? "dólar tende a subir" : "dólar tende a descer") + '</span>') + '</div>' +
        '<p>' + esc(v.dir === "up" ? fx.up : v.dir === "down" ? fx.down : "Saiu exatamente como se esperava, por isso o mercado costuma mexer pouco. O que importa a seguir são os detalhes e os próximos números.") + '</p></div>';
    } else if (!hol && fx && e.d.getTime() > Date.now()) {
      h += '<div class="res wait"><div class="rh">Ainda não saiu</div><p>Quando sair, aparece aqui o resultado e o que ele quer dizer.</p></div>';
    }
    h += '<button type="button" class="more" aria-expanded="' + (openIt ? "true" : "false") + '">O que é isto? <span>⌄</span></button><div class="exp' + (openIt ? " open" : "") + '"><div><h5>O que é</h5><p>' + esc(x.what) + '</p><h5>Porque é importante</h5><p>' + esc(x.why) + '</p>';
    if (fx) h += '<h5>' + esc(fx.hiL || "Se sair acima do previsto") + '</h5><p>' + esc(fx.up) + '</p><h5>' + esc(fx.loL || "Se sair abaixo do previsto") + '</h5><p>' + esc(fx.down) + '</p>';
    else h += '<h5>Como mexe no mercado</h5><p>' + esc(x.move) + '</p>';
    h += '</div></div></article>';
    return h;
  }
  function openDay(k, focusEv) {
    ensureSheet(); sel = k; draw();
    const list = visible().filter(e => e.day === k);
    const [y, m, d] = k.split("-").map(Number);
    sheet.querySelector("#nwPT").textContent = cap(fmtLong.format(new Date(Date.UTC(y, m - 1, d, 12))));
    sheet.querySelector("#nwPK").textContent = list.length ? (list.length === 1 ? "1 notícia" : list.length + " notícias") : "Dia calmo";
    const H = window.DiarioHook, wd = new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay(), R = H ? H.result(k) : null;
    const goH = H && wd > 0 && wd < 6 ? '<div class="nw-godi"><div><small>No teu Diário · ' + esc(R ? R.who : "Estratégia") + '</small><b class="' + (R ? R.cls : "") + '">' + (R ? esc(R.txt) + (R.tp != null ? ' <span>' + R.tp + ' TP · ' + R.sl + ' SL</span>' : '') : 'ainda sem registo') + '</b></div><button type="button" class="nw-gobtn" data-godiario="' + k + '">Abrir no Diário ›</button></div>' : '';
    sheet.querySelector("#nwPL").innerHTML = goH + (list.length ? list.map((e, n) => evHtml(e, focusEv != null ? e.i === focusEv : list.length === 1, n)).join("") : '<div class="nw-empty">Sem notícias de alto impacto dos EUA neste dia.</div>');
    lastFocus = document.activeElement;
    sheet.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => sheet.classList.add("open"));
    setTimeout(() => sheet.querySelector(".nw-x").focus({ preventScroll: true }), 50);
  }
  function closeSheet() { sheet.classList.remove("open"); sheet.setAttribute("aria-hidden", "true"); sel = null; draw(); if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true }); }

  window.Noticias = {
    preload: load,
    ready: () => !!all,
    // English names of the strong USD news of a day; null when the day is older than the archive
    dayEvents(dayK) {
      if (!all) return null;
      const first = all.find(e => e.country === "USD");
      if (!first || dayK < first.day) return null;
      return visible().filter(e => e.day === dayK && e.impact === "High").map(e => e.title);
    },
    // the next strong USD news still to come today (nothing on days without news)
    nextToday() {
      if (!all) return null;
      const now = Date.now(), k = dayKey(new Date());
      const e = visible().find(x => x.day === k && x.impact === "High" && x.d.getTime() > now - 60000 && !holidayInfo(x));
      return e ? { title: e.title, pt: explain(e).name, time: timeOf(e), d: e.d } : null;
    },
    // what to pay attention to on a day (for the * in the Diário): time, English name, short Portuguese note
    dayInfo(dayK) {
      if (!all) return null;
      return visible().filter(e => e.day === dayK).map(e => {
        const hi = holidayInfo(e);
        if (hi) return { time: e.impact === "Holiday" ? "Dia" : timeOf(e), title: hi.en, sub: hi.pt };
        const x = explain(e), v = verdict(e);
        return { time: timeOf(e), title: e.title, sub: x.name + (e.actual ? " · saiu " + e.actual + (e.forecast ? " (previsto " + e.forecast + ")" : "") : (e.forecast ? " · previsto " + e.forecast : "")) + (v && x.fx && v.dir !== "eq" ? (((v.dir === "up") !== !!x.fx.inv) ? " · dólar ↑" : " · dólar ↓") : "") };
      });
    },
    openDay(k) { injectCss(); load().then(() => openDay(k)); },
    mount(el) {
      injectCss(); root = el;
      el.addEventListener("input", e => { if (e.target.id === "nwQ") { q = e.target.value; drawSearch(); } });
      el.addEventListener("click", e => {
        const gq = e.target.closest("[data-q]"); if (gq) { q = gq.dataset.q; const i = el.querySelector("#nwQ"); if (i) i.value = q; drawSearch(); return; }
        const go = e.target.closest("[data-godiario]"); if (go) { if (window.DiarioHook) window.DiarioHook.goDay(go.dataset.godiario); return; }
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
      setInterval(() => { if (root && document.contains(root) && !(sheet && sheet.classList.contains("open")) && !(document.activeElement && document.activeElement.id === "nwQ")) draw(); }, 60000);
    }
  };
})();
