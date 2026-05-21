import { useState, useEffect } from 'react'
import { REVIEWS, FAQ_ITEMS, REVIEWS_HEADER, FAQ_HEADER, SECTION_DIVIDER, CART_COPY, BIJALINEAS, CANASTAS, formatPrice } from './data'

export function SectionDivider({ kind, lang }: { kind: 'customer' | 'merchant'; lang: string }) {
  const t = SECTION_DIVIDER[kind][lang as keyof typeof SECTION_DIVIDER['customer']]
  return (
    <section className={"divider divider-" + kind} id={kind === "customer" ? "shop-track" : "partner-track"}>
      <div className="wrap divider-wrap">
        <span className="eyebrow">{t.eyebrow}</span>
        <h2 className="display divider-title">{t.title}</h2>
        <p className="divider-sub">{t.sub}</p>
      </div>
    </section>
  )
}

export function Reviews({ lang }: { lang: string }) {
  const h = REVIEWS_HEADER[lang as keyof typeof REVIEWS_HEADER]
  const [idx, setIdx] = useState(0)
  const total = REVIEWS.length
  function go(d: number) { setIdx(i => (i + d + total) % total) }
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % total), 7000)
    return () => clearInterval(id)
  }, [total])
  const r = REVIEWS[idx]

  return (
    <section className="section reviews-section" id="reviews">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{h.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {h.title1}<br/><em>{h.title2}</em>
            </h2>
          </div>
          <div className="reviews-counter">
            <button className="rev-nav" onClick={() => go(-1)} aria-label="Anterior">←</button>
            <span className="rev-counter-text">{String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <button className="rev-nav" onClick={() => go(1)} aria-label="Siguiente">→</button>
          </div>
        </div>

        <div className="reviews-stage">
          <blockquote className="review-quote" key={idx}>
            <span className="rev-mark">&ldquo;</span>
            <p>{r.quote[lang as keyof typeof r.quote]}</p>
            <footer>
              <div className="rev-who">
                <span className="rev-flag">{r.flag}</span>
                <span>
                  <div className="rev-name">{r.who}</div>
                  <div className="rev-role">{r.role[lang as keyof typeof r.role]} · {r.where}</div>
                </span>
              </div>
            </footer>
          </blockquote>

          <div className="reviews-thumbs">
            {REVIEWS.map((rv, i) => (
              <button key={i} className={"rev-thumb " + (i === idx ? "on" : "")} onClick={() => setIdx(i)} aria-label={rv.who}>
                <span className="rev-thumb-flag">{rv.flag}</span>
                <span className="rev-thumb-name">{rv.who}</span>
                <span className="rev-thumb-where">{rv.where}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function FAQ({ lang }: { lang: string }) {
  const h = FAQ_HEADER[lang as keyof typeof FAQ_HEADER]
  const items = FAQ_ITEMS[lang as keyof typeof FAQ_ITEMS]
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq-section" id="faq">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{h.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {h.title1}<br/><em>{h.title2}</em>
            </h2>
          </div>
          <div></div>
        </div>
        <div className="faq-list">
          {items.map((it, i) => {
            const isOpen = i === open
            return (
              <div className={"faq-item" + (isOpen ? " open" : "")} key={i}>
                <button className="faq-q" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}>
                  <span className="faq-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq-text">{it.q}</span>
                  <span className="faq-toggle" aria-hidden="true">{isOpen ? "−" : "+"}</span>
                </button>
                <div className="faq-a" aria-hidden={!isOpen}>
                  <p>{it.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

type Basket = Record<string, { qty: number; price: number }>

export function CartDrawer({ lang, currency, basket, setBasket, open, setOpen }: {
  lang: string; currency: string; basket: Basket
  setBasket: React.Dispatch<React.SetStateAction<Basket>>
  open: boolean; setOpen: (v: boolean) => void
}) {
  const t = CART_COPY[lang as keyof typeof CART_COPY]
  const [stage, setStage] = useState<"cart" | "checkout" | "success">("cart")
  const [form, setForm] = useState({ name: "", email: "", phone: "", addr: "", city: "Barichara", country: "Colombia", notes: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => { if (open) setStage("cart") }, [open])

  function lineLabel(id: string) {
    if (id.startsWith("canasta-")) {
      const [, lineKey, sizeKey] = id.split("-")
      const ln = CANASTAS[lineKey]
      if (!ln) return id
      return ln.name[lang as keyof typeof ln.name] + " · " + sizeKey
    }
    const b = BIJALINEAS.find(x => x.id === id)
    return b ? b.name[lang as keyof typeof b.name] : id
  }

  const items = Object.entries(basket).map(([id, val]) => ({ id, qty: val.qty, price: val.price }))
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0)

  function changeQty(id: string, delta: number) {
    setBasket(b => {
      const cur = b[id]
      if (!cur) return b
      const next = { ...b }
      const newQty = Math.max(0, cur.qty + delta)
      if (newQty === 0) delete next[id]
      else next[id] = { ...cur, qty: newQty }
      return next
    })
  }
  function removeItem(id: string) {
    setBasket(b => { const n = { ...b }; delete n[id]; return n })
  }

  function submitCheckout(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "·"
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = "·"
    if (!form.addr.trim()) errs.addr = "·"
    if (Object.keys(errs).length) { setErrors(errs); return }
    setTimeout(() => { setStage("success"); setBasket({}) }, 700)
  }

  return (
    <>
      <div className={"cart-overlay" + (open ? " on" : "")} onClick={() => setOpen(false)}></div>
      <aside className={"cart-drawer" + (open ? " on" : "")} aria-hidden={!open}>
        <header className="cart-head">
          <span className="eyebrow">{stage === "cart" ? t.title : stage === "checkout" ? t.coTitle : t.success}</span>
          <button className="cart-close" onClick={() => setOpen(false)} aria-label="Cerrar">×</button>
        </header>

        {stage === "cart" && (
          <div className="cart-body">
            {items.length === 0 ? (
              <div className="cart-empty">
                <p>{t.empty}</p>
                <button className="btn btn-primary" onClick={() => setOpen(false)}>{t.keepShopping}</button>
              </div>
            ) : (
              <>
                <ul className="cart-items">
                  {items.map(it => (
                    <li key={it.id} className="cart-item">
                      <div className="cart-item-l">
                        <div className="cart-item-name">{lineLabel(it.id)}</div>
                        <div className="cart-item-meta">{formatPrice(it.price, currency)}</div>
                        <div className="cart-qty">
                          <button onClick={() => changeQty(it.id, -1)} aria-label="−">−</button>
                          <span>{it.qty}</span>
                          <button onClick={() => changeQty(it.id, 1)} aria-label="+">+</button>
                          <button className="cart-rm" onClick={() => removeItem(it.id)}>{t.remove}</button>
                        </div>
                      </div>
                      <div className="cart-item-total">{formatPrice(it.price * it.qty, currency)}</div>
                    </li>
                  ))}
                </ul>
                <div className="cart-totals">
                  <div className="cart-row"><span>{t.subtotal}</span><span>{formatPrice(subtotal, currency)}</span></div>
                  <div className="cart-row muted"><span>{t.shipping}</span><span>{t.shipping_calc}</span></div>
                  <div className="cart-row cart-total"><span>{t.total}</span><span>{formatPrice(subtotal, currency)}</span></div>
                </div>
                <button className="btn btn-primary btn-block" onClick={() => setStage("checkout")}>
                  {t.checkout} <span className="arrow">→</span>
                </button>
                <p className="cart-disclaimer">{t.checkout_sub}</p>
              </>
            )}
          </div>
        )}

        {stage === "checkout" && (
          <form className="cart-body" onSubmit={submitCheckout}>
            <p className="cart-co-sub">{t.coSub}</p>
            <div className="field"><label>{t.name}</label><input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /><div className="error">{errors.name || ""}</div></div>
            <div className="field-row">
              <div className="field"><label>{t.email}</label><input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /><div className="error">{errors.email || ""}</div></div>
              <div className="field"><label>{t.phone}</label><input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+57 300 000 0000" /><div className="error"></div></div>
            </div>
            <div className="field"><label>{t.addr}</label><input value={form.addr} onChange={e => setForm(f => ({...f, addr: e.target.value}))} placeholder="Calle 12 # 5-23" /><div className="error">{errors.addr || ""}</div></div>
            <div className="field-row">
              <div className="field"><label>{t.city}</label><input value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))} /></div>
              <div className="field"><label>{t.country}</label><input value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} /></div>
            </div>
            <div className="field"><label>{t.notes}</label><textarea rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></div>
            <div className="cart-totals" style={{ marginTop: 8 }}>
              <div className="cart-row cart-total"><span>{t.total}</span><span>{formatPrice(subtotal, currency)}</span></div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">{t.pay} <span className="arrow">→</span></button>
            <p className="cart-disclaimer">{t.payDisclaimer}</p>
            <p className="cart-disclaimer">{t.optionalAccount}</p>
          </form>
        )}

        {stage === "success" && (
          <div className="cart-body">
            <div className="form-success">
              <div className="check">✓</div>
              <h4>{t.success}</h4>
              <p className="sub" style={{ marginTop: 10 }}>{t.successSub}</p>
              <button onClick={() => setOpen(false)} className="btn btn-primary" style={{ marginTop: 22 }}>{t.backHome}</button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
