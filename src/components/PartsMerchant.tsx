import { useState } from 'react'
import { STAND_MAP, MAP_HEADER, REFERRAL, waLink } from './data'
import { WhatsAppIcon } from './PartsTop'

export function StandsMap({ lang }: { lang: string }) {
  const h = MAP_HEADER[lang as keyof typeof MAP_HEADER]
  const m = STAND_MAP
  const [active, setActive] = useState<number | null>(null)

  const counts = {
    live: m.pins.filter(p => p.state === "live").length,
    soon: m.pins.filter(p => p.state === "soon").length,
    interest: m.pins.filter(p => p.state === "interest").length
  }

  return (
    <section className="section map-section" id="map">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{h.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {h.title1}<br/><em>{h.title2}</em>
            </h2>
          </div>
          <div className="map-legend">
            <span className="leg"><span className="dot live"></span>{m.legend.live[lang as keyof typeof m.legend.live]} · {counts.live}</span>
            <span className="leg"><span className="dot soon"></span>{m.legend.soon[lang as keyof typeof m.legend.soon]} · {counts.soon}</span>
            <span className="leg"><span className="dot interest"></span>{m.legend.interest[lang as keyof typeof m.legend.interest]} · {counts.interest}</span>
          </div>
        </div>

        <div className="map-stage">
          <div className="map-canvas" role="img" aria-label="Mapa ilustrativo del corredor santandereano">
            <svg className="map-topo" viewBox="0 0 100 70" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="topoG" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0.04"/>
                </linearGradient>
              </defs>
              <g fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.18">
                <path d="M-5 28 Q 20 22 38 26 T 70 28 T 110 25"/>
                <path d="M-5 36 Q 22 30 42 34 T 75 36 T 110 33"/>
                <path d="M-5 46 Q 25 40 45 44 T 76 47 T 110 45"/>
                <path d="M-5 55 Q 28 50 50 53 T 80 56 T 110 54"/>
                <path d="M-5 62 Q 30 58 52 61 T 84 63 T 110 62"/>
              </g>
              <path d="M0 30 C 18 32, 24 38, 32 40 S 50 48, 60 50 S 90 55, 102 56" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.25" strokeDasharray="0.6 0.6"/>
              <g>
                <text x="3" y="6" fontSize="2.4" fontFamily="JetBrains Mono, monospace" fill="currentColor" opacity="0.5">N</text>
                <text x="3" y="68" fontSize="2.4" fontFamily="JetBrains Mono, monospace" fill="currentColor" opacity="0.5">S</text>
                <text x="96" y="6" fontSize="2.4" fontFamily="JetBrains Mono, monospace" fill="currentColor" opacity="0.5">E</text>
                <text x="-2" y="36" fontSize="2.4" fontFamily="JetBrains Mono, monospace" fill="currentColor" opacity="0.5">W</text>
              </g>
            </svg>

            {m.pins.map((p, i) => (
              <button
                key={i}
                className={"map-pin pin-" + p.state + (active === i ? " on" : "")}
                style={{ left: p.x + "%", top: p.y + "%" }}
                onClick={() => setActive(active === i ? null : i)}
                aria-label={p.label}
              >
                <span className="pin-dot"></span>
                <span className="pin-ring"></span>
                {active === i && <span className="pin-label">{p.label}</span>}
              </button>
            ))}

            <div className="map-corner">
              <span className="mono">{m.region[lang as keyof typeof m.region]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Referrals({ lang }: { lang: string }) {
  const t = REFERRAL[lang as keyof typeof REFERRAL]
  return (
    <section className="section ref-section" id="referrals">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {t.title1}<br/><em>{t.title2}</em>
            </h2>
          </div>
          <p className="blurb">{t.blurb}</p>
        </div>

        <div className="ref-grid">
          <div className="ref-benefits">
            {t.benefits.map((b, i) => (
              <div className="ref-benefit" key={i}>
                <div className="ref-k">{b.k}</div>
                <div className="ref-l">{b.l}</div>
              </div>
            ))}
          </div>

          <div className="ref-how">
            <div className="ref-how-title">{t.howTitle}</div>
            <ol className="ref-steps">
              {t.steps.map((s, i) => (
                <li key={i}>
                  <span className="ref-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="ref-step-txt">{s}</span>
                </li>
              ))}
            </ol>
            <a href={waLink(lang)} target="_blank" rel="noopener" className="btn btn-primary">
              {t.cta} <span className="arrow">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export { WhatsAppIcon }
