// Views - Presentation layer (React components)
// This is the home page

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Dental App Server</h1>
      <p>Backend server running with Next.js App Router</p>
      <p>API endpoints are available at <code>/api/*</code></p>
    </main>
  )
}

