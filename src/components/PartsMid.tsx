import { useState } from 'react'
import { COPY, BIJALINEAS, formatPrice } from './data'
import { Slot } from './PartsTop'

export function Bijalineas({ lang, currency, addToBasket }: {
  lang: string; currency: string; addToBasket: (id: string, qty: number) => void
}) {
  const t = COPY[lang as keyof typeof COPY].lines
  const [active, setActive] = useState(0)
  const [qty, setQty] = useState(1)
  const [pulse, setPulse] = useState(false)

  const line = BIJALINEAS[active]

  function handleReserve() {
    addToBasket(line.id, qty)
    setPulse(true)
    setTimeout(() => setPulse(false), 600)
  }

  return (
    <section className="section lines-section" id="lines">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {t.title1}<br/>
              <em>{t.title2}</em><br/>
              <span className="it">{t.title3}</span>
            </h2>
          </div>
          <p className="blurb">{t.blurb}</p>
        </div>

        <div className="lines-selector" role="tablist">
          {BIJALINEAS.map((l, i) => (
            <button
              key={l.id}
              className={i === active ? "on" : ""}
              onClick={() => { setActive(i); setQty(1) }}
              role="tab"
              aria-selected={i === active}
            >
              <span className="num">0{i + 1}</span>
              {l.name[lang as keyof typeof l.name]}
            </button>
          ))}
        </div>

        <div className="line-stage" key={active}>
          <div className="line-art reveal in">
            <Slot
              label={line.art[lang as keyof typeof line.art]}
              style={{ position: "absolute", inset: 0 }}
            />
            <div className="badge">{line.badge}</div>
          </div>

          <div className="line-detail">
            <h3>
              <span className="small">{line.eyebrow[lang as keyof typeof line.eyebrow]}</span>
              {line.name[lang as keyof typeof line.name]}
            </h3>
            <div className="price">
              {formatPrice(line.price, currency)}
              <small>{line.unit[lang as keyof typeof line.unit]}</small>
            </div>
            <p className="pitch">{line.pitch[lang as keyof typeof line.pitch]}</p>

            <div className="line-specs">
              <div>
                <div className="spec-key">{t.contents}</div>
                <div className="spec-val">{line.contents[lang as keyof typeof line.contents]}</div>
              </div>
              <div>
                <div className="spec-key">{t.packaging}</div>
                <div className="spec-val">{line.packaging[lang as keyof typeof line.packaging]}</div>
              </div>
              <div>
                <div className="spec-key">{t.ceremony}</div>
                <div className="spec-val">{line.ceremony[lang as keyof typeof line.ceremony]}</div>
              </div>
              <div>
                <div className="spec-key">{t.pairing}</div>
                <div className="spec-val">{line.pairing[lang as keyof typeof line.pairing]}</div>
              </div>
            </div>

            <div className="line-badges">
              {line.badges.map((b, i) => (
                <span className="chip" key={i}><span className="d"></span>{b[lang as keyof typeof b]}</span>
              ))}
            </div>

            <div className="line-actions">
              <div className="qty" aria-label="Quantity">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Less">−</button>
                <span className="n">{qty}</span>
                <button onClick={() => setQty(q => Math.min(20, q + 1))} aria-label="More">+</button>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleReserve}
                style={pulse ? { transform: "scale(0.97)" } : undefined}
              >
                {t.reserve} · {formatPrice(line.price * qty, currency)}
                <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Pack({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].pack
  return (
    <section className="section pack" id="pack">
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

        <div className="pack-stats">
          <div className="pack-stat"><div className="n">{t.stat1}</div><div className="l">{t.stat1l}</div></div>
          <div className="pack-stat"><div className="n">{t.stat2}</div><div className="l">{t.stat2l}</div></div>
          <div className="pack-stat"><div className="n">{t.stat3}</div><div className="l">{t.stat3l}</div></div>
        </div>

        <div className="pack-pillars">
          <div className="pack-pillar"><h4>{t.pillarH1}</h4><p>{t.pillarP1}</p></div>
          <div className="pack-pillar"><h4>{t.pillarH2}</h4><p>{t.pillarP2}</p></div>
          <div className="pack-pillar"><h4>{t.pillarH3}</h4><p>{t.pillarP3}</p></div>
        </div>

        <div className="partner-strip">
          <div className="partner-logo-slot"><span className="l">[ {t.partnerSlot} ]</span></div>
          <p>{t.partnerNote}</p>
        </div>
      </div>
    </section>
  )
}

export function Socios({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].socios
  return (
    <section className="section socios" id="socios">
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

        <div className="socios-grid">
          {t.slots.map((s, i) => (
            <div className="socio-card" key={i}>
              <div className="socio-logo"><span className="name">{s.name}</span></div>
              <div className="socio-meta">
                <span className="socio-role">{s.role}</span>
                <span className="socio-state">{s.state}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <a href="#contact" className="btn btn-dark">{t.cta} <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  )
}
