import { useState, useEffect, useRef } from 'react'
import { COPY, NAV_EXTRA, waLink } from './data'

export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <div className="brand-mark" style={{ width: size, height: size }}>
      <img src="/docs/bijalogo.jpeg" alt="Bijadillo" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", mixBlendMode: "multiply",
        clipPath: "circle(46% at 50% 50%)"
      }} />
    </div>
  )
}

export function Slot({ label, children, style }: { label: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="slot" style={style}>
      {children}
      <span className="slot-label">[ {label} ]</span>
    </div>
  )
}

export function WhatsAppIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M16 3C8.83 3 3 8.83 3 16c0 2.42.67 4.74 1.94 6.78L3 29l6.41-1.86A12.96 12.96 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.6c-2.13 0-4.21-.58-6.02-1.67l-.43-.26-3.8 1.1 1.13-3.7-.28-.45A10.6 10.6 0 1 1 26.6 16c0 5.85-4.75 10.6-10.6 10.6zm5.93-7.95c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.51-.16-.73.16-.21.32-.83 1.05-1.02 1.27-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.59-1.6-.96-.85-1.6-1.91-1.79-2.23-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.73-1.75-1-2.4-.26-.62-.53-.54-.73-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.67 0 1.57 1.14 3.1 1.3 3.31.16.21 2.25 3.44 5.45 4.83.76.33 1.36.53 1.83.68.77.25 1.46.21 2.01.13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z"/>
    </svg>
  )
}

export function SunIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>
    </svg>
  )
}

export function MoonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>
    </svg>
  )
}

