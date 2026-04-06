import { motion } from 'framer-motion';

const destinations = [
  { country: "USA", flag: "/USA.webp", univs: "150+" },
  { country: "UK", flag: "/united-kingdom.jpg", univs: "120+" },
  { country: "Canada", flag: "/canada.png", univs: "80+" },
  { country: "Australia", flag: "/Australia.png", univs: "40+" },
  { country: "Germany", flag: "/germany.png", univs: "30+" },
];

export default function Destinations() {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-brand mb-4">
          Top Study Destinations
        </h2>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Through the ApplyBoard global admission network, we provide seamless access to premier institutions worldwide.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto relative z-10">
        {destinations.map((dest, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/5 transition-all text-center group cursor-pointer"
          >
            <div className="mb-6 group-hover:scale-110 transition-transform">
              <img src={dest.flag} alt={dest.country} className="h-20 w-auto mx-auto" />
            </div>
            <h4 className="font-bold text-slate-800 text-2xl mb-2">{dest.country}</h4>
            <p className="text-base font-medium text-brand">{dest.univs} Universities</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
