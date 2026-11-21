// Diário de Trading — widget para o ecrã principal do iPhone (app grátis "Scriptable")
// Mostra o dia de hoje: TP, SL e resultado da Fusion e da Prop, e quanto falta para as 21:00.
// Tocar no widget abre o Diário.

const SITE = "https://carlamcamps.github.io/diario-trading/";
const API = "https://nexskfugwtmtwsexlhos.supabase.co/rest/v1/dias";
const KEY = "sb_publishable_-OiT0kTGfY4MmMgD28LrEg_9cQ6kMXW"; // chave pública de leitura (a mesma do site)

const GOLD = new Color("#CDA75E"), CHAMP = new Color("#EFDCC6"), SOFT = new Color("#C7A9A3");
const GREEN = new Color("#7FD3A0"), RED = new Color("#F08AA0");

const now = new Date(), pad = n => String(n).padStart(2, "0");
const today = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

let rows = [];
try {
  const r = new Request(API + "?dia=eq." + today + "&select=serie,tp,sl,sem_operar");
  r.headers = { apikey: KEY, Authorization: "Bearer " + KEY };
  rows = await r.loadJSON();
} catch (e) { rows = null; }

const pick = s => (rows || []).find(x => x.serie === s) || { tp: 0, sl: 0 };
const ACC = [["conta", "Fusion"], ["prop_conta", "Prop"]];

const w = new ListWidget();
const g = new LinearGradient(); g.colors = [new Color("#3A0B17"), new Color("#12030A")]; g.locations = [0, 1]; w.backgroundGradient = g;
w.setPadding(14, 16, 12, 16);
w.url = SITE;

const head = w.addStack(); head.centerAlignContent();
const t = head.addText("Diário de Trading"); t.font = Font.boldSystemFont(13); t.textColor = GOLD;
head.addSpacer();
const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0), start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0, 0);
const weekend = now.getDay() === 0 || now.getDay() === 6;
let clock = "Fim de semana";
if (!weekend) clock = now < start ? "Começa às 6:00" : now < end ? "Faltam " + Math.floor((end - now) / 3600000) + " h " + pad(Math.floor((end - now) % 3600000 / 60000)) + " min" : "Dia terminado";
const c = head.addText(clock); c.font = Font.mediumSystemFont(11); c.textColor = SOFT;
w.addSpacer(8);

if (rows === null) {
  const e = w.addText("Sem ligação. Tenta daqui a pouco."); e.font = Font.systemFont(12); e.textColor = SOFT;
} else {
  for (const [key, name] of ACC) {
    const d = pick(key), pct = d.tp * 2 - d.sl;
    const row = w.addStack(); row.centerAlignContent();
    const n = row.addText(name); n.font = Font.semiboldSystemFont(13); n.textColor = CHAMP; n.lineLimit = 1;
    row.addSpacer();
    const tp = row.addText(d.tp + " TP"); tp.font = Font.semiboldSystemFont(12); tp.textColor = GREEN;
    row.addSpacer(8);
    const sl = row.addText(d.sl + " SL"); sl.font = Font.semiboldSystemFont(12); sl.textColor = RED;
    row.addSpacer(10);
    const p = row.addText((pct > 0 ? "+" : "") + pct + "%"); p.font = Font.boldSystemFont(16); p.textColor = pct > 0 ? GREEN : pct < 0 ? RED : CHAMP;
    w.addSpacer(6);
  }
}
w.addSpacer();
const f = w.addText("Trust the process"); f.font = Font.italicSystemFont(10); f.textColor = GOLD; f.centerAlignText();

w.refreshAfterDate = new Date(Date.now() + 5 * 60 * 1000);
if (config.runsInWidget) Script.setWidget(w); else await w.presentMedium();
Script.complete();
