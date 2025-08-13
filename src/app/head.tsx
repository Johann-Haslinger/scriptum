// src/app/head.tsx
export default function Head() {
  return (
    <>
      <title>Deine App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Manifest und Theme */}
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />

      {/* iOS-Support */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Deine App" />
      <link rel="apple-touch-icon" href="/images/icon-192x192.png" />
    </>
  );
}
