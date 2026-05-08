# Ejercicio 2 - Formulario con Supabase

## Setup

1. Clonar el repositorio
2. Instalar dependencias:
   npm install
3. Ejecutar el proyecto:
   npm run dev
4. Abrir en el navegador:
   http://localhost:5173

No es necesario configurar variables de entorno porque se utiliza la anon public key de Supabase directamente en el código.

---

## Decisiones técnicas

- Se ha usado **Vue 3 con Composition API** por su simplicidad y claridad.
- La validación del formulario se hace manualmente en una función (`validateForm`).
- Se ha utilizado **Supabase** como base de datos cloud para guardar y leer los datos.
- El campo **email** se utiliza para identificar al usuario y mostrar solo sus registros (sin sistema de login).
- La tabla incluye un campo `created_at` para poder ordenar las solicitudes por fecha.
- Se gestionan estados como:
  - envío (`isSubmitting`)
  - error (`submitError`)
  - éxito (`submitSuccess`)
- El listado se actualiza automáticamente después de cada inserción.

---

## Limitaciones

- No hay sistema de autenticación real.
- El usuario se identifica solo por el email introducido.
- No se ha implementado edición ni borrado de solicitudes.
- No hay validación en backend (solo en frontend).
