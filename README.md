# Inventario UNPHU

Este proyecto utiliza Next.js y Prisma. Sigue los pasos a continuacion para configurar el entorno de desarrollo.

## Configuracion del entorno

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Aplica la migración para los tokens de verificación de email y genera el cliente de Prisma:
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

## Confirmación de cuenta

Al registrarse, se genera un token de verificación único que se almacena en la tabla `EmailVerificationToken` y expira a las 24 horas. El correo de bienvenida incluye un enlace con este token. El usuario debe abrirlo para activar su cuenta.

Si el token es válido se marca la columna `confirmed` en `Usuario` y el registro del token se elimina.
