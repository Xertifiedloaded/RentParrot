import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      icon: '⚡',
      title: 'Electricity Reports',
      desc: 'Find out about power supply reliability before signing any lease.',
    },
    {
      icon: '💧',
      title: 'Water Supply',
      desc: "Know if water runs 24/7 or if you'll need constant refills.",
    },
    {
      icon: '🤝',
      title: 'Landlord Behavior',
      desc: 'Real stories from tenants about landlord responsiveness and fairness.',
    },
    {
      icon: '💸',
      title: 'Rent History',
      desc: 'Discover patterns of unfair rent hikes before you commit.',
    },
    {
      icon: '🗑️',
      title: 'Sanitation',
      desc: 'Check waste disposal, drainage, and general cleanliness of the area.',
    },
    {
      icon: '🛣️',
      title: 'Road & Network',
      desc: 'Learn about road conditions and mobile network quality nearby.',
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="hero-eyebrow">
          🇳🇬 Tenant Insights Platform for Nigerians
        </div>
        <h1 className="hero-title">
          Rent Smarter.
          <br />
          <em>Know Before You Move.</em>
        </h1>
        <p className="hero-subtitle">
          Real reviews from real tenants across Nigeria. Uncover hidden issues
          agents and landlords won’t tell you from power cuts to unreliable
          water and difficult landlords before you rent a home.
        </p>
        <div className="hero-cta">
          <Link href="/properties" className="btn btn-primary btn-lg">
            🔍 Search Properties
          </Link>
          <Link href="/map" className="btn btn-outline btn-lg">
            🗺️ View Map
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Properties Listed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2,000+</div>
            <div className="stat-label">Tenant Reviews</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">20+</div>
            <div className="stat-label">Lagos Areas</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="section">
        <div className="section-header">
          <div className="section-label">What You Can Discover</div>
          <h2 className="section-title">
            Everything tenants wish they knew before renting
          </h2>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="section" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="section-header">
          <div className="section-label">How It Works</div>
          <h2 className="section-title">
            Three simple steps to rent with confidence
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {[
            {
              step: '01',
              title: 'Search any address',
              desc: 'Type in a street, estate, or area in Lagos to find existing properties.',
            },
            {
              step: '02',
              title: 'Read tenant reviews',
              desc: 'Browse categorized reviews from verified past and current tenants.',
            },
            {
              step: '03',
              title: 'Make your decision',
              desc: 'Use AI-powered summaries and maps to choose your next home confidently.',
            },
          ].map((s) => (
            <div key={s.step} className="card">
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '40px',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  opacity: 0.4,
                  marginBottom: '12px',
                }}
              >
                {s.step}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '16px',
                  marginBottom: '8px',
                }}
              >
                {s.title}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px,4vw,36px)',
            fontWeight: 800,
            marginBottom: '12px',
          }}
        >
          Know a property? Share your experience.
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            marginBottom: '28px',
            maxWidth: '480px',
            margin: '0 auto 28px',
          }}
        >
          Help fellow renters avoid bad deals. Your review can save someone from
          months of frustration.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
          <Link href="/post-review" className="btn btn-outline btn-lg">
            Post a Review
          </Link>
        </div>
      </div>
    </>
  );
}
