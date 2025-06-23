# Inventario UNPHU

Este proyecto utiliza Next.js y Prisma. Sigue los pasos a continuacion para configurar el entorno de desarrollo.

## Configuracion del entorno

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
3. Ejecuta las migraciones (si existen) y levanta el servidor de desarrollo:
   ```bash
   npx prisma migrate dev # opcional si hay migraciones pendientes
   npm run dev
   ```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores antes de iniciar la aplicacion.
