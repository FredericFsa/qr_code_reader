import QRCodeReader from './QRCodeReader';

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* En-tête avec logo */}
      <header className="text-center p-6">
        <img src="/splash-screen.png" alt="Logo Frédéric Salerno" className="mx-auto w-24 mb-4" />
        <h1 className="text-3xl font-bold">Lecteur de QR Code</h1>
      </header>

      {/* Contenu principal */}
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto bg-white text-gray-900 shadow-2xl rounded-2xl p-6 space-y-6">
          <QRCodeReader />
        </div>
      </main>

      {/* Pied de page */}
      <footer className="text-center text-sm text-gray-400 py-4">
        © 2025 Frédéric SALERNO. Tous droits réservés.
      </footer>
    </div>
  );
}

export default Home;
