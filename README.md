# Next API Routes — Biblioteca

Proyecto de ejemplo que combina API y UI (Next.js App Router) para gestionar autores y libros.

Tecnologías principales
- Next.js 15 (App Router)
- TypeScript
- Prisma v7
- PostgreSQL (ej. Supabase)
- Tailwind CSS

Estructura relevante
- `src/app/` — rutas App Router (páginas y API)
- `src/lib/prisma.ts` — singleton PrismaClient (usa adapter `@prisma/adapter-pg` + `pg` Pool)
- `prisma/schema.prisma` — esquema de la base de datos
- `prisma.config.ts` — configuración de Prisma (migraciones/seed)
- `prisma/seed.ts` — script de seed (genera autores y libros)
- `public/images/books/` — portadas locales (placeholder incluido)
- `public/images/authors/` — fotos de autores (placeholder incluido)

Requisitos
- Node.js 18+ (recomendado)
- PostgreSQL accesible (Supabase u otro)

Instalación
```bash
npm install
```

Variables de entorno (ejemplo en `.env`)
- `DATABASE_URL` — URL de conexión usada en runtime (puede apuntar al pooler de Supabase)
- `DIRECT_URL` — (opcional) URL directa para operaciones de migración/seed cuando uses pooler
- `NEXT_PUBLIC_APP_URL` — URL base usada por algunas llamadas `fetch` en Server Components (ej. http://localhost:3000)

Prisma (generar cliente / sincronizar esquema / seed)
```bash
# Generar cliente
npx prisma generate

# Aplicar esquema (db push)
npx prisma db push

# Ejecutar seed (usa prisma.config.ts -> prisma/seed.ts)
npx prisma db seed
```

Notas importantes sobre Prisma v7
- Prisma v7 usa un motor "client" que requiere una opción de runtime: `adapter` (recomendado) o `accelerateUrl`.
- Este repositorio incluye `src/lib/prisma.ts` que crea un `pg` Pool y pasa `@prisma/adapter-pg` como `adapter`.
- Si ves `PrismaClientInitializationError: PrismaClient needs to be constructed with a non-empty, valid PrismaClientOptions`, instala:
```bash
npm i @prisma/adapter-pg pg
```
- Si el seed falla por timeouts con Supabase pooler, prueba usar la `DIRECT_URL` (puerto 5432) o ejecutar el seed desde una red con salida a Internet sin restricciones.

Ejecución en desarrollo
```bash
npm run dev
```

Build y producción
```bash
npm run build
npm start
```

Carpeta de imágenes estáticas
- Guarda portadas en: `public/images/books/`
- Guarda fotos de autores en: `public/images/authors/`
- Placeholders incluidos: `public/images/books/placeholder.svg` y `public/images/authors/placeholder.svg`.

UI / Estilos
- El proyecto usa Tailwind y sigue la guía en `Estilos.md` (paleta ámbar/índigo, `rounded-xl`, `rounded-full`, tarjetas con `shadow-sm` / `hover:shadow-lg`).

Problemas comunes y soluciones rápidas
- Error P2002 (unique constraint): el seed usa upsert para evitar duplicados; si ocurre, revisa los datos de entrada.
- ETIMEDOUT / Connection terminated: revisa que la URL de `DATABASE_URL` sea la correcta y que la red permita conexión al host/puerto.
- Si Prisma se queja del adapter, confirma que tienes `@prisma/adapter-pg` y `pg` instalados.

Contribuir
- Crear ramas por funcionalidad y abrir PRs. Mantener componentes pequeños y bien tipados.

Más información
- Consulta `Estilos.md`, los archivos bajo `src/components` y `src/app` para ver implementaciones y patrones usados.
