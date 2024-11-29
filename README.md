# Core-Front - Frontend en Vue.js

Este repositorio contiene el frontend de la aplicación de gestión de tareas y proyectos, desarrollado en Vue.js. Esta aplicación permite a los usuarios autenticarse, visualizar y gestionar proyectos y tareas de acuerdo a su rol (Coordinador o Empleado).

## Tecnologías utilizadas
- **Vue.js** - Framework de frontend
- **Vue Router** - Manejo de rutas en la aplicación
- **Axios** - Librería para hacer peticiones HTTP
- **Bootstrap** - Framework CSS para estilos y diseño responsivo

## Instalación y Configuración

1. **Clona el repositorio**
     ```bash
     git clone https://github.com/camipaula/Core-Front.git
     cd Core-Front

2. **Instala las dependencias**
    ```bash
    npm install

3. **Configura la URL del backend**
Asegúrate de que el backend está en ejecución y copia su URL.
Abre el archivo de configuración de Axios (generalmente api.js o axiosConfig.js) y cambia la URL base para que apunte al backend.

4. **Ejecuta la aplicación**
    ```bash
    npm run serve
La aplicación estará disponible en http://localhost:8080.

**Estructura del proyecto**
src/components: Contiene los componentes reutilizables de la aplicación.
src/views: Contiene las vistas principales (Login, Panel de Coordinador, Panel de Empleado, etc.).
src/router: Configuración de las rutas de Vue Router.
src/api: Configuración de Axios para conectar con el backend.
src/store: Almacenamiento centralizado para manejar el estado de la aplicación.

**Funcionalidades**
Autenticación de usuarios: Login y logout con roles.
Gestión de Tareas: Visualización y edición de tareas según el rol.
Gestión de Proyectos: Creación, visualización y edición de proyectos.
