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

## Filtros en la vista de solicitudes de administrador

Desde la página **/admin/requests** los administradores pueden filtrar las solicitudes registradas. Los criterios disponibles son:

- **Entidad ID**: número identificador de la solicitud.
- **Fecha**: fecha en la que se creó la solicitud.
- **Usuario**: nombre o apellido de quien realizó la solicitud.
- **Equipo**: nombre del ítem solicitado.

Cada cambio en los filtros recarga la lista automáticamente mostrando solo las coincidencias.
