import { useState, useEffect, useMemo } from 'react'
import { CANASTAS, PRODUCTS, CONFIG_COPY, formatPrice } from './data'

export function Configurator({ lang, currency, addToBasket }: {
  lang: string; currency: string
  addToBasket: (id: string, qty: number, price: number) => void
}) {
  const t = CONFIG_COPY[lang]
  const [line, setLine] = useState("nativo")
  const [size, setSize] = useState("M")
  const [slots, setSlots] = useState<string[]>([])

  const lineData = CANASTAS[line]
  const sizeData = lineData.sizes[size]
  const maxSlots = sizeData.slots

  useEffect(() => { setSlots([]) }, [line, size])

  const productById = useMemo(() => {
    const m: Record<string, typeof PRODUCTS[0]> = {}
    PRODUCTS.forEach(p => { m[p.id] = p })
    return m
  }, [])

  const slotsTotal = slots.reduce((s, id) => s + (productById[id]?.price || 0), 0)
  const total = lineData.basePrice[size] + slotsTotal
  const filled = slots.length
  const full = filled >= maxSlots

  function addProduct(p: typeof PRODUCTS[0]) {
    if (full) return
    setSlots(s => [...s, p.id])
  }
  function removeAt(i: number) {
    setSlots(s => s.filter((_, idx) => idx !== i))
  }
  function clearAll() { setSlots([]) }
  function autofill() {
    const need = maxSlots - filled
    const fillers: string[] = []
    for (let i = 0; i < need; i++) {
      fillers.push(PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].id)
    }
    setSlots(s => [...s, ...fillers])
  }

  function reserve() {
    addToBasket("canasta-" + line + "-" + size, 1, total)
  }

  const lineKeys = ["nativo", "premium", "luxury"]
  const sizeKeys = ["S", "M", "L"]
  const sizeLabel: Record<string, string> = { S: t.sm, M: t.md, L: t.lg }

  return (
    <section className="section config-section" id="config">
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

        <div className="config-pickers">
          <div className="config-picker">
            <div className="picker-label">{t.pickLine}</div>
            <div className="picker-row">
              {lineKeys.map(k => {
                const ln = CANASTAS[k]
                return (
                  <button
                    key={k}
                    className={"picker-chip line " + (line === k ? "on" : "")}
                    onClick={() => setLine(k)}
                    style={line === k ? { borderColor: ln.color, color: "var(--surface)", background: ln.color } : undefined}
                  >
                    <span className="ch-name">{ln.name[lang as keyof typeof ln.name]}</span>
                    <span className="ch-sub">{ln.sub[lang as keyof typeof ln.sub]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="config-picker">
            <div className="picker-label">{t.pickSize}</div>
            <div className="picker-row">
              {sizeKeys.map(k => (
                <button
                  key={k}
                  className={"picker-chip size " + (size === k ? "on" : "")}
                  onClick={() => setSize(k)}
                >
                  <span className="ch-name">{sizeLabel[k]}</span>
                  <span className="ch-sub">{CANASTAS[line].sizes[k].dims} · {CANASTAS[line].sizes[k].slots} {t.slotsLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="config-stage">
          <div className="canasta-side">
            <div className="canasta-meta">
              <div className="canasta-meta-l">
                <div className="ch-sub" style={{ letterSpacing: ".2em", textTransform: "uppercase", color: "var(--tierra-tapia)", fontSize: 11, fontWeight: 600 }}>
                  {t.boxLabel}
                </div>
                <div className="canasta-meta-name">{lineData.name[lang as keyof typeof lineData.name]} · {sizeLabel[size]}</div>
                <div className="canasta-meta-dims">{sizeData.dims} · {maxSlots} {t.slotsLabel}</div>
              </div>
              <div className="canasta-progress">
                <div className="canasta-progress-bar">
                  <div className="canasta-progress-fill" style={{ width: ((filled / maxSlots) * 100) + "%", background: lineData.color }}></div>
                </div>
                <div className="canasta-progress-text">{filled} / {maxSlots}</div>
              </div>
            </div>

            <div className="canasta-frame" style={{ borderColor: lineData.color }}>
              <div
                className="canasta-grid"
                style={{
                  gridTemplateColumns: `repeat(${sizeData.cols}, 1fr)`,
                  aspectRatio: `${sizeData.cols} / ${Math.ceil(maxSlots / sizeData.cols)}`
                }}
              >
                {Array.from({ length: maxSlots }).map((_, i) => {
                  const pid = slots[i]
                  const p = pid ? productById[pid] : null
                  return (
                    <button
                      key={i}
                      className={"canasta-slot" + (p ? " filled" : "")}
                      onClick={() => p && removeAt(i)}
                      title={p ? p.name[lang as keyof typeof p.name] : ""}
                      aria-label={p ? (t.addedAria + ": " + p.name[lang as keyof typeof p.name]) : ("Slot " + (i + 1))}
                    >
                      {p ? (
                        <>
                          <span className="slot-dot" style={{ background: p.dot }}></span>
                          <span className="slot-name">{p.name[lang as keyof typeof p.name]}</span>
                        </>
                      ) : (
                        <span className="slot-empty">+</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="canasta-actions">
              <button className="btn btn-ghost" onClick={clearAll} disabled={filled === 0}>{t.cleanAll}</button>
              <button className="btn btn-ghost" onClick={autofill} disabled={full}>{t.autofill}</button>
              <span className="canasta-note">{full ? t.fullNote : t.empty}</span>
            </div>
          </div>

          <div className="catalog-side">
            <div className="catalog-head">
              <div className="picker-label">{t.catalogTitle}</div>
            </div>
            <div className="catalog-grid">
              {PRODUCTS.map(p => (
                <button key={p.id} className="product-card" onClick={() => addProduct(p)} disabled={full}>
                  <span className="product-dot" style={{ background: p.dot }}></span>
                  <div className="product-body">
                    <div className="product-name">{p.name[lang as keyof typeof p.name]}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="summary-card">
              <div className="summary-row">
                <span>{t.base} · {lineData.name[lang as keyof typeof lineData.name]} {sizeLabel[size]}</span>
                <span>{formatPrice(lineData.basePrice[size], currency)}</span>
              </div>
              <div className="summary-row">
                <span>{t.items} ({filled})</span>
                <span>{formatPrice(slotsTotal, currency)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>{t.total}</span>
                <span>{formatPrice(total, currency)}</span>
              </div>
              <button className="btn btn-primary btn-block" onClick={reserve}>
                {t.reserve} <span className="arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
