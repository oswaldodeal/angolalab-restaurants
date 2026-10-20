import './globals.css'

export const metadata = {
  title: 'AngolaLab — Restaurantes Verificados',
  description: 'Descubra restaurantes verificados em Angola',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  )
}
