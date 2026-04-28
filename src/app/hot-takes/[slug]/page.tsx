import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props { params: Promise<{ slug: string }> }

const GREEN = '#52B788';
const ORANGE = '#F7831E';

const ARTICLES: Record<string, {
    en: { title: string; subtitle: string; keywords: string; intro: string; verdict: string };
    es: { title: string; subtitle: string; intro: string; verdict: string };
    image: string;
    tag: string; tagColor: string;
    cities: string[];
    slugs: string[];
    table: { category: string; a: string; b: string; c?: string; winner: 'a' | 'b' | 'tie' }[];
    socials: { en: string; es: string }[];
    updated: string;
}> = {
    'bangkok-vs-bali': {
        en: {
            title: 'Bangkok vs Bali 2026: The Ultimate Digital Nomad Showdown',
            subtitle: 'Two Asia icons. One winner.',
            keywords: 'bangkok vs bali cost of living, bangkok or bali cheaper, bali cost of living 2026, digital nomad asia',
            intro: 'For a decade, Bangkok and Bali have split the digital nomad world into two camps. One is a sprawling, hyper-connected metropolis with world-class infrastructure and an endless food scene. The other is a tropical island with a tight-knit global community, killer sunsets, and coworking spaces on every corner. Both are incredible. But in 2026, one is significantly cheaper — and the gap is growing.',
            verdict: 'Bangkok wins on cost and infrastructure. Bali wins on lifestyle and community. If you\'re on a budget under $1,500/month, Bangkok is the clear choice. If you can stretch to $2,000+ and want that island atmosphere, Bali delivers.',
        },
        es: {
            title: 'Bangkok vs Bali 2026: El Duelo Definitivo de los Nómadas Digitales',
            subtitle: 'Dos íconos de Asia. Un ganador.',
            intro: 'Durante una década, Bangkok y Bali dividieron al mundo nómada en dos campamentos. Bangkok es una metrópolis hiperconectada con infraestructura de primera. Bali es una isla tropical con una comunidad global, atardeceres increíbles y coworkings en cada esquina. Las dos son espectaculares. Pero en 2026, una es significativamente más barata — y la diferencia crece.',
            verdict: 'Bangkok gana en precio e infraestructura. Bali gana en estilo de vida y comunidad. Si tenés menos de $1,500/mes, Bangkok es la elección clara. Si podés llegar a $2,000+, Bali vale cada centavo.',
        },
        image: 'photo-1508009603885-50cf7c579365',
        tag: 'Most Popular', tagColor: '#3b82f6',
        cities: ['Bangkok', 'Bali'],
        slugs: ['bangkok', 'bali'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$450–700', b: '$800–1,400', winner: 'a' },
            { category: 'Food / Comida', a: '$250–400', b: '$350–600', winner: 'a' },
            { category: 'Transport / Transporte', a: '$40–80', b: '$60–100', winner: 'a' },
            { category: 'Coworking', a: '$80–150', b: '$150–250', winner: 'a' },
            { category: 'Internet', a: '100+ Mbps', b: '50–80 Mbps', winner: 'a' },
            { category: 'Safety / Seguridad', a: '7.2/10', b: '7.8/10', winner: 'b' },
            { category: 'Community / Comunidad', a: 'Good', b: 'Excellent', winner: 'b' },
            { category: 'Total estimate', a: '$1,100–1,600', b: '$1,600–2,500', winner: 'a' },
        ],
        socials: [
            { en: 'Bangkok or Bali? Bangkok is 40% cheaper in 2026 — but Bali has the sunset. You pick.', es: '¿Bangkok o Bali? Bangkok es 40% más barata en 2026 — pero Bali tiene el atardecer. Vos elegís.' },
            { en: '$1,100/month in Bangkok. $1,800/month in Bali. Both with coworking, coffee and community. The numbers don\'t lie.', es: '$1,100/mes en Bangkok. $1,800/mes en Bali. Las dos con coworking, café y comunidad. Los números no mienten.' },
            { en: 'The nomad debate that never ends: Bangkok vs Bali. We compared the real 2026 numbers — Bangkok wins on budget, Bali wins on vibes.', es: 'El debate nómada que nunca termina: Bangkok vs Bali. Comparamos los números reales de 2026.' },
        ],
        updated: 'April 2026',
    },
    'new-york-vs-mexico-city': {
        en: {
            title: 'New York vs Mexico City 2026: Same Energy, 70% Cheaper',
            subtitle: 'The smartest relocation story of the decade.',
            keywords: 'new york vs mexico city cost of living, living in cdmx american, cost of living mexico city 2026, remote work mexico',
            intro: 'New York City has an energy that\'s almost impossible to replicate. Almost. Because thousands of Americans have discovered that Mexico City — specifically neighborhoods like Roma Norte and Condesa — delivers that same electric urban pulse at 70% less cost. In 2026, the question isn\'t whether CDMX is a good option. The question is: why haven\'t you moved yet?',
            verdict: 'If you earn in USD and can work remotely, Mexico City is one of the greatest financial decisions you can make. You save $2,000–4,000/month versus New York while gaining world-class food, culture, and weather.',
        },
        es: {
            title: 'Nueva York vs Ciudad de México 2026: La Misma Energía, 70% Más Barato',
            subtitle: 'La historia de relocalización más inteligente de la década.',
            intro: 'Nueva York tiene una energía casi imposible de replicar. Casi. Porque miles de americanos descubrieron que Ciudad de México — especialmente barrios como Roma Norte y Condesa — tiene el mismo pulso urbano eléctrico al 70% menos de costo. En 2026, la pregunta no es si CDMX es una buena opción. La pregunta es: ¿por qué todavía no te mudaste?',
            verdict: 'Si ganás en dólares y podés trabajar remotamente, Ciudad de México es una de las mejores decisiones financieras que podés tomar. Ahorrás $2,000–4,000/mes vs Nueva York, con gastronomía, cultura y clima de primer nivel.',
        },
        image: 'photo-1496442226666-8d4d0e62e6e9',
        tag: 'Trending', tagColor: ORANGE,
        cities: ['New York', 'Mexico City'],
        slugs: ['new-york', 'mexico-city'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$3,500–5,000', b: '$700–1,100', winner: 'b' },
            { category: 'Food / Comida', a: '$600–900', b: '$250–400', winner: 'b' },
            { category: 'Transport / Transporte', a: '$130', b: '$25', winner: 'b' },
            { category: 'Healthcare / Salud', a: 'Very expensive', b: 'Affordable', winner: 'b' },
            { category: 'Safety / Seguridad', a: '7.0/10', b: '5.5/10', winner: 'a' },
            { category: 'Internet', a: '200+ Mbps', b: '80+ Mbps', winner: 'a' },
            { category: 'Total estimate', a: '$4,500–6,500', b: '$1,200–1,800', winner: 'b' },
            { category: 'You save / Ahorrás', a: '—', b: '$3,000–4,500/mo', winner: 'b' },
        ],
        socials: [
            { en: 'Rent in Manhattan: $4,500/month. Rent in Condesa CDMX: $900/month. Same energy. Different bank account.', es: 'Alquiler en Manhattan: $4,500/mes. Alquiler en Condesa CDMX: $900/mes. Misma energía. Diferente cuenta bancaria.' },
            { en: 'The math is simple: earn New York salary + live in Mexico City = retire 10 years early. Thousands are already doing it.', es: 'La matemática es simple: ganar en Nueva York + vivir en Ciudad de México = jubilarse 10 años antes.' },
            { en: 'Roma Norte vs Lower East Side: same vibe, same coffee, same startup energy. $900/month difference. You decide.', es: 'Roma Norte vs Lower East Side: misma vibra, mismo café, mismo ambiente startup. $900/mes de diferencia.' },
        ],
        updated: 'April 2026',
    },
    'lisbon-vs-barcelona': {
        en: {
            title: 'Lisbon vs Barcelona 2026: Which Is Cheaper to Live In Europe?',
            subtitle: 'Two dream cities. One clear winner on price.',
            keywords: 'lisbon vs barcelona cost of living, live in lisbon 2026, barcelona rent expats, portugal vs spain cheaper',
            intro: 'Both cities have the Atlantic nearby, warm weather, incredible food scenes, and a magnetic pull that attracts expats from around the world. But in 2026, their price tags tell very different stories. Lisbon has gotten more expensive but still beats Barcelona. Barcelona has become one of Western Europe\'s most expensive cities. Here are the real numbers.',
            verdict: 'Lisbon is approximately 25–30% cheaper than Barcelona overall, with significantly better safety scores. The D8 Digital Nomad Visa makes Portugal the easier legal choice too. Barcelona wins on nightlife, beach access, and job market size.',
        },
        es: {
            title: 'Lisboa vs Barcelona 2026: ¿Cuál Sale Más Barata para Vivir en Europa?',
            subtitle: 'Dos ciudades soñadas. Un ganador claro en precio.',
            intro: 'Las dos tienen el Atlántico cerca, buen clima, gastronomía increíble y un magnetismo que atrae expats de todo el mundo. Pero en 2026, sus precios cuentan historias muy distintas. Lisboa se encareció, pero sigue ganando a Barcelona. Barcelona se convirtió en una de las ciudades más caras de Europa Occidental. Acá van los números reales.',
            verdict: 'Lisboa es aproximadamente 25–30% más barata que Barcelona en general, con mejores índices de seguridad. La Visa Nómada Digital D8 también facilita la legalidad en Portugal. Barcelona gana en vida nocturna, playa y mercado laboral.',
        },
        image: 'local-lisbon',
        tag: 'Europe', tagColor: GREEN,
        cities: ['Lisbon', 'Barcelona'],
        slugs: ['lisbon', 'barcelona'],
        table: [
            { category: 'Rent 1BR center', a: '€1,200–1,600', b: '€1,500–2,200', winner: 'a' },
            { category: 'Food / Comida', a: '€300–450', b: '€350–550', winner: 'a' },
            { category: 'Transport / Transporte', a: '€40', b: '€45', winner: 'a' },
            { category: 'Safety / Seguridad', a: '8.4/10', b: '6.1/10', winner: 'a' },
            { category: 'Nomad Visa', a: 'D8 ✓', b: 'Limited', winner: 'a' },
            { category: 'Nightlife', a: 'Good', b: 'Excellent', winner: 'b' },
            { category: 'Beach / Playa', a: '30 min', b: '20 min', winner: 'tie' },
            { category: 'Total estimate', a: '€1,700–2,300', b: '€2,200–3,200', winner: 'a' },
        ],
        socials: [
            { en: 'Lisbon vs Barcelona: €600/month difference. Same sun, same pastries (almost), very different bills.', es: 'Lisboa vs Barcelona: €600/mes de diferencia. El mismo sol, los mismos pasteles (casi), facturas muy distintas.' },
            { en: 'Barcelona has the beach. Lisbon has the Visa Nómada, lower rent AND better safety. The choice is obvious.', es: 'Barcelona tiene la playa. Lisboa tiene la Visa Nómada, alquiler más bajo Y más seguridad. La elección es obvia.' },
            { en: 'Europe\'s two most coveted cities for expats — compared with real 2026 data. Spoiler: one is 30% cheaper.', es: 'Las dos ciudades europeas más deseadas por expats — comparadas con datos reales de 2026.' },
        ],
        updated: 'April 2026',
    },
    'berlin-vs-bucharest': {
        en: {
            title: 'Berlin vs Bucharest 2026: Eastern Europe\'s Best Kept Secret',
            subtitle: 'Half the price. Twice the internet speed.',
            keywords: 'berlin vs bucharest cost of living, live in bucharest expats, eastern europe cheap cities, digital nomads eastern europe',
            intro: 'Berlin has the culture, the history, and the startup scene that made it the capital of European cool. But in 2026, Berlin is also expensive, crowded, and bureaucratically exhausting. Bucharest has quietly built a case as Europe\'s smartest relocation choice — EU membership, some of the fastest internet on the continent, a growing tech scene, and costs that are roughly half of Berlin\'s.',
            verdict: 'Bucharest offers remarkable value for the quality of life you get. For remote workers and digital nomads who prioritize budget and internet speed, it\'s the clear winner. Berlin wins on culture depth, international community, and career opportunities.',
        },
        es: {
            title: 'Berlín vs Bucarest 2026: El Secreto Mejor Guardado de Europa',
            subtitle: 'La mitad del precio. El doble de velocidad de internet.',
            intro: 'Berlín tiene la cultura, la historia y la escena startup que la convirtieron en la capital del cool europeo. Pero en 2026, Berlín también es cara, está sobrepoblada y es burocráticamente agotadora. Bucarest construyó en silencio su caso como la decisión de relocalización más inteligente de Europa — miembro de la UE, uno de los internets más rápidos del continente, escena tech creciente y costos de casi la mitad de Berlín.',
            verdict: 'Bucarest ofrece un valor notable para la calidad de vida que obtenés. Para trabajadores remotos que priorizan presupuesto e internet, es la ganadora clara. Berlín gana en profundidad cultural, comunidad internacional y oportunidades laborales.',
        },
        image: 'photo-1560969184-10fe8719e047',
        tag: 'Hidden Gem', tagColor: '#8b5cf6',
        cities: ['Berlin', 'Bucharest'],
        slugs: ['berlin', 'bucharest'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '€1,400–1,900', b: '€500–800', winner: 'b' },
            { category: 'Food / Comida', a: '€350–500', b: '€200–300', winner: 'b' },
            { category: 'Transport / Transporte', a: '€86/mo', b: '€20/mo', winner: 'b' },
            { category: 'Internet speed', a: '80 Mbps', b: '200+ Mbps', winner: 'b' },
            { category: 'EU Membership', a: 'Yes', b: 'Yes', winner: 'tie' },
            { category: 'English spoken', a: 'Very good', b: 'Good', winner: 'a' },
            { category: 'Cultural scene', a: 'World class', b: 'Growing', winner: 'a' },
            { category: 'Total estimate', a: '€2,000–2,800', b: '€900–1,300', winner: 'b' },
        ],
        socials: [
            { en: 'Bucharest: 200 Mbps internet, €1,100/month, EU member state. Nobody talks about it. Until now.', es: 'Bucarest: 200 Mbps, €1,100/mes, miembro de la UE. Nadie habla de esto. Hasta ahora.' },
            { en: 'Berlin vs Bucharest: €1,700/month difference. Same EU passport access. Very different bank accounts.', es: 'Berlín vs Bucarest: €1,700/mes de diferencia. Mismo acceso de pasaporte UE. Cuentas bancarias muy diferentes.' },
            { en: 'The secret nomad city of Eastern Europe isn\'t Tallinn or Prague anymore. It\'s Bucharest. Real 2026 data inside.', es: 'La ciudad nómada secreta de Europa del Este ya no es Tallin ni Praga. Es Bucarest.' },
        ],
        updated: 'April 2026',
    },
    'dubai-vs-singapore': {
        en: {
            title: 'Dubai vs Singapore 2026: 0% Tax — But Which Is Actually Cheaper?',
            subtitle: 'Two no-tax giants. One clear price winner.',
            keywords: 'dubai vs singapore cost of living, live in dubai 2026, singapore cost of living, tax free cities expats',
            intro: 'Two of the world\'s most aspirational cities. Zero income tax in both. World-class infrastructure. International airports with direct routes everywhere. But beyond the tax advantage, the lifestyle costs are very different — and which city actually stretches your dollar further depends heavily on how you live.',
            verdict: 'Dubai is 20–30% cheaper than Singapore overall, particularly for rent. Singapore wins on public transport (no car needed) and overall walkability. Both are excellent for high-earning expats. Dubai suits car-dependent, beach-loving, nightlife-forward lifestyles. Singapore suits urban, transit-using, food-obsessed expats.',
        },
        es: {
            title: 'Dubai vs Singapur 2026: 0% Impuestos — ¿Pero Cuál Sale Más Barata?',
            subtitle: 'Dos gigantes sin impuestos. Un ganador claro en precios.',
            intro: 'Dos de las ciudades más aspiracionales del mundo. Cero impuesto a la renta en ambas. Infraestructura de primera. Aeropuertos internacionales con conexiones directas a todo el mundo. Pero más allá de la ventaja fiscal, los costos de vida son muy diferentes — y cuál estira más tu dólar depende mucho de cómo vivís.',
            verdict: 'Dubai es 20–30% más barata que Singapur en general, especialmente en alquiler. Singapur gana en transporte público y caminabilidad. Dubai es ideal para expats que aman la playa, los autos y la vida nocturna. Singapur para quienes prefieren lo urbano y la gastronomía.',
        },
        image: 'photo-1512453979798-5ea266f8880c',
        tag: 'Tax Free', tagColor: '#f59e0b',
        cities: ['Dubai', 'Singapore'],
        slugs: ['dubai', 'singapore'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$1,500–2,500', b: '$2,000–3,500', winner: 'a' },
            { category: 'Food / Comida', a: '$400–600', b: '$500–800', winner: 'a' },
            { category: 'Transport / Transporte', a: '$200 (car)', b: '$80 (MRT)', winner: 'b' },
            { category: 'Income tax', a: '0%', b: '0–22%', winner: 'a' },
            { category: 'Safety / Seguridad', a: '9.1/10', b: '9.5/10', winner: 'b' },
            { category: 'Food scene', a: 'Good', b: 'World class', winner: 'b' },
            { category: 'Weather / Clima', a: 'Hot & sunny', b: 'Hot & humid', winner: 'tie' },
            { category: 'Total estimate', a: '$2,500–4,000', b: '$3,000–5,000', winner: 'a' },
        ],
        socials: [
            { en: 'Dubai 0% tax. Singapore 0% tax. But there\'s a $1,500/month difference between them. We break it down.', es: 'Dubai 0% impuestos. Singapur 0% impuestos. Pero hay $1,500/mes de diferencia. Acá lo desglosamos.' },
            { en: 'Two cities where you keep your entire salary. One has the Burj Khalifa. The other has the best hawker food on Earth.', es: 'Dos ciudades donde te quedás con todo tu sueldo. Una tiene el Burj Khalifa. La otra tiene el mejor street food del mundo.' },
            { en: 'High-earning expat relocating? The Dubai vs Singapore math is more complicated than you think. 2026 real data.', es: 'Expat de altos ingresos pensando en reubicarse? La matemática Dubai vs Singapur es más complicada de lo que creés.' },
        ],
        updated: 'April 2026',
    },
    'buenos-aires-vs-lima': {
        en: {
            title: 'Buenos Aires vs Lima 2026: South America\'s Best Cities Compared',
            subtitle: 'Tango vs ceviche. Architecture vs gastronomy. Data vs opinion.',
            keywords: 'buenos aires vs lima cost of living, live in buenos aires 2026, lima expats cost, south america best city',
            intro: 'South America has two cities that consistently compete for the title of continent\'s most livable: Buenos Aires with its European-influenced architecture, passionate culture, and world-class steak. Lima with its culinary revolution (regularly ranked among the world\'s best food cities), Pacific coast, and surprisingly modern infrastructure. The catch? Argentina\'s economic volatility changes the Buenos Aires equation constantly.',
            verdict: 'Lima offers more stability and value consistency. Buenos Aires can be extraordinary value for dollar-earners using the informal exchange rate — but the economic context requires careful financial planning. Both offer exceptional quality of life for the price.',
        },
        es: {
            title: 'Buenos Aires vs Lima 2026: Las Mejores Ciudades de Sudamérica Comparadas',
            subtitle: 'Tango vs ceviche. Arquitectura vs gastronomía. Datos vs opinión.',
            intro: 'Sudamérica tiene dos ciudades que compiten constantemente por el título de más habitable del continente: Buenos Aires con su arquitectura europeizada, cultura apasionada y asado de clase mundial. Lima con su revolución culinaria (regularmente entre las mejores del mundo), costa pacífica e infraestructura sorprendentemente moderna. El problema: la volatilidad económica de Argentina cambia la ecuación constantemente.',
            verdict: 'Lima ofrece más estabilidad y consistencia de valor. Buenos Aires puede ser un valor extraordinario para quienes ganan en dólares — pero el contexto económico requiere planificación financiera cuidadosa. Las dos ofrecen una calidad de vida excepcional por el precio.',
        },
        image: 'local-buenos-aires',
        tag: 'LatAm', tagColor: '#ef4444',
        cities: ['Buenos Aires', 'Lima'],
        slugs: ['buenos-aires', 'lima'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$400–700*', b: '$500–800', winner: 'a' },
            { category: 'Food / Comida', a: '$200–350', b: '$250–400', winner: 'a' },
            { category: 'Transport / Transporte', a: '$30', b: '$40', winner: 'a' },
            { category: 'Economic stability', a: 'Low / Baja', b: 'High / Alta', winner: 'b' },
            { category: 'Food scene', a: 'World class', b: 'World class', winner: 'tie' },
            { category: 'Safety / Seguridad', a: '5.8/10', b: '6.2/10', winner: 'b' },
            { category: 'Nightlife', a: 'Legendary', b: 'Good', winner: 'a' },
            { category: 'Total estimate', a: '$800–1,200*', b: '$1,000–1,400', winner: 'a' },
        ],
        socials: [
            { en: 'Buenos Aires can be the cheapest major city in the world for dollar earners. Or it can be chaotic. In 2026, it\'s still both.', es: 'Buenos Aires puede ser la ciudad grande más barata del mundo para quienes ganan en dólares. O puede ser un caos. En 2026, sigue siendo las dos cosas.' },
            { en: 'Lima has the world\'s best food scene and costs less than Madrid. Nobody told you. Now you know.', es: 'Lima tiene la mejor gastronomía del mundo y cuesta menos que Madrid. Nadie te lo dijo. Ahora lo sabés.' },
            { en: 'Argentina vs Peru for expats: one has economic instability, the other has ceviche. Both have an incredible quality of life.', es: 'Argentina vs Perú para expats: una tiene inestabilidad económica, la otra tiene ceviche. Las dos tienen una calidad de vida increíble.' },
        ],
        updated: 'April 2026',
    },
    'tokyo-vs-seoul': {
        en: {
            title: 'Tokyo vs Seoul 2026: Japan or Korea — The Real Numbers',
            subtitle: 'Two Asian powerhouses. One surprisingly affordable.',
            keywords: 'tokyo vs seoul cost of living, live in tokyo 2026, seoul cost of living, moving to japan vs korea',
            intro: 'Tokyo has a reputation for being expensive. Seoul has a reputation for being surprisingly affordable. In 2026, both reputations are partially wrong. Tokyo is cheaper than most people think — especially for food and transport. Seoul\'s rents have risen significantly in the past three years. The real comparison is more nuanced than the stereotypes suggest.',
            verdict: 'Seoul is still moderately cheaper overall, particularly for rent. Tokyo wins on food value (incredible quality at low prices), safety (one of the safest cities on Earth), and infrastructure. Both are extraordinary cities that reward long-term residents.',
        },
        es: {
            title: 'Tokio vs Seúl 2026: Japón o Corea — Los Números Reales',
            subtitle: 'Dos potencias asiáticas. Una sorprendentemente accesible.',
            intro: 'Tokio tiene fama de cara. Seúl tiene fama de sorprendentemente accesible. En 2026, las dos reputaciones están parcialmente equivocadas. Tokio es más barata de lo que la gente cree — especialmente en comida y transporte. Los alquileres de Seúl subieron significativamente en los últimos tres años. La comparación real es más matizada de lo que indican los estereotipos.',
            verdict: 'Seúl sigue siendo moderadamente más barata en general, especialmente en alquiler. Tokio gana en valor gastronómico (calidad increíble a precios bajos), seguridad (una de las ciudades más seguras del mundo) e infraestructura.',
        },
        image: 'photo-1540959733332-eab4deabeeaf',
        tag: 'Asia', tagColor: '#ec4899',
        cities: ['Tokyo', 'Seoul'],
        slugs: ['tokyo', 'seoul'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$1,200–2,000', b: '$800–1,500', winner: 'b' },
            { category: 'Food / Comida', a: '$300–500', b: '$300–450', winner: 'tie' },
            { category: 'Transport / Transporte', a: '$80', b: '$50', winner: 'b' },
            { category: 'Safety / Seguridad', a: '9.7/10', b: '8.3/10', winner: 'a' },
            { category: 'Internet', a: '150+ Mbps', b: '200+ Mbps', winner: 'b' },
            { category: 'English friendly', a: 'Limited', b: 'Good', winner: 'b' },
            { category: 'Food quality', a: 'World class', b: 'World class', winner: 'tie' },
            { category: 'Total estimate', a: '$1,800–2,800', b: '$1,400–2,200', winner: 'b' },
        ],
        socials: [
            { en: 'Tokyo is cheaper than you think. Seoul is more expensive than you remember. 2026 data confirms it.', es: 'Tokio es más barata de lo que pensás. Seúl más cara de lo que recordás. Los datos de 2026 lo confirman.' },
            { en: 'Japan vs South Korea: two countries that steal your heart. One has $3 ramen. The other has $2 street tteokbokki. Both win.', es: 'Japón vs Corea del Sur: dos países que te roban el corazón. Uno tiene ramen de $3. El otro tiene tteokbokki de $2.' },
            { en: 'Did you know Tokyo can be cheaper than Sydney? The numbers most people never see. Asia cost of living 2026.', es: '¿Sabías que Tokio puede ser más barata que Sydney? Los números que casi nadie muestra.' },
        ],
        updated: 'April 2026',
    },
    'amsterdam-vs-prague': {
        en: {
            title: 'Amsterdam vs Prague 2026: Smart Europe vs Expensive Europe',
            subtitle: 'Canals, coffee culture and coworking — at very different prices.',
            keywords: 'amsterdam vs prague cost of living, live in amsterdam 2026, prague for expats, eastern europe western europe cheaper',
            intro: 'Amsterdam has been on every expat dream list for decades. In 2026, it\'s also on the "too expensive" list for most people. Prague has quietly positioned itself as the alternative that delivers the European dream — cobblestone streets, world-class beer, rich history, fast internet — at roughly half the price. The comparison is almost unfair.',
            verdict: 'Prague wins overwhelmingly on price, offering 50%+ savings versus Amsterdam. Amsterdam wins on international job market, English proficiency, and Schengen hub convenience. For remote workers, Prague is one of Europe\'s best-kept secrets.',
        },
        es: {
            title: 'Ámsterdam vs Praga 2026: Europa Inteligente vs Europa Cara',
            subtitle: 'Canales, cultura cafetera y coworking — a precios muy distintos.',
            intro: 'Ámsterdam estuvo en la lista de sueños de los expats durante décadas. En 2026, también está en la lista de "demasiado cara" para la mayoría. Praga se posicionó silenciosamente como la alternativa que entrega el sueño europeo — adoquines, cerveza de clase mundial, historia rica, internet rápido — a aproximadamente la mitad del precio.',
            verdict: 'Praga gana en precio con más del 50% de ahorro vs Ámsterdam. Ámsterdam gana en mercado laboral internacional, inglés y conveniencia de hub Schengen. Para trabajadores remotos, Praga es uno de los mejores secretos de Europa.',
        },
        image: 'photo-1512470876302-972faa2aa9a4',
        tag: 'Europe', tagColor: '#6366f1',
        cities: ['Amsterdam', 'Prague'],
        slugs: ['amsterdam', 'prague'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '€1,800–2,500', b: '€700–1,100', winner: 'b' },
            { category: 'Food / Comida', a: '€400–600', b: '€250–380', winner: 'b' },
            { category: 'Transport / Transporte', a: '€100', b: '€25', winner: 'b' },
            { category: 'Internet', a: '150 Mbps', b: '100 Mbps', winner: 'tie' },
            { category: 'English proficiency', a: 'Native-level', b: 'Very good', winner: 'a' },
            { category: 'Job market', a: 'Excellent', b: 'Growing', winner: 'a' },
            { category: 'Beer quality', a: 'Good', b: 'World class', winner: 'b' },
            { category: 'Total estimate', a: '€2,500–3,500', b: '€1,100–1,700', winner: 'b' },
        ],
        socials: [
            { en: 'Amsterdam: €2,800/month. Prague: €1,300/month. Both have canals, great beer and a thriving expat scene. Do the math.', es: 'Ámsterdam: €2,800/mes. Praga: €1,300/mes. Las dos tienen canales, buena cerveza y comunidad expat. Hacé los números.' },
            { en: 'Eastern Europe is the best-kept secret in travel and relocation. Prague, Bucharest, Bratislava — same EU, half the price.', es: 'Europa del Este es el secreto mejor guardado para vivir y viajar. Praga, Bucarest, Bratislava — misma UE, la mitad del precio.' },
            { en: 'Your European salary in an Eastern European city = retire at 40. Not clickbait. Just math.', es: 'Tu sueldo europeo en una ciudad de Europa del Este = jubilarse a los 40. No es clickbait. Son matemáticas.' },
        ],
        updated: 'April 2026',
    },
    'la-vs-miami-vs-mexico-city': {
        en: {
            title: 'LA vs Miami vs Mexico City 2026: Where Smart Americans Actually Live Now',
            subtitle: 'The remote work relocation math nobody wants to show you.',
            keywords: 'la vs miami vs mexico city, americans moving to mexico, cost of living miami 2026, remote work live abroad us',
            intro: 'The remote work revolution didn\'t just change where people work — it changed where they live. In 2026, a growing cohort of American remote workers has done the math and made the move: earn in dollars, spend in pesos. LA and Miami offer incredible lifestyles but extract a brutal financial toll. CDMX offers the same energy, culture, and weather at a fraction of the cost.',
            verdict: 'For remote workers earning in USD, Mexico City is the financially transformative choice — saving $2,000–4,000/month versus LA or Miami. That gap compounds to $24,000–48,000/year in savings. LA and Miami win on job markets and cultural familiarity. CDMX wins on value, food, and lifestyle quality per dollar.',
        },
        es: {
            title: 'LA vs Miami vs Ciudad de México 2026: Dónde Viven los Americanos Inteligentes Ahora',
            subtitle: 'La matemática de relocalización remota que nadie te quiere mostrar.',
            intro: 'La revolución del trabajo remoto no solo cambió dónde trabaja la gente — cambió dónde vive. En 2026, una cohorte creciente de trabajadores remotos americanos hizo los números y se mudó: ganar en dólares, gastar en pesos. LA y Miami ofrecen estilos de vida increíbles pero cobran un precio financiero brutal. CDMX ofrece la misma energía, cultura y clima a una fracción del costo.',
            verdict: 'Para trabajadores remotos que ganan en USD, Ciudad de México es la elección financieramente transformadora — ahorrando $2,000–4,000/mes vs LA o Miami. Esa diferencia se acumula en $24,000–48,000/año en ahorros.',
        },
        image: 'photo-1585464231875-d9ef1f5ad396',
        tag: 'Viral', tagColor: ORANGE,
        cities: ['Los Angeles', 'Miami', 'CDMX'],
        slugs: ['los-angeles', 'miami', 'mexico-city'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$2,500–3,500', b: '$2,200–3,000', c: '$700–1,100', winner: 'b' },
            { category: 'Food / Comida', a: '$500–800', b: '$500–750', c: '$250–400', winner: 'b' },
            { category: 'Transport / Transporte', a: '$200+ (car)', b: '$150 (car)', c: '$25 (metro)', winner: 'b' },
            { category: 'Healthcare', a: 'Very expensive', b: 'Very expensive', c: 'Affordable', winner: 'b' },
            { category: 'Safety / Seguridad', a: '5.5/10', b: '5.8/10', c: '5.5/10', winner: 'b' },
            { category: 'Weather / Clima', a: 'Excellent', b: 'Excellent', c: 'Excellent', winner: 'tie' },
            { category: 'Food scene', a: 'World class', b: 'Excellent', c: 'World class', winner: 'tie' },
            { category: 'Total estimate', a: '$3,500–5,000', b: '$3,200–4,500', c: '$1,200–1,800', winner: 'b' },
        ],
        socials: [
            { en: 'LA rent: $3,200/month. Miami rent: $2,800/month. CDMX rent: $900/month. You do the math.', es: 'Alquiler en LA: $3,200/mes. Miami: $2,800/mes. CDMX: $900/mes. Vos hacés los números.' },
            { en: 'The 2026 smart move: earn a US salary on Zoom, live in Condesa or Roma Norte CDMX. $3,000/month difference straight to savings.', es: 'El movimiento inteligente de 2026: ganar sueldo americano por Zoom, vivir en Condesa o Roma Norte. $3,000/mes directo al ahorro.' },
            { en: 'Roma Norte vs Wynwood vs Silver Lake: same creative energy, same coffee culture, dramatically different rent. Pick wisely.', es: 'Roma Norte vs Wynwood vs Silver Lake: la misma energía creativa, la misma cultura cafetera, alquileres dramáticamente distintos.' },
        ],
        updated: 'April 2026',
    },
    'chiang-mai-vs-medellin': {
        en: {
            title: 'Chiang Mai vs Medellín 2026: Mountains, Coffee and $1,000/Month Living',
            subtitle: 'Asia\'s OG nomad hub vs Latin America\'s rising star.',
            keywords: 'chiang mai vs medellin cost of living, chiang mai digital nomads 2026, medellin expats cost, cheapest nomad cities',
            intro: 'Chiang Mai invented the digital nomad city. Medellín reinvented it. One sits in the mountains of northern Thailand surrounded by temples and the world\'s best value cafes. The other sits in the eternal spring of Colombia\'s Andes, having transformed from infamy to innovation in record time. In 2026, both cost under $1,500/month for a great lifestyle — but they\'re dramatically different experiences.',
            verdict: 'Chiang Mai wins on cost (30–40% cheaper), internet reliability, and established nomad infrastructure. Medellín wins on culture, food scene, and nightlife. Both are outstanding choices under $1,500/month.',
        },
        es: {
            title: 'Chiang Mai vs Medellín 2026: Montañas, Café y Vida por $1,000/Mes',
            subtitle: 'El hub nómada OG de Asia vs la estrella emergente de Latinoamérica.',
            intro: 'Chiang Mai inventó la ciudad nómada digital. Medellín la reinventó. Una está en las montañas del norte de Tailandia rodeada de templos y los mejores cafés del mundo. La otra está en la eterna primavera de los Andes colombianos, habiendo pasado de la infamia a la innovación en tiempo récord. En 2026, las dos cuestan menos de $1,500/mes para un excelente estilo de vida.',
            verdict: 'Chiang Mai gana en precio (30–40% más barata), internet y infraestructura nómada. Medellín gana en cultura, gastronomía y vida nocturna. Las dos son elecciones excepcionales por menos de $1,500/mes.',
        },
        image: 'photo-1596422846543-75c6fc197f07',
        tag: 'Budget Pick', tagColor: '#10b981',
        cities: ['Chiang Mai', 'Medellín'],
        slugs: ['chiang-mai', 'medellin'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '$350–600', b: '$500–800', winner: 'a' },
            { category: 'Food / Comida', a: '$200–350', b: '$300–450', winner: 'a' },
            { category: 'Coworking', a: '$80–150', b: '$100–200', winner: 'a' },
            { category: 'Internet', a: 'Excellent', b: 'Very good', winner: 'a' },
            { category: 'Safety / Seguridad', a: '7.5/10', b: '6.8/10', winner: 'a' },
            { category: 'Nightlife', a: 'Good', b: 'Excellent', winner: 'b' },
            { category: 'Food scene', a: 'Excellent', b: 'World class', winner: 'b' },
            { category: 'Total estimate', a: '$900–1,400', b: '$1,100–1,600', winner: 'a' },
        ],
        socials: [
            { en: 'Chiang Mai: $900/month. Medellín: $1,200/month. Both with great coworking and coffee. One with eternal spring, one with temple sunsets.', es: 'Chiang Mai: $900/mes. Medellín: $1,200/mes. Las dos con buen coworking y café. Una con primavera eterna, la otra con atardeceres en templos.' },
            { en: 'The two cheapest great cities for digital nomads in 2026: Chiang Mai and Medellín. Under $1,500/month in both.', es: 'Las dos ciudades baratas más geniales para nómadas en 2026: Chiang Mai y Medellín. Menos de $1,500/mes en ambas.' },
            { en: 'Asia vs LatAm budget nomad showdown. Chiang Mai is still 30% cheaper but Medellín\'s food scene is unmatched.', es: 'Asia vs LatAm: el showdown del presupuesto nómada. Chiang Mai sigue siendo 30% más barata, pero la gastronomía de Medellín es imbatible.' },
        ],
        updated: 'April 2026',
    },
    'lisbon-vs-tbilisi': {
        en: {
            title: 'Lisbon vs Tbilisi 2026: The New Nomad Visa Battle',
            subtitle: 'Portugal D8 vs Georgia 365-day free stay.',
            keywords: 'lisbon vs tbilisi cost of living, georgia digital nomad visa, portugal d8 visa, cheapest european nomad cities 2026',
            intro: 'Two years ago, nobody was comparing these cities. Today, it\'s one of the most searched nomad comparisons in 2026. Lisbon offers the D8 Digital Nomad Visa, Atlantic beaches, and European integration. Tbilisi offers something Lisbon can\'t match: 365-day visa-free stays for most nationalities, costs half of Lisbon, and a unique culture that\'s becoming one of the world\'s most talked-about expat destinations.',
            verdict: 'Tbilisi is 50–60% cheaper than Lisbon and offers unparalleled visa flexibility. Lisbon wins on EU integration, English prevalence, and lifestyle familiarity for Western expats. Budget nomads: Tbilisi. EU-seekers: Lisbon.',
        },
        es: {
            title: 'Lisboa vs Tbilisi 2026: La Nueva Batalla de las Visas Nómadas',
            subtitle: 'Portugal D8 vs Georgia 365 días de estadía libre.',
            intro: 'Hace dos años, nadie comparaba estas ciudades. Hoy es una de las comparaciones nómadas más buscadas de 2026. Lisboa ofrece la Visa Nómada Digital D8, playas atlánticas e integración europea. Tbilisi ofrece algo que Lisboa no puede igualar: estadías libres de visa de 365 días para la mayoría de nacionalidades, cuesta la mitad que Lisboa y tiene una cultura única que se convirtió en uno de los destinos expat más comentados del mundo.',
            verdict: 'Tbilisi es 50–60% más barata que Lisboa y ofrece una flexibilidad de visa sin igual. Lisboa gana en integración UE, prevalencia del inglés y familiaridad de estilo de vida para expats occidentales.',
        },
        image: 'photo-1524231757912-21f4fe3a7200',
        tag: 'Visa Guide', tagColor: GREEN,
        cities: ['Lisbon', 'Tbilisi'],
        slugs: ['lisbon', 'tbilisi'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: '€1,200–1,600', b: '$400–600', winner: 'b' },
            { category: 'Food / Comida', a: '€300–450', b: '$150–250', winner: 'b' },
            { category: 'Visa options', a: 'D8 (2yr)', b: '365 days free', winner: 'tie' },
            { category: 'Internet', a: '100 Mbps', b: '50–80 Mbps', winner: 'a' },
            { category: 'English spoken', a: 'Very good', b: 'Limited', winner: 'a' },
            { category: 'Safety / Seguridad', a: '8.4/10', b: '8.1/10', winner: 'a' },
            { category: 'EU access', a: 'Yes', b: 'No', winner: 'a' },
            { category: 'Total estimate', a: '€1,700–2,300', b: '$800–1,200', winner: 'b' },
        ],
        socials: [
            { en: 'Tbilisi: $900/month, 365-day visa-free, incredible food, growing nomad scene. Why isn\'t everyone talking about this?', es: 'Tbilisi: $900/mes, 365 días sin visa, comida increíble, escena nómada creciente. ¿Por qué nadie habla de esto?' },
            { en: 'Portugal D8 vs Georgia free stay: two of the best nomad visa options in 2026. We compared both cities in full.', es: 'Portugal D8 vs estadía libre en Georgia: dos de las mejores opciones de visa nómada en 2026.' },
            { en: 'Lisbon gets all the attention. Tbilisi gets all the value. 2026 nomad visa battle — full breakdown.', es: 'Lisboa recibe toda la atención. Tbilisi recibe todo el valor. La batalla de visas nómadas 2026.' },
        ],
        updated: 'April 2026',
    },
    'sydney-vs-melbourne': {
        en: {
            title: 'Sydney vs Melbourne 2026: Australia\'s Eternal Rivalry — By the Numbers',
            subtitle: 'Harbor city glam vs culture capital grit.',
            keywords: 'sydney vs melbourne cost of living 2026, live in sydney vs melbourne, australia cheapest city, expat australia 2026',
            intro: 'Australians have debated this for generations: Sydney or Melbourne? In 2026, the answer depends entirely on what you value. Sydney offers the harbor, the beaches, the Opera House, and the premium that comes with all of it. Melbourne delivers world-class coffee culture, a legendary food scene, and a creative energy that consistently ranks it among the world\'s most livable cities — at a slightly lower price.',
            verdict: 'Melbourne is marginally cheaper, particularly for rent in inner suburbs. Sydney wins on beaches, harbor lifestyle, and international profile. Both are expensive by global standards. The difference is real but not transformative — choose based on lifestyle fit, not just price.',
        },
        es: {
            title: 'Sydney vs Melbourne 2026: La Rivalidad Eterna de Australia — Por Números',
            subtitle: 'El glamour del puerto vs la energía cultural.',
            intro: 'Los australianos debaten esto hace generaciones: ¿Sydney o Melbourne? En 2026, la respuesta depende totalmente de qué valorás. Sydney ofrece el puerto, las playas, la Ópera y el precio premium que viene con todo eso. Melbourne entrega cultura cafetera de clase mundial, gastronomía legendaria y una energía creativa que la posiciona consistentemente entre las ciudades más habitables del mundo — a un precio levemente menor.',
            verdict: 'Melbourne es marginalmente más barata, especialmente en alquiler en suburbios interiores. Sydney gana en playas, estilo de vida portuario y perfil internacional. Las dos son caras para estándares globales.',
        },
        image: 'photo-1506973035872-a4ec16b8e8d9',
        tag: 'Oceania', tagColor: '#0ea5e9',
        cities: ['Sydney', 'Melbourne'],
        slugs: ['sydney', 'melbourne'],
        table: [
            { category: 'Rent 1BR / Alquiler', a: 'A$2,800–4,000', b: 'A$2,200–3,200', winner: 'b' },
            { category: 'Food / Comida', a: 'A$600–900', b: 'A$550–800', winner: 'b' },
            { category: 'Transport / Transporte', a: 'A$200', b: 'A$180', winner: 'b' },
            { category: 'Beaches / Playas', a: 'World class', b: 'Limited', winner: 'a' },
            { category: 'Coffee culture', a: 'Excellent', b: 'World class', winner: 'b' },
            { category: 'Safety / Seguridad', a: '7.8/10', b: '7.5/10', winner: 'a' },
            { category: 'International profile', a: 'Very high', b: 'High', winner: 'a' },
            { category: 'Total estimate (AUD)', a: 'A$3,800–5,500', b: 'A$3,200–4,800', winner: 'b' },
        ],
        socials: [
            { en: 'Sydney vs Melbourne: the debate that never ends. In 2026, Melbourne is about A$700/month cheaper. But Sydney has Bondi.', es: 'Sydney vs Melbourne: el debate que nunca termina. En 2026, Melbourne es A$700/mes más barata. Pero Sydney tiene Bondi.' },
            { en: 'Australia\'s two greatest cities compared with real 2026 data. Harbor city or culture capital? You decide.', es: 'Las dos ciudades más grandes de Australia comparadas con datos reales de 2026. ¿Ciudad portuaria o capital cultural?' },
            { en: 'Moving to Australia in 2026? The Sydney vs Melbourne decision matters — here\'s the full cost breakdown.', es: '¿Mudándote a Australia en 2026? La decisión Sydney vs Melbourne importa — acá está el desglose completo de costos.' },
        ],
        updated: 'April 2026',
    },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const a = ARTICLES[slug];
    if (!a) return { title: 'Not Found' };
    return {
        title: `${a.en.title} | RoamCost Hot Takes`,
        description: `${a.en.subtitle} | ${a.es.subtitle}`,
        keywords: a.en.keywords,
        alternates: { canonical: `https://www.roamcost.com/hot-takes/${slug}` },
        openGraph: { title: a.en.title, description: a.en.subtitle, url: `https://www.roamcost.com/hot-takes/${slug}`, type: 'article' },
    };
}

