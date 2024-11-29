<template>
    <div class="tasks-container">
        <h2>Tareas Pendientes</h2>
        <table class="tasks-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Fecha Estimada</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tarea in tareasPendientes" :key="tarea.id">
                    <td>{{ tarea.nombre }}</td>
                    <td>{{ tarea.descripcion }}</td>
                    <td>{{ tarea.categoriaNombre }}</td>
                    <td>{{ new Date(tarea.fechaEstimada).toLocaleDateString('es-ES') }}</td>
                    <td>
                        <select v-model="tarea.statusId" class="status-select">
                            <option v-for="estado in estados" :value="estado.id" :key="estado.id">
                                {{ estado.nombre }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <button @click="guardarCambios(tarea)" class="save-button">Guardar Cambios</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <h2>Tareas Completadas</h2>
        <table class="tasks-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Categoría</th>
                    <th>Fecha Estimada</th>
                    <th>Fecha Real</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="tarea in tareasCompletadas" :key="tarea.id">
                    <td>{{ tarea.nombre }}</td>
                    <td>{{ tarea.descripcion }}</td>
                    <td>{{ tarea.categoriaNombre }}</td>
                    <td>{{ new Date(tarea.fechaEstimada).toLocaleDateString('es-ES') }}</td>
                    <td>{{ new Date(tarea.fechaReal).toLocaleDateString('es-ES') }}</td>
                </tr>
            </tbody>
        </table>

        <p v-if="mensajeExito" class="mensaje-exito">{{ mensajeExito }}</p>
        <button @click="goBack" class="back-button">Volver</button>
    </div>
</template>


<script>
import apiClient from '../api';

export default {
    data() {
        return {
            tareasPendientes: [],
            tareasCompletadas: [],
            estados: [],
            mensajeExito: ''
        };
    },
    async created() {
        const usuarioId = localStorage.getItem('usuarioId');
        try {
            // Obtener tareas pendientes
            const pendientesResponse = await apiClient.get(`/api/Tarea/pendientes/${usuarioId}`);
            this.tareasPendientes = pendientesResponse.data;

            // Obtener tareas completadas
            const completadasResponse = await apiClient.get(`/api/Tarea/completadas/${usuarioId}`);
            this.tareasCompletadas = completadasResponse.data;

            // Obtener lista de estados
            const estadosResponse = await apiClient.get('/api/Status');
            this.estados = estadosResponse.data;
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    },
    methods: {
        async guardarCambios(tarea) {
            const token = localStorage.getItem('token');

            try {
                await apiClient.put(`/api/Tarea/updateStatus/${tarea.id}`, {
                    statusId: tarea.statusId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.mensajeExito = `Cambios guardados para la tarea: ${tarea.nombre}`;
                
                // Eliminar mensaje después de 3 segundos
                setTimeout(() => {
                    this.mensajeExito = '';
                }, 3000);
            } catch (error) {
                console.error("Error al actualizar el estado de la tarea:", error);
            }
        },
        goBack() {
            this.$router.push('/employee');
        }
    }
};
</script>


<style scoped>
.tasks-container {
    padding: 20px;
    background-color: #f4f4f9;
    min-height: 100vh;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
    font-size: 24px;
}

.tasks-table {
    width: 100%;
    max-width: 800px;
    margin: 20px auto;
    border-collapse: collapse;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.tasks-table th, .tasks-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.tasks-table th {
    background-color: #007bff;
    color: #fff;
    font-weight: bold;
}

.tasks-table tbody tr:hover {
    background-color: #f2f2f2;
}

.status-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    width: 100%;
}

.save-button {
    padding: 8px 12px;
    font-size: 14px;
    color: #fff;
    background-color: #28a745;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-weight: bold;
}

.save-button:hover {
    background-color: #218838;
}

.mensaje-exito {
    color: green;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
}

.back-button {
    display: inline-block;
    margin-top: 20px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.back-button:hover {
    background-color: #0056b3;
}
</style>
