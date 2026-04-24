// Script: genera lista de ciudades sin foto
// Ejecutar: node scripts/cities-missing-photos.js

const fs   = require('fs');
const path = require('path');

// Ruta del proyecto (2 niveles arriba de este script)
const ROOT = path.join(__dirname, '..');

// ── 1. Leer cityImages.ts para saber qué slugs YA tienen foto ─────────────
const cityImagesTs = fs.readFileSync(
    path.join(ROOT, 'src', 'lib', 'cityImages.ts'), 'utf8'
);
const CURATED = new Set(
    [...cityImagesTs.matchAll(/'([a-z0-9][a-z0-9-]+)':\s*['"`h]/g)].map(m => m[1])
);

// ── 2. Lista completa de ciudades conocidas con su info ───────────────────
// Ordenadas por prioridad: rankings primero, luego por población
const ALL_CITIES = [
    // 10M+ — megaciudades sin foto
    {s:'jakarta',p:'10M+',city:'Jakarta',country:'Indonesia',pop:34400000},
    {s:'manila',p:'10M+',city:'Manila',country:'Philippines',pop:23088000},
    {s:'mumbai',p:'10M+',city:'Mumbai',country:'India',pop:21357000},
    {s:'chongqing',p:'10M+',city:'Chongqing',country:'China',pop:32000000},
    {s:'nanjing',p:'10M+',city:'Nanjing',country:'China',pop:9300000},
    {s:'hangzhou',p:'10M+',city:'Hangzhou',country:'China',pop:12000000},
    {s:'xi-an',p:'10M+',city:"Xi'an",country:'China',pop:13000000},
    {s:'shenyang',p:'10M+',city:'Shenyang',country:'China',pop:9100000},
    {s:'harbin',p:'10M+',city:'Harbin',country:'China',pop:10900000},
    {s:'kano',p:'10M+',city:'Kano',country:'Nigeria',pop:15900000},
    // ★ RANKING — aparecen en rankings
    {s:'amman',p:'★ RANKING',city:'Amman',country:'Jordan',pop:4500000},
    {s:'san-francisco',p:'★ RANKING',city:'San Francisco',country:'United States',pop:3300000},
    {s:'montreal',p:'★ RANKING',city:'Montreal',country:'Canada',pop:4200000},
    {s:'seattle',p:'★ RANKING',city:'Seattle',country:'United States',pop:4000000},
    {s:'boston',p:'★ RANKING',city:'Boston',country:'United States',pop:4900000},
    {s:'denver',p:'★ RANKING',city:'Denver',country:'United States',pop:2900000},
    {s:'atlanta',p:'★ RANKING',city:'Atlanta',country:'United States',pop:6100000},
    {s:'dallas',p:'★ RANKING',city:'Dallas',country:'United States',pop:7600000},
    {s:'kyiv',p:'★ RANKING',city:'Kyiv',country:'Ukraine',pop:2900000},
    {s:'san-jose',p:'★ RANKING',city:'San José',country:'Costa Rica',pop:1400000},
    {s:'valencia',p:'★ RANKING',city:'Valencia',country:'Spain',pop:1700000},
    // 5M+
    {s:'lahore',p:'5M+',city:'Lahore',country:'Pakistan',pop:13000000},
    {s:'karachi',p:'5M+',city:'Karachi',country:'Pakistan',pop:16000000},
    {s:'dhaka',p:'5M+',city:'Dhaka',country:'Bangladesh',pop:21000000},
    {s:'shenzhen',p:'5M+',city:'Shenzhen',country:'China',pop:13000000},
    {s:'guangzhou',p:'5M+',city:'Guangzhou',country:'China',pop:18000000},
    {s:'chengdu',p:'5M+',city:'Chengdu',country:'China',pop:9000000},
    {s:'wuhan',p:'5M+',city:'Wuhan',country:'China',pop:11000000},
    {s:'tianjin',p:'5M+',city:'Tianjin',country:'China',pop:14000000},
    {s:'hyderabad',p:'5M+',city:'Hyderabad',country:'India',pop:10000000},
    {s:'chennai',p:'5M+',city:'Chennai',country:'India',pop:10000000},
    {s:'pune',p:'5M+',city:'Pune',country:'India',pop:7400000},
    {s:'ahmedabad',p:'5M+',city:'Ahmedabad',country:'India',pop:8400000},
    {s:'kolkata',p:'5M+',city:'Kolkata',country:'India',pop:14800000},
    {s:'lagos',p:'5M+',city:'Lagos',country:'Nigeria',pop:15000000},
    {s:'kinshasa',p:'5M+',city:'Kinshasa',country:'Congo',pop:17000000},
    {s:'luanda',p:'5M+',city:'Luanda',country:'Angola',pop:8300000},
    {s:'dar-es-salaam',p:'5M+',city:'Dar es Salaam',country:'Tanzania',pop:7700000},
    {s:'khartoum',p:'5M+',city:'Khartoum',country:'Sudan',pop:6200000},
    {s:'addis-ababa',p:'5M+',city:'Addis Ababa',country:'Ethiopia',pop:5000000},
    {s:'tehran',p:'5M+',city:'Tehran',country:'Iran',pop:9200000},
    {s:'baghdad',p:'5M+',city:'Baghdad',country:'Iraq',pop:8200000},
    {s:'yangon',p:'5M+',city:'Yangon',country:'Myanmar',pop:7700000},
    {s:'ho-chi-minh-city',p:'5M+',city:'Ho Chi Minh City',country:'Vietnam',pop:9000000},
    {s:'guadalajara',p:'5M+',city:'Guadalajara',country:'Mexico',pop:5300000},
    {s:'monterrey',p:'5M+',city:'Monterrey',country:'Mexico',pop:5400000},
    {s:'caracas',p:'5M+',city:'Caracas',country:'Venezuela',pop:5200000},
    // 2M+
    {s:'houston',p:'2M+',city:'Houston',country:'United States',pop:7300000},
    {s:'phoenix',p:'2M+',city:'Phoenix',country:'United States',pop:5000000},
    {s:'detroit',p:'2M+',city:'Detroit',country:'United States',pop:3500000},
    {s:'minneapolis',p:'2M+',city:'Minneapolis',country:'United States',pop:3700000},
    {s:'san-diego',p:'2M+',city:'San Diego',country:'United States',pop:3300000},
    {s:'portland',p:'2M+',city:'Portland',country:'United States',pop:2500000},
    {s:'las-vegas',p:'2M+',city:'Las Vegas',country:'United States',pop:2200000},
    {s:'saint-petersburg',p:'2M+',city:'Saint Petersburg',country:'Russia',pop:5400000},
    {s:'cologne',p:'2M+',city:'Cologne',country:'Germany',pop:1100000},
    {s:'frankfurt',p:'2M+',city:'Frankfurt',country:'Germany',pop:750000},
    {s:'lyon',p:'2M+',city:'Lyon',country:'France',pop:1700000},
    {s:'marseille',p:'2M+',city:'Marseille',country:'France',pop:870000},
    {s:'antwerp',p:'2M+',city:'Antwerp',country:'Belgium',pop:530000},
    {s:'glasgow',p:'2M+',city:'Glasgow',country:'United Kingdom',pop:1800000},
    {s:'birmingham',p:'2M+',city:'Birmingham',country:'United Kingdom',pop:2900000},
    {s:'manchester',p:'2M+',city:'Manchester',country:'United Kingdom',pop:2800000},
    {s:'katowice',p:'2M+',city:'Katowice',country:'Poland',pop:2700000},
    {s:'lodz',p:'2M+',city:'Łódź',country:'Poland',pop:680000},
    {s:'lviv',p:'2M+',city:'Lviv',country:'Ukraine',pop:720000},
    {s:'kharkiv',p:'2M+',city:'Kharkiv',country:'Ukraine',pop:1400000},
    {s:'melbourne',p:'2M+',city:'Melbourne',country:'Australia',pop:5100000},
    {s:'brisbane',p:'2M+',city:'Brisbane',country:'Australia',pop:2600000},
    {s:'perth',p:'2M+',city:'Perth',country:'Australia',pop:2100000},
    {s:'calgary',p:'2M+',city:'Calgary',country:'Canada',pop:1600000},
    {s:'edmonton',p:'2M+',city:'Edmonton',country:'Canada',pop:1400000},
    {s:'ottawa',p:'2M+',city:'Ottawa',country:'Canada',pop:1400000},
    {s:'cali',p:'2M+',city:'Cali',country:'Colombia',pop:2200000},
    {s:'barranquilla',p:'2M+',city:'Barranquilla',country:'Colombia',pop:1200000},
    {s:'la-paz',p:'2M+',city:'La Paz',country:'Bolivia',pop:1900000},
    {s:'asuncion',p:'2M+',city:'Asunción',country:'Paraguay',pop:2300000},
    {s:'guayaquil',p:'2M+',city:'Guayaquil',country:'Ecuador',pop:2700000},
    {s:'busan',p:'2M+',city:'Busan',country:'South Korea',pop:3400000},
    {s:'daegu',p:'2M+',city:'Daegu',country:'South Korea',pop:2500000},
    {s:'chiang-mai',p:'2M+',city:'Chiang Mai',country:'Thailand',pop:1000000},
    {s:'almaty',p:'2M+',city:'Almaty',country:'Kazakhstan',pop:2000000},
    {s:'tashkent',p:'2M+',city:'Tashkent',country:'Uzbekistan',pop:2700000},
    {s:'baku',p:'2M+',city:'Baku',country:'Azerbaijan',pop:2300000},
    {s:'tbilisi',p:'2M+',city:'Tbilisi',country:'Georgia',pop:1200000},
    {s:'yerevan',p:'2M+',city:'Yerevan',country:'Armenia',pop:1100000},
    {s:'minsk',p:'2M+',city:'Minsk',country:'Belarus',pop:2000000},
    {s:'chisinau',p:'2M+',city:'Chișinău',country:'Moldova',pop:690000},
    {s:'skopje',p:'2M+',city:'Skopje',country:'North Macedonia',pop:540000},
    {s:'accra',p:'2M+',city:'Accra',country:'Ghana',pop:2500000},
    {s:'dakar',p:'2M+',city:'Dakar',country:'Senegal',pop:3700000},
    {s:'abuja',p:'2M+',city:'Abuja',country:'Nigeria',pop:3700000},
    {s:'nairobi',p:'2M+',city:'Nairobi',country:'Kenya',pop:4700000},
    {s:'kampala',p:'2M+',city:'Kampala',country:'Uganda',pop:3600000},
    {s:'tunis',p:'2M+',city:'Tunis',country:'Tunisia',pop:2700000},
    {s:'algiers',p:'2M+',city:'Algiers',country:'Algeria',pop:3400000},
    {s:'casablanca',p:'2M+',city:'Casablanca',country:'Morocco',pop:4300000},
    {s:'beirut',p:'2M+',city:'Beirut',country:'Lebanon',pop:2400000},
    {s:'muscat',p:'2M+',city:'Muscat',country:'Oman',pop:1600000},
    {s:'kuwait-city',p:'2M+',city:'Kuwait City',country:'Kuwait',pop:3100000},
    // Ciudades europeas frecuentes
    {s:'cologne',p:'EU',city:'Cologne',country:'Germany',pop:1085000},
    {s:'frankfurt',p:'EU',city:'Frankfurt',country:'Germany',pop:764000},
    {s:'stuttgart',p:'EU',city:'Stuttgart',country:'Germany',pop:634000},
    {s:'dusseldorf',p:'EU',city:'Düsseldorf',country:'Germany',pop:619000},
    {s:'leipzig',p:'EU',city:'Leipzig',country:'Germany',pop:587000},
    {s:'bremen',p:'EU',city:'Bremen',country:'Germany',pop:566000},
    {s:'nuremberg',p:'EU',city:'Nuremberg',country:'Germany',pop:515000},
    {s:'nice',p:'EU',city:'Nice',country:'France',pop:942000},
    {s:'toulouse',p:'EU',city:'Toulouse',country:'France',pop:967000},
    {s:'nantes',p:'EU',city:'Nantes',country:'France',pop:670000},
    {s:'strasbourg',p:'EU',city:'Strasbourg',country:'France',pop:790000},
    {s:'bordeaux',p:'EU',city:'Bordeaux',country:'France',pop:810000},
    {s:'birmingham',p:'EU',city:'Birmingham',country:'United Kingdom',pop:2900000},
    {s:'manchester',p:'EU',city:'Manchester',country:'United Kingdom',pop:2800000},
    {s:'glasgow',p:'EU',city:'Glasgow',country:'United Kingdom',pop:1800000},
    {s:'leeds',p:'EU',city:'Leeds',country:'United Kingdom',pop:1900000},
    {s:'liverpool',p:'EU',city:'Liverpool',country:'United Kingdom',pop:900000},
];

// ── 3. Filtrar los que ya tienen foto ─────────────────────────────────────
const missing = ALL_CITIES.filter(c => !CURATED.has(c.s));

// ── 4. Mostrar en consola ─────────────────────────────────────────────────
console.log('\n=== CIUDADES SIN FOTO CURADA ===\n');
console.log('PRIORIDAD    SLUG                           CIUDAD                    PAÍS');
console.log('─'.repeat(90));

for (const c of missing) {
    const prio = c.p.padEnd(12);
    const slug = c.s.padEnd(30);
    const city = c.city.padEnd(26);
    console.log(`${prio} ${slug} ${city} ${c.country}`);
}

console.log(`\nTotal sin foto: ${missing.length}`);
console.log(`Fotos curadas:  ${CURATED.size}`);

// ── 5. Guardar archivos ───────────────────────────────────────────────────
const lines = ['PRIORIDAD,SLUG,CIUDAD,PAÍS,POBLACIÓN'];
for (const c of missing) {
    lines.push(`${c.p},${c.s},"${c.city}","${c.country}",${c.pop.toLocaleString()}`);
}
const csvPath = path.join(__dirname, 'cities-missing-photos.csv');
fs.writeFileSync(csvPath, lines.join('\n'), 'utf8');

const txt = [
    '=== CIUDADES SIN FOTO — INSTRUCCIONES ===',
    '',
    'CARPETA: ROAMCOST/public/cities/',
    'NOMBRE:  [slug].jpg   (exactamente como aparece en columna SLUG)',
    'TAMAÑO:  1200 x 750 px mínimo',
    'FORMATO: JPG, calidad 80-90%',
    'FOTO:    Skyline, vista aérea o landmark — SIN personas en primer plano',
    '         1 sola foto por ciudad',
    '',
    'CUANDO TENGAS LAS FOTOS decile al chat:',
    '  "Subí fotos a public/cities/ para: amman, seattle, kyiv',
    '   Actualizá src/lib/cityImages.ts"',
    '',
    'PRIORIDAD    SLUG                           CIUDAD                    PAÍS',
    '─'.repeat(90),
    ...missing.map(c => `${c.p.padEnd(12)} ${c.s.padEnd(30)} ${c.city.padEnd(26)} ${c.country}`),
];
fs.writeFileSync(path.join(__dirname, 'cities-missing-photos.txt'), txt.join('\n'), 'utf8');

console.log(`\n✓ scripts/cities-missing-photos.csv`);
console.log(`✓ scripts/cities-missing-photos.txt`);
console.log('\n=== INSTRUCCIONES ===');
console.log('Carpeta: ROAMCOST/public/cities/');
console.log('Nombre:  [slug].jpg  (ej: amman.jpg, seattle.jpg)');
console.log('Tamaño:  1200x750px mínimo, JPG, skyline/vista aérea');
