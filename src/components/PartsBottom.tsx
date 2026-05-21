import { useState, useEffect } from 'react'
import { COPY, waLink } from './data'
import { WhatsAppIcon } from './PartsTop'

export function Pitch({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].pitch
  return (
    <section className="section pitch-sec" id="pitch">
      <div className="wrap">
        <div style={{ maxWidth: 820 }}>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 className="display" style={{ marginTop: 18 }}>
            {t.title1}<br/>
            <em>{t.title2}</em><br/>
            <span className="it">{t.title3}</span>
          </h2>
          <p className="blurb">{t.blurb}</p>
        </div>

        <div className="verticals-head">
          <span className="eyebrow" style={{ color: "var(--coral)" }}>{t.verticalsTitle}</span>
        </div>

        <div className="verticals-grid">
          {t.verticals.map((v, i) => (
            <div className="vertical-card" key={i}>
              <div className="vertical-k">{v.k}</div>
              <h4 className="vertical-h">{v.h}</h4>
              <p className="vertical-p">{v.p}</p>
              <div className="vertical-proof">{v.proof}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Nums({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].nums
  const [form, setForm] = useState({
    name: "", contact: "", email: "", phone: "", city: "Barichara", type: t.types[0], msg: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<"idle" | "sending" | "success">("idle")

  useEffect(() => {
    setForm(f => ({ ...f, type: COPY[lang as keyof typeof COPY].nums.types[0] }))
  }, [lang])

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: "" }))
  }
  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = t.err_required
    if (!form.contact.trim()) e.contact = t.err_required
    if (!form.email.trim()) e.email = t.err_required
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = t.err_email
    if (!form.city.trim()) e.city = t.err_required
    setErrors(e)
    return Object.keys(e).length === 0
  }
  function submit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setState("sending")
    setTimeout(() => setState("success"), 900)
  }
  function reset() {
    setForm({ name: "", contact: "", email: "", phone: "", city: "Barichara", type: t.types[0], msg: "" })
    setErrors({})
    setState("idle")
  }

  return (
    <section className="section nums" id="nums">
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

        <div className="nums-table">
          {t.rows.map((r, i) => (
            <div className="num-row" key={i}>
              <div className="num-k">{r.k}</div>
              <div className="num-v">{r.v}</div>
              <div className="num-s">{r.sub}</div>
            </div>
          ))}
        </div>

        <div className="nums-cta">
          <div>
            <div className="hero-seal-k" style={{ color: "var(--tierra-tapia)" }}>
              {lang === "es" ? "Postulación" : lang === "fr" ? "Candidature" : "Application"}
            </div>
            <h3 className="display" style={{ fontSize: "var(--display-s)", marginTop: 14, color: "var(--verde-logo)" }}>
              <em>{lang === "es" ? "Postula tu local" : lang === "fr" ? "Postulez votre lieu" : "Apply with your venue"}</em>
            </h3>
            <p className="hint" style={{ marginTop: 20 }}>{t.formSub}</p>
            <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={waLink(lang)} target="_blank" rel="noopener" className="btn btn-wa">
                <WhatsAppIcon size={16} color="#0c2615" />
                {lang === "es" ? "Hablemos por WhatsApp" : lang === "fr" ? "WhatsApp" : "WhatsApp us"}
              </a>
            </div>
          </div>

          <div className="form-card">
            {state === "success" ? (
              <div className="form-success">
                <div className="check">✓</div>
                <h4>{t.success}</h4>
                <p className="sub" style={{ marginTop: 10 }}>{t.successSub}</p>
                <button onClick={reset} className="btn btn-primary" style={{ marginTop: 22 }}>{t.again}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <h4>{t.formTitle}</h4>
                <p className="sub">{t.formSub}</p>
                <div className="field">
                  <label>{t.f_name}</label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="Hostal La Cigarra" />
                  <div className="error">{errors.name || ""}</div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>{t.f_contact}</label>
                    <input value={form.contact} onChange={e => set("contact", e.target.value)} placeholder="María Camacho" />
                    <div className="error">{errors.contact || ""}</div>
                  </div>
                  <div className="field">
                    <label>{t.f_phone}</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+57 300 000 0000" />
                    <div className="error"></div>
                  </div>
                </div>
                <div className="field-row">
                  <div className="field">
                    <label>{t.f_email}</label>
                    <input type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="hola@local.com" />
                    <div className="error">{errors.email || ""}</div>
                  </div>
                  <div className="field">
                    <label>{t.f_city}</label>
                    <input value={form.city} onChange={e => set("city", e.target.value)} placeholder="Barichara" />
                    <div className="error">{errors.city || ""}</div>
                  </div>
                </div>
                <div className="field">
                  <label>{t.f_type}</label>
                  <select value={form.type} onChange={e => set("type", e.target.value)}>
                    {t.types.map(tt => <option key={tt}>{tt}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>{t.f_msg}</label>
                  <textarea rows={3} value={form.msg} onChange={e => set("msg", e.target.value)}
                    placeholder={lang === "es" ? "Nuestros huéspedes son..." : lang === "fr" ? "Nos voyageurs sont..." : "Our guests are..."} />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={state === "sending"}>
                  {state === "sending" ? t.sending : t.submit}
                  {state !== "sending" && <span className="arrow">→</span>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Timeline({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].time
  return (
    <section className="section tl-section" id="timeline">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}>
              {t.title1}<br/><em>{t.title2}</em>
            </h2>
          </div>
          <div></div>
        </div>
        <div className="tl-list">
          {t.events.map((e, i) => (
            <div className="tl-event" key={i}>
              <div className="tl-year">{e.y}</div>
              <div>
                <div className="tl-title">{e.t}</div>
                <div className="tl-desc">{e.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].contact
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div style={{ maxWidth: 780 }}>
          <span className="eyebrow">{t.eyebrow}</span>
          <h2 style={{ marginTop: 18 }}>
            {t.title1}<br/>
            <em style={{ color: "var(--coral)", fontStyle: "italic" }}>{t.title2}</em>
          </h2>
          <p className="blurb">{t.blurb}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <span className="k">WhatsApp</span>
            <span className="v">{t.whatsapp}</span>
            <span className="s">{t.whatsappSub}</span>
            <div className="cta-row">
              <a href={waLink(lang)} target="_blank" rel="noopener" className="btn btn-wa">
                <WhatsAppIcon size={16} color="#0c2615" />
                {lang === "es" ? "Abrir conversación" : lang === "fr" ? "Ouvrir la conversation" : "Open chat"}
              </a>
            </div>
          </div>
          <div className="contact-card">
            <span className="k">Email</span>
            <span className="v">{t.email}</span>
            <span className="s">{t.emailSub}</span>
            <div className="cta-row">
              <a href={"mailto:" + t.email} className="btn btn-ghost" style={{ color: "var(--crema-fibra)", borderColor: "rgba(245,244,238,0.3)" }}>
                {lang === "es" ? "Escribir correo" : lang === "fr" ? "Écrire" : "Send email"}
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
          <div className="contact-card">
            <span className="k">{lang === "es" ? "Visítanos" : lang === "fr" ? "Visitez-nous" : "Visit us"}</span>
            <span className="v">{t.place}</span>
            <span className="s">{t.placeSub}</span>
            <div className="cta-row">
              <a href="https://maps.google.com/?q=Barichara+Colombia" target="_blank" rel="noopener" className="btn btn-ghost" style={{ color: "var(--crema-fibra)", borderColor: "rgba(245,244,238,0.3)" }}>
                {lang === "es" ? "Ver mapa" : lang === "fr" ? "Voir carte" : "View map"}
                <span className="arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Portal({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].portal
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [state, setState] = useState<"idle" | "trying" | "ok" | "err">("idle")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!user.trim() || !pass.trim()) return
    setState("trying")
    setTimeout(() => setState("err"), 900)
  }

  return (
    <section className="section portal" id="portal">
      <div className="wrap">
        <div className="portal-grid">
          <div>
            <span className="eyebrow">{t.eyebrow}</span>
            <h2 className="display" style={{ marginTop: 18 }}><em>{t.title1}</em></h2>
            <p className="blurb" style={{ marginTop: 24 }}>{t.blurb}</p>
            <div style={{ marginTop: 28 }}>
              <span className="hero-seal-k" style={{ color: "var(--tierra-tapia)" }}>{t.newPartner}</span>
              <div style={{ marginTop: 12 }}>
                <a href="#nums" className="btn btn-ghost">{t.apply} <span className="arrow">→</span></a>
              </div>
            </div>
          </div>

          <div className="portal-card">
            <h4>{lang === "es" ? "Acceso aliados" : lang === "fr" ? "Accès partenaires" : "Partner access"}</h4>
            <p className="sub">{t.note}</p>
            <form onSubmit={submit}>
              <div className="field">
                <label>{t.user}</label>
                <input value={user} onChange={e => setUser(e.target.value)} placeholder="hostal@correo.com" />
              </div>
              <div className="field">
                <label>{t.pass}</label>
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
              </div>
              <button type="submit" className="btn btn-dark btn-block" disabled={state === "trying"}>
                {state === "trying" ? "…" : t.login}
                {state !== "trying" && <span className="arrow">→</span>}
              </button>
              {state === "err" && (
                <div className="portal-success" style={{ background: "var(--tierra-tapia)" }}>
                  {lang === "es"
                    ? "El portal está en construcción. Te avisaremos cuando esté listo."
                    : lang === "fr"
                    ? "Le portail est en construction. Nous vous préviendrons."
                    : "Portal under construction. We'll let you know."}
                </div>
              )}
            </form>
            <div className="portal-footer">
              <a href="#contact">{t.forgot}</a>
              <a href="#contact">soporte</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer({ lang }: { lang: string }) {
  const t = COPY[lang as keyof typeof COPY].footer
  const [email, setEmail] = useState("")
  const [ok, setOk] = useState(false)

  function sub(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    setOk(true)
    setTimeout(() => { setOk(false); setEmail("") }, 2800)
  }

  return (
    <footer className="footer" id="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <span className="brand-name" style={{ color: "var(--crema-fibra)", fontSize: 40 }}>Bijadillo</span>
            <p className="footer-tag">{t.tag}</p>
            <form className="newsletter" onSubmit={sub}>
              <input type="email" placeholder={t.n_placeholder} value={email} onChange={e => setEmail(e.target.value)} required />
              <button type="submit">{t.n_cta}</button>
            </form>
            {ok && <div className="ok" style={{ color: "var(--verde-lima)", fontSize: 13, marginTop: 10 }}>{t.n_ok}</div>}
            <div style={{ fontSize: 11, color: "rgba(245,244,238,0.5)", marginTop: 12, letterSpacing: "0.04em" }}>{t.n_sub}</div>
          </div>
          <div>
            <h5>{t.explore}</h5>
            <ul>
              <li><a href="#lines">{t.l_lines}</a></li>
              <li><a href="#land">{t.l_land}</a></li>
              <li><a href="#pack">{t.l_pack}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t.brand}</h5>
            <ul>
              <li><a href="#pitch">{t.l_partners}</a></li>
              <li><a href="#socios">{t.l_socios}</a></li>
              <li><a href="#portal">{t.l_portal}</a></li>
              <li><a href="#timeline">{t.l_about}</a></li>
            </ul>
          </div>
          <div>
            <h5>Casa</h5>
            <ul>
              <li><a href="#timeline">{t.l_origin}</a></li>
              <li><a href="#pack">{t.l_invima}</a></li>
              <li><a href={waLink(lang)} target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="mailto:hola@bijadillo.com">hola@bijadillo.com</a></li>
            </ul>
          </div>
          <div>
            <h5>{t.legal}</h5>
            <ul>
              <li><a href="#">{t.l_terms}</a></li>
              <li><a href="#">{t.l_privacy}</a></li>
              <li><a href="#">{t.l_cookies}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.copy}</div>
          <div>
            <a href="#">Instagram</a>
            <a href="#">TikTok</a>
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