function NavDropdown({ value, options, onChange, label }: {
  value: string
  options: Array<{ value: string; label: string; full?: string }>
  onChange: (v: string) => void
  label: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    if (open) document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])
  const current = options.find(o => o.value === value) || options[0]
  return (
    <div className={"nav-dd" + (open ? " open" : "")} ref={ref}>
      <button
        className="nav-dd-trigger"
        onClick={() => setOpen(o => !o)}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="nav-dd-val">{current.label}</span>
        <svg viewBox="0 0 12 8" width="10" height="7" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1.5L6 6.5L11 1.5"/></svg>
      </button>
      {open && (
        <ul className="nav-dd-menu" role="listbox" aria-label={label}>
          {options.map(o => (
            <li key={o.value}>
              <button
                role="option"
                aria-selected={value === o.value}
                className={value === o.value ? "on" : ""}
                onClick={() => { onChange(o.value); setOpen(false) }}
              >
                {o.full || o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Nav({ lang, setLang, active, theme, setTheme, currency, setCurrency, basketCount, onOpenCart }: {
  lang: string; setLang: (l: string) => void; active: string; theme: string
  setTheme: (m: string) => void; currency: string; setCurrency: (c: string) => void
  basketCount: number; onOpenCart: () => void
}) {
  const t = COPY[lang as keyof typeof COPY]
  const x = NAV_EXTRA[lang]
  const [mobile, setMobile] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const sections = [
    { id: "land",      label: t.nav.land },
    { id: "lines",     label: t.nav.lines },
    { id: "config",    label: x.config },
    { id: "reviews",   label: x.reviews },
    { id: "faq",       label: x.faq },
    { id: "partner-track", label: x.merchant }
  ]

  useEffect(() => { document.body.style.overflow = mobile ? "hidden" : "" }, [mobile])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 24) }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const langOpts = [
    { value: "es", label: "ES", full: "Español" },
    { value: "en", label: "EN", full: "English" },
    { value: "fr", label: "FR", full: "Français" }
  ]
  const currOpts = [
    { value: "COP", label: "COP", full: "COP · Peso colombiano" },
    { value: "USD", label: "USD", full: "USD · US Dollar" },
    { value: "EUR", label: "EUR", full: "EUR · Euro" }
  ]

  return (
    <header className={"nav" + (scrolled ? " scrolled" : "")}>
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Bijadillo" onClick={() => setMobile(false)}>
          <BrandMark />
          <span className="brand-name">Bijadillo</span>
        </a>

        <nav className={"nav-links" + (mobile ? " open" : "")}>
          {sections.map(s => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : ""} onClick={() => setMobile(false)}>
              {s.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <NavDropdown value={currency} options={currOpts} onChange={setCurrency} label="Currency" />
          <NavDropdown value={lang} options={langOpts} onChange={setLang} label="Idioma" />
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? x.theme_light : x.theme_dark}
            title={theme === "dark" ? x.theme_light : x.theme_dark}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="nav-cart" onClick={onOpenCart} aria-label={x.cart}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 4h2l2.5 12.5a2 2 0 0 0 2 1.5h7a2 2 0 0 0 2-1.5L21 8H6"/>
              <circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/>
            </svg>
            <span className="nav-cart-label">{x.cart}</span>
            {basketCount > 0 && <span className="nav-cart-count">{basketCount}</span>}
          </button>
          <button className="hamburger" onClick={() => setMobile(m => !m)} aria-label="Menu" aria-expanded={mobile}>
            {mobile ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export function Hero({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].hero
  return (
    <section className="hero wrap" id="top">
      <div className="hero-grid">
        <div>
          <span className="eyebrow">{t.eyebrow}</span>
          <h1 className="display" style={{ marginTop: 20 }}>
            {t.title1}<br/>
            <em>{t.title2}</em><br/>
            <span className="it">{t.title3}</span>
          </h1>
          <p className="lede">{t.lede}</p>
          <div className="hero-meta">
            <a href="#lines" className="btn btn-primary">{t.cta1} <span className="arrow">→</span></a>
            <a href="#partner-track" className="btn btn-ghost">{t.cta2}</a>
          </div>
          <div className="hero-seals">
            <div>
              <div className="hero-seal-k">{t.sealK}</div>
              <div className="hero-seal-v">{t.sealV}</div>
            </div>
            <div>
              <div className="hero-seal-k">{t.seal2K}</div>
              <div className="hero-seal-v">{t.seal2V}</div>
            </div>
            <div>
              <div className="hero-seal-k">{t.seal3K}</div>
              <div className="hero-seal-v">{t.seal3V}</div>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <Slot
            label={lang === "es"
              ? "FOTO HERO · bocadillo en empaque editorial · luz cálida lateral"
              : lang === "fr"
              ? "PHOTO HERO · bocadillo en écrin éditorial · lumière chaude"
              : "HERO PHOTO · bocadillo in editorial wrap · warm side light"}
            style={{ position: "absolute", inset: 0 }}
          />
          <span className="hero-art-tag">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--coral)", display: "inline-block" }}></span>
            {t.capPill}
          </span>
          <div className="hero-art-caption">{t.capLine}</div>
        </div>
      </div>
    </section>
  )
}

export function Ticker({ items }: { items: string[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {doubled.map((s, i) => (
          <span key={i} className="ticker-item">
            <span className="dot"></span>{s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Land({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].land
  return (
    <section className="section land" id="land">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {t.title1}<br/>
              <em>{t.title2}</em>
            </h2>
          </div>
          <p className="blurb">{t.blurb}</p>
        </div>

        <blockquote className="land-quote">
          &ldquo;{t.bigQuote}&rdquo;
          <cite>{t.bigQuoteCite}</cite>
        </blockquote>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <div className="hero-seal-k" style={{ color: "var(--tierra-tapia)" }}>{t.mapTitle}</div>
            <div className="hero-seal-v" style={{ fontSize: 22 }}>{t.mapSub}</div>
          </div>
          <div className="hero-seal-k" style={{ color: "var(--carbon-suave)" }}>
            08 {lang === "es" ? "pueblos del corredor" : lang === "fr" ? "villages du couloir" : "corridor towns"}
          </div>
        </div>

        <div className="pueblos-grid">
          {t.pueblos.map((p, i) => (
            <div className="pueblo-card" key={i}>
              <div className="pueblo-num">0{i + 1} / {t.pueblos.length}</div>
              <div className="pueblo-name">{p.name}</div>
              <div className="pueblo-tag">{p.tag}</div>
              <div className="pueblo-blurb">{p.blurb}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FloatActions({ lang }: { lang: string }) {
  return (
    <div className="float-actions">
      <a className="fab-wa" href={waLink(lang)} target="_blank" rel="noopener" aria-label="WhatsApp">
        <WhatsAppIcon size={26} color="#fff" />
      </a>
    </div>
  )
}
