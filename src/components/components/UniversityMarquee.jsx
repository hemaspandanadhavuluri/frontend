export default function UniversityMarquee() {
  // replace these src strings with real university logo paths as they become available
  const logos = [
    '/Universities/7-TU_Darmstadt.png',
    '/Universities/Artboard+1.webp',
    '/Universities/Cardiff-University-Logo-Vector.svg-.png',
    '/Universities/cdu_logo.png',
    '/Universities/georgia-institute-of-technology-logo-png_seeklogo-486642.png',
    '/Universities/griffith-university-new74278.logowik.com.webp',
    '/Universities/logo.jpg',
    '/Universities/Memorial-University-of-Newfoundland-Canada.png',
    '/Universities/PSU-mark-navy.jpg',
    '/Universities/UTTexas_Austin_1.jpg',
    '/Universities/washington-university-in-st-louis-george-warren-brown-school-of-social-work-vector-logo.png',
  ];

  return (
    <section className="w-full overflow-hidden bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h3 className="text-2xl md:text-3xl font-semibold text-center text-slate-800">
          Where Our Students' Journeys Have Taken Them
        </h3>
      </div>
        <div className="flex overflow-hidden relative w-full bg-white [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] group">
          {/* First Marquee Track */}
          <div className="flex animate-marquee min-w-full justify-around shrink-0 items-center gap-12 px-6 group-hover:[animation-play-state:paused]">
            {logos.map((src, idx) => (
               <img
                  key={`first-${idx}`}
                  src={src}
                  alt={`university-${idx}`}
                  className="h-16 md:h-20 object-contain max-w-[150px] shrink-0"
               />
            ))}
          </div>
          {/* Second Duplicate Marquee Track */}
          <div className="flex animate-marquee min-w-full justify-around shrink-0 items-center gap-12 px-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
            {logos.map((src, idx) => (
               <img
                  key={`second-${idx}`}
                  src={src}
                  alt={`university-dup-${idx}`}
                  className="h-16 md:h-20 object-contain max-w-[150px] shrink-0"
               />
            ))}
          </div>
        </div>
    </section>
  );
}
