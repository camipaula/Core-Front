<template>
    <div class="coordinator-panel">
        <h1>Bienvenido Coordinador</h1>
        <div class="button-group">
            <button @click="navigateTo('createProject')">Crear Proyecto</button>
            <button @click="navigateTo('manageProject')">Gestionar Proyectos</button>
            <button @click="navigateTo('manageTasks')">Gestionar Tareas</button>
            <button @click="navigateTo('productividad-empleado')">Revisar Productividad Empleado</button>
            <button @click="navigateTo('comparar-proyectos')">Comparar Proyectos</button>
            <button @click="navigateTo('avance-proyecto')">Generar Reportes</button>
            <button @click="navigateTo('filtrar')">Proyectos en progreso</button>
            <button @click="logout" class="logout-button">Cerrar Sesión</button>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        navigateTo(route) {
            this.$router.push(`/${route}`);
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            this.$router.push('/');
        }
    }
};
</script>

<style scoped>
/* Contenedor principal */
.coordinator-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f9;
    padding: 100px;
}

/* Título */
h1 {
    color: #333;
    margin-bottom: 30px;
}

/* Grupo de botones */
.button-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 400px;
}

/* Botones */
button {
    padding: 15px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:hover {
    background-color: #0056b3;
    transform: scale(1.02);
}

/* Botón de cerrar sesión */
.logout-button {
    background-color: #e74c3c;
}

.logout-button:hover {
    background-color: #c0392b;
}
</style>
