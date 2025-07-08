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
La variable `NEXT_PUBLIC_IDLE_TIMEOUT_MINUTES` controla los minutos de inactividad antes de cerrar la sesión automaticamente (30 por defecto).

## Configurar OAuth de Google

1. Crea un proyecto en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilita el inicio de sesión y crea credenciales OAuth 2.0.
3. Usa `http://localhost:3000/api/auth/callback/google` como URI de redirección autorizada.
4. Guarda el Client ID y Client Secret en `.env` como `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`.
5. Define los alcances en `GOOGLE_OAUTH_SCOPES` (consulta los [scopes disponibles](https://developers.google.com/identity/protocols/oauth2/scopes)).
6. Ejecuta `npx prisma migrate dev` para crear la tabla `Account`.

## Confirmación de cuenta

Al registrarse, se genera un token de verificación único que se almacena en la tabla `EmailVerificationToken` y expira a las 24 horas. El correo de bienvenida incluye un enlace con este token. El usuario debe abrirlo para activar su cuenta.

Si el token es válido se marca la columna `confirmed` en `Usuario` y el registro del token se elimina.

## Deployment

El script de construccion ejecuta `prisma generate` para crear el cliente de Prisma. En Vercel se deben definir `DATABASE_URL` y demas variables de entorno antes de compilar.


## Generar el diagrama ERD

Para crear el diagrama de entidad-relacion de forma local instala el generador y ejecutalo manualmente:

```bash
npm install -D prisma-erd-generator @mermaid-js/mermaid-cli
npx prisma-erd-generator --schema prisma/schema.prisma --output prisma/ERD.svg --format svg --puppeteerConfig ./puppeteerConfig.json
```

Se generara `prisma/ERD.svg` con el modelo actual.

