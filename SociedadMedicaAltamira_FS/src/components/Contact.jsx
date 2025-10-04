import { useState } from 'react'
import Divider from './Divider.jsx'
export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})
  const [ok, setOk] = useState('')
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const onChange = e => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: '' }) }
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Nombre es requerido'
    if (!emailRegex.test(form.email)) e.email = 'Correo inválido'
    if (!form.phone.trim()) e.phone = 'Teléfono es requerido'
    if (!form.message.trim()) e.message = 'Mensaje es requerido'
    return e
  }
  const submit = ev => { ev.preventDefault(); const e = validate(); setErrors(e); if (Object.keys(e).length) return;
    setOk('✅ Mensaje enviado.'); setForm({ name: '', email: '', phone: '', message: '' }) }
  return (
    <section className="page-section" id="contact">
      <div className="container">
        <h2 className="page-section-heading text-center text-uppercase text-secondary mb-0">Contactame</h2>
        <Divider />
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <form onSubmit={submit}>
              <div className="form-floating mb-3">
                <input className={`form-control ${errors.name ? 'is-invalid': ''}`} name="name" type="text" placeholder="Your Name" value={form.name} onChange={onChange} />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                <label>Nombre completo</label>
              </div>
              <div className="form-floating mb-3">
                <input className={`form-control ${errors.email ? 'is-invalid': ''}`} name="email" type="email" placeholder="name@example.com" value={form.email} onChange={onChange} />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                <label>Correo electrónico</label>
              </div>
              <div className="form-floating mb-3">
                <input className={`form-control ${errors.phone ? 'is-invalid': ''}`} name="phone" type="tel" placeholder="(123) 456-7890" value={form.phone} onChange={onChange} />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                <label>Número telefónico</label>
              </div>
              <div className="form-floating mb-3">
                <textarea className={`form-control ${errors.message ? 'is-invalid': ''}`} name="message" placeholder="Enter your message here..." style={{height: '10rem'}} value={form.message} onChange={onChange}></textarea>
                {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                <label>Mensaje</label>
              </div>
              <button className="btn btn-primary btn-xl" type="submit">Enviar</button>
              {ok && <div className="alert alert-success mt-3">{ok}</div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
