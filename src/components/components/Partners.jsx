export default function Partners() {
  const banks = [
  { name: 'Union Bank', src: '/union-bank.jpg' },
  { name: 'SBI', src: '/SBI.webp' },
  { name: 'Canara Bank', src: '/canara.jpg' },
  { name: 'IDFC First', src: '/idfc-first-bank.jpg' },
  { name: 'ICICI Bank', src: '/icici-bank.jpg' },
  { name: 'Punjab National Bank', src: '/punjab-national-bank.jpg' },
  { name: 'Bank of Baroda', src: '/bank-of-baroda.jpg' },
  { name: 'Credila', src: '/credila.jpg' },
  { name: 'Axis Bank', src: '/axis-bank.webp' },
  { name: 'AVANSE', src: '/avanse-financial-services.webp' },
  { name: 'InCred Finance', src: '/incred.png' },
  { name: 'Auxilo', src: '/auxilo.jpg' },
  { name: 'Tata Capital', src: '/tata-capital.jpg' },
  { name: 'Poonawalla', src: '/poonawalla.webp' },
];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-slate-900 mb-16">
          Partnering with Banks Across India
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-12 items-center justify-items-center">
          {banks.map((bank) => (
            <div
              key={bank.name}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow transform hover:scale-105 flex items-center justify-center"
            >
              <img
                src={bank.src}
                alt={bank.name}
                className="h-20 md:h-24 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
