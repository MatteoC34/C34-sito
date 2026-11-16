# Sito Consulting/34 STP · www.consulting34.com

Sito statico (HTML, CSS e JavaScript, senza build) pubblicato con Netlify. Usa lo stesso design system di [cfoesterno.com](https://cfoesterno.com) (repository `cfo-esterno-sito`).

## Pagine

| URL | File | Contenuto |
|---|---|---|
| `/` | `index.html` | Home: le tre aree di attività, profili cliente, approccio integrato, avvio dell'incarico, partnership, lo Studio, approfondimenti, domande frequenti |
| `/contabile-e-fiscale/` | `contabile-e-fiscale/index.html` | Area 01: contabilità, fiscalità, bilancio, personale, revisione legale, startup e PMI innovative |
| `/fractional-cfo/` | `fractional-cfo/index.html` | Area 02: Fractional CFO e controllo di gestione |
| `/m-and-a/` | `m-and-a/index.html` | Area 03: M&A e operazioni straordinarie |
| `/chi-siamo/` | `chi-siamo/index.html` | Lo Studio: team, principi di lavoro, partnership, sede |
| `/risorse/` | `risorse/index.html` | Approfondimenti (articoli), con filtro per argomento. Con Glossario e Link utili forma la voce di menu "Risorse" |
| `/<slug-articolo>/` | cartella omonima | 23 articoli migrati dal vecchio blog, stessi indirizzi |
| `/glossario/` | `glossario/index.html` | Glossario d'impresa: 101 voci in cinque aree (contabile e fiscale, Fractional CFO, M&A, startup e PMI innovative, clausole di investimento), indice per area, ricerca con sinonimi, scheda con riferimento normativo, voci collegate e calcolatori |
| `/link-utili/` | `link-utili/index.html` | Strumenti di calcolo, guide per i Clienti, conti correnti, servizi dello Studio |
| `/contatti/` | `contatti/index.html` | Recapiti, modulo, sede |
| `/privacy/`, `/cookie/` | cartelle omonime | Informative |
| `/grazie/`, `/404` | `grazie/index.html`, `404.html` | Conferma di invio del modulo e pagina non trovata |

## Come si modifica

- Glossario: ogni voce è un `<article class="dz-panel">` in `glossario/index.html`, con il relativo link nell'indice `.dz-list` (un gruppo per area, `data-area`; i sinonimi di ricerca sono nell'attributo `data-s`). I calcolatori (`data-calc`) usano le formule in `assets/site.js`. Aggiornare anche i dati strutturati in fondo alla pagina.

Ogni pagina è un file HTML completo: si modifica direttamente, anche dall'editor di GitHub. Menu e footer sono ripetuti in ogni pagina: se cambiano, vanno aggiornati in tutti i file.

- `assets/c34.css`, `assets/c34.js`, `assets/fonts*`, `assets/logo/`: design system condiviso con cfoesterno.com. Da non modificare qui, per mantenere i due siti allineati.
- `assets/site.css`, `assets/site.js`: componenti e interazioni specifici di questo sito.

## Anteprima in locale

```bash
python3 -m http.server 8080
```

Poi apri <http://localhost:8080>. I link usano percorsi assoluti (`/assets/...`), quindi il server va avviato dalla cartella principale del repository.

## Pubblicazione su Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub → questo repository.
2. Build command: vuoto. Publish directory: `.` (già impostata in `netlify.toml`).
3. Ogni push sul branch `main` ripubblica il sito.

- `_redirects`: redirect permanenti dai vecchi indirizzi del sito WordPress alle nuove pagine.
- `_headers`: intestazioni di sicurezza, compresa la Content Security Policy (il sito non usa script inline né risorse esterne: se si aggiungono servizi terzi va aggiornata).

## Modulo di contatto

Il modulo usa Netlify Forms (`name="contatto"`). Le richieste sono consultabili in Netlify → Forms; per riceverle via email attivare Form notifications verso hello@consulting34.com. Antispam: campo trappola `bot-field` e filtro automatico di Netlify.

## Da completare

- [x] Migrazione dei 23 articoli del blog (stessi indirizzi del vecchio sito)
- [ ] `assets/og.png`, immagine di anteprima per i social (1200×630)
- [ ] Revisione dei testi, delle domande frequenti e delle informative da parte dello Studio
- [ ] Collegamento del dominio www.consulting34.com