export function generateStaticParams() {
    return Object.keys(ARTICLES).map(slug => ({ slug }));
}

export default async function HotTakeArticle({ params }: Props) {
    const { slug } = await params;
    const a = ARTICLES[slug];
    if (!a) return notFound();

    const hasThree = a.table[0]?.c !== undefined;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Hero */}
            <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
                <img src={a.image.startsWith('local-') ? `/cities/${a.image.replace('local-', '')}.jpg` : `https://images.unsplash.com/${a.image}?auto=format&fit=crop&w=1400&h=380&q=80`}
                    alt={a.en.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 70%, transparent 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
                    <nav style={{ marginBottom: '1.25rem', fontSize: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Home</Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                        <Link href="/hot-takes" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Hot Takes</Link>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
                        <span style={{ color: 'white' }}>{a.cities.join(' vs ')}</span>
                    </nav>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: a.tagColor, color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '0.2rem 0.7rem', borderRadius: '2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{a.tag}</span>
                        <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.7rem', borderRadius: '2rem' }}>Updated {a.updated}</span>
                    </div>
                    <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: 'white', margin: '0 0 0.5rem', letterSpacing: '-0.03em', lineHeight: 1.15, maxWidth: '750px' }}>{a.en.title}</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', margin: 0 }}>{a.en.subtitle} · <em>{a.es.subtitle}</em></p>
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem', alignItems: 'start' }}>
                <article>
                    {/* City chips */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        {a.cities.map(c => (
                            <Link key={c} href={`/city/${c.toLowerCase().replace(/ /g, '-')}`}
                                style={{ backgroundColor: '#F0FAF4', color: GREEN, fontSize: '0.8rem', fontWeight: 800, padding: '0.4rem 1rem', borderRadius: '2rem', textDecoration: 'none', border: `1px solid ${GREEN}33` }}>
                                {c} →
                            </Link>
                        ))}
                    </div>

                    {/* EN intro */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#334155', margin: 0 }}>{a.en.intro}</p>
                    </div>

                    {/* ES intro */}
                    <div style={{ backgroundColor: '#fefdf7', borderRadius: '1rem', padding: '1.5rem 2rem', border: '1px solid #fef08a', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>En español</div>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: '#475569', margin: 0, fontStyle: 'italic' }}>{a.es.intro}</p>
                    </div>

                    {/* Comparison table */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '2rem' }}>
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: '#0f172a' }}>Cost Comparison / Comparación de costos</h2>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Category</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>{a.cities[0]}</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>{a.cities[1]}</th>
                                        {hasThree && <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.8rem', fontWeight: 900, color: '#0f172a' }}>{a.cities[2]}</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {a.table.map((row, i) => (
                                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '0.75rem 1.25rem', fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>{row.category}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: row.winner === 'a' ? 900 : 600, color: row.winner === 'a' ? GREEN : '#64748b', backgroundColor: row.winner === 'a' ? '#F0FAF4' : 'transparent' }}>{row.a}</td>
                                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: row.winner === 'b' ? 900 : 600, color: row.winner === 'b' ? GREEN : '#64748b', backgroundColor: row.winner === 'b' ? '#F0FAF4' : 'transparent' }}>{row.b}</td>
                                            {hasThree && <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.85rem', fontWeight: row.winner === 'b' ? 900 : 600, color: row.winner === 'b' ? GREEN : '#64748b', backgroundColor: row.winner === 'b' ? '#F0FAF4' : 'transparent' }}>{row.c}</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Verdict */}
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '2rem', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Our Verdict / Nuestro veredicto</div>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 1rem' }}>{a.en.verdict}</p>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>{a.es.verdict}</p>
                    </div>

                    {/* Social posts */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Share this take / Compartí esta opinión</div>
                        {a.socials.map((s, i) => (
                            <div key={i} style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '0.625rem', marginBottom: '0.75rem', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.4rem', fontSize: '0.82rem', color: '#0f172a', lineHeight: 1.5 }}>{s.en}</p>
                                <p style={{ margin: 0, fontSize: '0.77rem', color: '#64748b', lineHeight: 1.5, fontStyle: 'italic' }}>{s.es}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ backgroundColor: '#F0FAF4', borderRadius: '1rem', padding: '2rem', border: `1px solid ${GREEN}33`, textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>See the live data for these cities</h3>
                        <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.875rem' }}>Compare with your own lifestyle and budget on RoamCost</p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {a.slugs.slice(0, 2).map((s, i) => (
                                <Link key={s} href={`/city/${s}`}
                                    style={{ backgroundColor: i === 0 ? GREEN : 'white', color: i === 0 ? 'white' : GREEN, padding: '0.625rem 1.25rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem', border: `1px solid ${GREEN}` }}>
                                    {a.cities[i]} data →
                                </Link>
                            ))}
                            <Link href={`/compare/${a.slugs.slice(0, 2).join('-vs-')}`}
                                style={{ backgroundColor: '#0f172a', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.625rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>
                                Full comparison →
                            </Link>
                        </div>
                    </div>
                </article>

                {/* Sidebar */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>More Hot Takes</div>
                        {Object.entries(ARTICLES).filter(([s]) => s !== slug).slice(0, 5).map(([s, art]) => (
                            <Link key={s} href={`/hot-takes/${s}`} style={{ display: 'block', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{art.cities.join(' vs ')}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>{art.en.subtitle}</div>
                            </Link>
                        ))}
                        <Link href="/hot-takes" style={{ display: 'block', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 700, color: GREEN, textDecoration: 'none' }}>
                            See all comparisons →
                        </Link>
                    </div>

                    {/* Affiliate sidebar */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Plan your trip</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                            <a href={`https://www.awin1.com/cread.php?awinmid=105929&awinaffid=2865959&ued=${encodeURIComponent('https://www.trivago.com/?aDateless=1&search/200-' + (a.cities[0] || ''))}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', textDecoration: 'none' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                <div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Hotels in {a.cities[0]}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>Compare on Trivago</div>
                                </div>
                            </a>
                            <a href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(a.cities[0] || '')}&searchSource=1&partner_id=VVPTRVK`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: '#fff8f0', borderRadius: '0.75rem', textDecoration: 'none' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                                <div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Tours & Experiences</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>via GetYourGuide</div>
                                </div>
                            </a>
                            <a href={`https://www.awin1.com/cread.php?awinmid=18808&awinaffid=2865959&ued=${encodeURIComponent('https://www.rentalcars.com/?pickUpName=' + (a.cities[0] || ''))}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', backgroundColor: '#F0FAF4', borderRadius: '0.75rem', textDecoration: 'none' }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F7831E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                <div>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Rent a Car</div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748b' }}>via RentalCars</div>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '1.5rem' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: GREEN, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Tools / Herramientas</div>
                        {[
                            { href: '/compare', label: 'Compare any cities' },
                            { href: '/rankings/cheapest', label: 'Cheapest cities' },
                            { href: '/rankings/nomads', label: 'Best for nomads' },
                            { href: '/calculator', label: 'Currency converter' },
                            { href: '/rankings/safest', label: 'Safest cities' },
                        ].map(l => (
                            <Link key={l.href} href={l.href} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600 }}>
                                {l.label}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
