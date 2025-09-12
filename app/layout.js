export const metadata = { title: "Veterinaria CRM", description: "MVP multi-sucursal" };
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: 'sans-serif', margin: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>
          <b>🐾 Veterinaria CRM</b>
        </div>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
