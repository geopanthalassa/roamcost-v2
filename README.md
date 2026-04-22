# RoamCost — Proyecto Corregido y Mejorado
## Generado por Claude · Abril 2026

---

## 📦 Qué hay en este ZIP

Este ZIP contiene la carpeta `src` completa + `.env.local` + `package.json` corregidos y listos para reemplazar en tu proyecto.

---

## 🚀 Cómo instalar — 3 pasos

### Paso 1 — Reemplazá la carpeta src
```
1. Abrí: C:\Users\andre\Desktop\PROYECTOS_GRAVITY\ROAMCOST
2. Borrá la carpeta "src" existente (o renombrá a "src_backup")
3. Copiá la carpeta "src" de este ZIP en su lugar
```

### Paso 2 — Reemplazá el .env.local
```
1. En la raíz del proyecto (ROAMCOST\), borrá el .env.local existente
2. Copiá el .env.local de este ZIP
```

### Paso 3 — Probá localmente
```bash
npm run dev
```
Abrí http://localhost:3000 y verificá:
- /city/tokyo → ✅ carga sin spinner, muestra todos los datos
- /compare → ✅ buscador funciona
- /about → ✅ página nueva (antes era 404)
- /contact → ✅ formulario visible
- /sitemap.xml → ✅ lista todas las ciudades

---

## ✅ Qué se corrigió

| Archivo | Problema | Solución |
|---|---|---|
| `city/[slug]/page.tsx` | `'use client'` → Google veía solo spinner | Convertido a Server Component |
| `compare/[slugs]/page.tsx` | `'use client'` → Google veía solo spinner | Convertido a Server Component |
| `cost-of-living-in-[city]/page.tsx` | Importaba componente cliente roto | Redirige limpio a /city/[slug] |
| `layout.tsx` | Sin metadatos SEO globales | OpenGraph, Twitter, robots agregados |
| `CurrencyContext.tsx` | Rates estáticos desactualizados | Conectado a ExchangeRate API en vivo |
| `CityCard.tsx` | Sin detalles de safety/internet | Badges de safety e internet agregados |
| `Header.tsx` | Faltaba link /about | Link About agregado + más monedas |
| `Footer.tsx` | Links rotos (/nomads) | Todos los links corregidos |

## ✅ Qué se agregó

| Archivo | Descripción |
|---|---|
| `app/about/page.tsx` | Página About nueva (antes 404) |
| `app/contact/page.tsx` | Formulario de contacto |
| `app/privacy/page.tsx` | Política de privacidad |
| `components/CurrencyDisplay.tsx` | Conversión de moneda inline en páginas de ciudad |
| Sección de viajes en city page | Booking.com + Kiwi.com + Airbnb |
| Schema.org JSON-LD | SEO estructurado en cada ciudad |
| Ciudades relacionadas | "Other cities in [country]" al pie de cada ciudad |

---

## 💰 Monetización — Próximo paso

Para activar las comisiones de afiliados, registrate en:

1. **Booking.com Affiliate** → https://www.booking.com/affiliate-program
   - Una vez aprobado, reemplazá la URL en `city/[slug]/page.tsx`
   - Buscá `booking.com/searchresults` y agregá `&aid=TU_AFFILIATE_ID`

2. **Kiwi.com Partners** → https://partners.kiwi.com

3. **Airbnb Associates** → https://www.airbnb.com/associates

---

## 📊 Google Search Console — Indexación

Después de hacer deploy:
1. Entrá a https://search.google.com/search-console
2. Agregá propiedad: `roamcost.com`
3. Verificá el dominio
4. Andá a Sitemaps → agregá: `https://www.roamcost.com/sitemap.xml`
5. Google empezará a indexar todas las ciudades en 1-7 días

---

## 🌎 Expandir ciudades — SQL para Supabase

Para agregar ciudades de LATAM que faltan, ejecutá esto en tu Supabase SQL editor:

```sql
INSERT INTO cities_master 
(city, country, slug, lat, lng, population, rent_index, food_index, transport_index, utilities_index, entertainment_index, cost_index, safety, healthcare, internet, environment, commute, leisure, outdoors)
VALUES
('Buenos Aires', 'Argentina', 'buenos-aires', -34.6037, -58.3816, 3120612, 18, 12, 8, 10, 8, 42, 5.2, 6.5, 25, 5.8, 6, 7.5, 6),
('Bogotá', 'Colombia', 'bogota', 4.7110, -74.0721, 7181469, 14, 10, 6, 9, 7, 35, 4.8, 6.0, 20, 5.5, 5, 7, 7),
('Medellín', 'Colombia', 'medellin', 6.2476, -75.5658, 2533424, 12, 9, 5, 8, 8, 32, 5.5, 6.5, 30, 7, 5, 8, 8),
('Santiago', 'Chile', 'santiago', -33.4489, -70.6693, 5614000, 22, 14, 9, 11, 9, 52, 5.8, 7.0, 40, 6.2, 5, 7, 7),
('Lima', 'Peru', 'lima', -12.0464, -77.0428, 9751717, 16, 11, 7, 9, 7, 38, 4.5, 5.5, 18, 5.0, 6, 6.5, 6),
('Ciudad de México', 'Mexico', 'ciudad-de-mexico', 19.4326, -99.1332, 9209944, 20, 12, 7, 10, 9, 48, 4.2, 6.5, 35, 5.5, 7, 8, 6),
('Lisboa', 'Portugal', 'lisboa', 38.7223, -9.1393, 505526, 45, 22, 18, 20, 15, 95, 7.8, 7.5, 80, 7.5, 5, 8.5, 7),
('Barcelona', 'Spain', 'barcelona', 41.3851, 2.1734, 1620343, 55, 25, 20, 22, 18, 115, 6.5, 7.5, 90, 7.8, 5, 9, 8),
('Berlín', 'Germany', 'berlin', 52.5200, 13.4050, 3769495, 60, 28, 22, 25, 20, 125, 8.0, 8.5, 100, 8.0, 5, 8.5, 7),
('Bangkok', 'Thailand', 'bangkok', 13.7563, 100.5018, 10156000, 22, 8, 6, 7, 10, 42, 6.0, 6.5, 50, 6.0, 5, 8, 7),
('Bali (Denpasar)', 'Indonesia', 'bali-denpasar', -8.6705, 115.2126, 897300, 15, 7, 5, 6, 8, 30, 6.5, 5.5, 25, 8.5, 4, 9, 10),
('Dubai', 'United Arab Emirates', 'dubai', 25.2048, 55.2708, 3331420, 70, 30, 20, 18, 20, 140, 8.5, 8.0, 100, 7.0, 4, 8, 6);
```
