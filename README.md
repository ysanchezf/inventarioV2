# Inventario UNPHU

Este proyecto utiliza Next.js y Prisma. Sigue los pasos a continuacion para configurar el entorno de desarrollo.

## Configuracion del entorno

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Aplica la migración `add_password_reset_token` y genera el cliente de Prisma:
   ```bash
   npx prisma migrate dev
   # si la migración ya está aplicada puedes solo generar el cliente con:
   npx prisma generate
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno

Copia `.env.example` a `.env` y ajusta los valores antes de iniciar la aplicacion.
