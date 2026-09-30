const AuthShell = ({ title, subtitle, error, children, footer }) => (
  <main className="auth-page">
    <section className="auth-card">
      <div className="brand brand--lg"><span className="brand__mark">R</span>RoleLens</div>
      <h1>{title}</h1>
      <p className="auth-card__sub">{subtitle}</p>
      {error && <div className="form-error" role="alert">{error}</div>}
      {children}
      <p className="auth-card__footer">{footer}</p>
    </section>
  </main>
)

export default AuthShell
