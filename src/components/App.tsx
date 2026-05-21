'use client'

import { useState, useEffect } from 'react'
import { COPY } from './data'
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle } from './TweaksPanel'
import { Nav, Hero, Ticker, Land, FloatActions } from './PartsTop'
import { Bijalineas, Pack, Socios } from './PartsMid'
import { Configurator } from './Configurator'
import { SectionDivider, Reviews, FAQ, CartDrawer } from './PartsCustomer'
import { StandsMap, Referrals } from './PartsMerchant'
import { Pitch, Nums, Timeline, Contact, Portal, Footer } from './PartsBottom'

const TWEAKS_DEFAULTS = {
  accent: "#EC7A6C",
  deepGreen: "#085434",
  language: "es",
  theme: "light",
  currency: "COP",
  showGrain: true
}

type Basket = Record<string, { qty: number; price: number }>

export default function App() {
  const [t, setTweak] = useTweaks(TWEAKS_DEFAULTS)

  useEffect(() => {
    const r = document.documentElement
    r.style.setProperty("--coral", t.accent as string)
    r.style.setProperty("--section-deep", t.deepGreen as string)
    document.body.dataset.grain = t.showGrain ? "on" : "off"
  }, [t])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", (t.theme as string) || "light")
  }, [t.theme])

  const [lang, setLang] = useState((t.language as string) || "es")
  useEffect(() => {
    if (t.language && t.language !== lang) setLang(t.language as string)
    document.documentElement.lang = (t.language as string) || lang
  }, [t.language])

  const [currency, setCurrency] = useState((t.currency as string) || "COP")
  useEffect(() => {
    if (t.currency && t.currency !== currency) setCurrency(t.currency as string)
  }, [t.currency])

  function setTheme(mode: string) { setTweak("theme", mode) }
  function setCurrencyT(c: string) { setTweak("currency", c); setCurrency(c) }

  const [basket, setBasket] = useState<Basket>({})
  function addToBasket(id: string, qty: number, customPrice?: number) {
    setBasket(b => {
      const prev = b[id] || { qty: 0, price: 0 }
      const price = customPrice != null ? customPrice : 0
      return { ...b, [id]: { qty: prev.qty + qty, price } }
    })
    setCartOpen(true)
  }
  const basketCount = Object.values(basket).reduce((a, x) => a + x.qty, 0)

  const [cartOpen, setCartOpen] = useState(false)

  const [active, setActive] = useState("top")
  useEffect(() => {
    const ids = [
      "top", "land", "lines", "config", "pack", "reviews", "faq",
      "partner-track", "pitch", "map", "nums", "referrals", "socios", "portal",
      "timeline", "contact"
    ]
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const items = document.querySelectorAll(".reveal")
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in") })
    }, { threshold: 0.08 })
    items.forEach(i => obs.observe(i))
    return () => obs.disconnect()
  }, [lang])

  const copy = COPY[lang as keyof typeof COPY]

  return (
    <div className="app-shell">
      <Nav
        lang={lang}
        setLang={(l) => { setLang(l); setTweak("language", l) }}
        active={active}
        theme={(t.theme as string) || "light"}
        setTheme={setTheme}
        currency={currency}
        setCurrency={setCurrencyT}
        basketCount={basketCount}
        onOpenCart={() => setCartOpen(true)}
      />
      <Hero lang={lang} />
      <Ticker items={copy.ticker} />

      <SectionDivider kind="customer" lang={lang} />
      <Land lang={lang} />
      <Bijalineas lang={lang} currency={currency} addToBasket={(id, qty) => addToBasket(id, qty)} />
      <Configurator lang={lang} currency={currency} addToBasket={addToBasket} />
      <Pack lang={lang} />
      <Reviews lang={lang} />
      <FAQ lang={lang} />

      <SectionDivider kind="merchant" lang={lang} />
      <Pitch lang={lang} />
      <StandsMap lang={lang} />
      <Nums lang={lang} />
      <Referrals lang={lang} />
      <Socios lang={lang} />
      <Portal lang={lang} />

      <Timeline lang={lang} />
      <Contact lang={lang} />
      <Footer lang={lang} />

      <FloatActions lang={lang} />

      <CartDrawer
        lang={lang}
        currency={currency}
        basket={basket}
        setBasket={setBasket}
        open={cartOpen}
        setOpen={setCartOpen}
      />

      <TweaksPanel title="Tweaks · Bijadillo">
        <TweakSection label={lang === "es" ? "Marca" : lang === "fr" ? "Marque" : "Brand"} />
        <TweakColor
          label={lang === "es" ? "Acento" : "Accent"}
          value={t.accent}
          onChange={v => setTweak("accent", v)}
          options={["#EC7A6C", "#F25C78", "#C17754", "#A4D25C"]}
        />
        <TweakColor
          label={lang === "es" ? "Verde casa" : lang === "fr" ? "Vert maison" : "Deep green"}
          value={t.deepGreen}
          onChange={v => setTweak("deepGreen", v)}
          options={["#085434", "#1E3315", "#3A5F2D", "#2C3525"]}
        />
        <TweakSection label={lang === "es" ? "Experiencia" : lang === "fr" ? "Expérience" : "Experience"} />
        <TweakRadio
          label={lang === "es" ? "Tema" : lang === "fr" ? "Thème" : "Theme"}
          value={t.theme}
          onChange={v => setTweak("theme", v)}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
        />
        <TweakRadio
          label={lang === "es" ? "Idioma" : lang === "fr" ? "Langue" : "Language"}
          value={t.language}
          onChange={v => { setTweak("language", v); setLang(v as string) }}
          options={[{ value: "es", label: "ES" }, { value: "en", label: "EN" }, { value: "fr", label: "FR" }]}
        />
        <TweakRadio
          label={lang === "es" ? "Moneda" : lang === "fr" ? "Devise" : "Currency"}
          value={t.currency}
          onChange={v => { setTweak("currency", v); setCurrency(v as string) }}
          options={[{ value: "COP", label: "COP" }, { value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }]}
        />
        <TweakToggle
          label={lang === "es" ? "Grano" : lang === "fr" ? "Grain" : "Grain"}
          value={!!t.showGrain}
          onChange={v => setTweak("showGrain", v)}
        />
      </TweaksPanel>
    </div>
  )
}
