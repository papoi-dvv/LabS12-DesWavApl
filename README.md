# Biblioteca Digital

Aplicación de biblioteca construida con Next.js App Router para gestionar autores, libros, portadas y fotografías.

## Stack

- Next.js 16.2.7
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7 con `@prisma/adapter-pg`
- PostgreSQL, pensado para Supabase

## Requisitos

- Node.js `>=20.9.0`
- npm 10
- PostgreSQL accesible desde tu entorno local y desde Vercel

## Instalación Local

```bash
npm install
npx prisma generate
npm run dev
```

El servidor local queda en `http://localhost:3000`.

## Variables De Entorno

Crea un `.env` local y configura estas variables también en Vercel:

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

- `DATABASE_URL`: conexión usada por la app en runtime. Para Supabase, usa preferentemente el pooler.
- `DIRECT_URL`: conexión directa opcional para tareas administrativas como `db push` o seed.

No subas `.env` al repositorio. El `.gitignore` ya ignora `.env`, `.env.*` y `.vercel/`.

## Base De Datos

Generar Prisma Client:

```bash
npx prisma generate
```

Sincronizar el esquema en desarrollo:

```bash
npx prisma db push
```

Ejecutar seed:

```bash
npm run db:seed
```

El esquema está en `prisma/schema.prisma` y el seed en `prisma/seed.ts`.

## Scripts

```bash
npm run dev      # desarrollo local
npm run build    # prisma generate && next build
npm start        # producción local con next start
npm run lint     # ESLint
npm run db:seed  # carga datos iniciales
```

## Despliegue Manual En Vercel

Configuración recomendada en Vercel:

- Framework Preset: `Next.js`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: dejar vacío, Vercel detecta Next.js
- Node.js Version: 20.x o superior

El `package.json` ya está preparado para Vercel:

- `engines.node` exige `>=20.9.0`, requerido por Next 16.
- `packageManager` fija npm.
- `build` ejecuta `prisma generate` antes de `next build`.
- `@prisma/client`, `@prisma/adapter-pg` y `pg` están en `dependencies`, por lo que estarán disponibles en runtime.

Antes de desplegar:

1. Sube el proyecto a GitHub/GitLab/Bitbucket.
2. Importa el repositorio en Vercel.
3. Agrega `DATABASE_URL` y, si aplica, `DIRECT_URL` en Project Settings -> Environment Variables.
4. Ejecuta `npx prisma db push` y `npm run db:seed` desde tu máquina si quieres preparar la base antes del deploy.
5. Despliega desde Vercel.

## Notas De Prisma Y Supabase

La app crea el cliente Prisma en `src/lib/prisma.ts` usando `DATABASE_URL` primero y `DIRECT_URL` como respaldo. Esto evita que el runtime dependa de una conexión directa cuando conviene usar el pooler de Supabase.

Si ves errores `P1001`, revisa:

- Que `DATABASE_URL` esté definida en Vercel.
- Que el host y puerto de Supabase sean accesibles.
- Que el password no tenga caracteres sin escapar en la URL.
- Que estés usando el pooler para conexiones de runtime.

## Imágenes

- Placeholders locales: `public/images/books/placeholder.svg` y `public/images/authors/placeholder.svg`.
- La app acepta `imageUrl` o `imageData`.
- Para producción, es mejor usar Supabase Storage, S3 u otro almacenamiento y guardar solo la URL en la base.

## Estado De Calidad

`npx tsc --noEmit` debe pasar sin errores. `npm run lint` puede señalar deuda pendiente en rutas API si todavía hay tipos `any` o variables sin usar.
