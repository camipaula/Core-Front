<template>
    <div class="filter-tasks-container">
        <h2>Reporte de Tareas Pendientes</h2>
        <button @click="goBack" class="back-button">Volver</button>

        <!-- Filtros de rango de fechas -->
        <div class="form-group">
            <label>Fecha Inicio Desde</label>
            <input type="date" v-model="fechaInicioDesde" required />
        </div>

        <div class="form-group">
            <label>Fecha Inicio Hasta</label>
            <input type="date" v-model="fechaInicioHasta" required />
        </div>

        <!-- Botón para filtrar -->
        <button @click="filtrarTareas" class="submit-button">Filtrar</button>

        <!-- Tabla de resultados -->
        <div v-if="tareas.length > 0">
            <h3>Resultados</h3>
            <table class="results-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Empleado</th>
                        <th>Proyecto</th>
                        <th>Categoría</th>
                        <th>Fecha Inicio</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tarea in tareas" :key="tarea.id">
                        <td>{{ tarea.nombre }}</td>
                        <td>{{ tarea.descripcion }}</td>
                        <td>{{ tarea.usuarioNombre }}</td>
                        <td>{{ tarea.proyectoNombre }}</td>
                        <td>{{ tarea.categoriaNombre }}</td>
                        <td>{{ tarea.fechaInicio }}</td>
                        <td>{{ tarea.statusNombre }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="no-results">No se encontraron tareas pendientes para el rango de fechas seleccionado.</p>
    </div>
</template>
<script>
import apiClient from '../api';

export default {
    data() {
        return {
            fechaInicioDesde: '', // Fecha de inicio desde
            fechaInicioHasta: '', // Fecha de inicio hasta
            tareas: [] // Lista de tareas filtradas
        };
    },
    methods: {
        async filtrarTareas() {
            if (!this.fechaInicioDesde || !this.fechaInicioHasta) {
                alert("Por favor, seleccione un rango de fechas válido.");
                return;
            }

            const token = localStorage.getItem('token');

            // Asegúrate de construir el formato que espera el backend (sin zona horaria)
            const fechaInicioDesdeFormatted = `${this.fechaInicioDesde}T00:00:00.0000000`;
            const fechaInicioHastaFormatted = `${this.fechaInicioHasta}T23:59:59.9999999`;

            try {
                const response = await apiClient.get('/api/Tarea/pendientesPorRangoFechas', {
                    params: {
                        fechaInicio: fechaInicioDesdeFormatted,
                        fechaFin: fechaInicioHastaFormatted
                    },
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.tareas = response.data;
            } catch (error) {
                console.error("Error al filtrar tareas:", error);
                alert("Ocurrió un error al filtrar las tareas. Intente nuevamente.");
            }
        },

        goBack() {
            this.$router.push('/manageTasks');
        }
    }
};
</script>
<style scoped>
.filter-tasks-container {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.back-button {
    align-self: flex-start;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
    background-color: #c0c0c0;
}

.form-group {
    margin-bottom: 15px;
}

input[type="date"] {
    padding: 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

.submit-button {
    padding: 12px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
}

.submit-button:hover {
    background-color: #0056b3;
    transform: scale(1.02);
}

.results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    font-size: 16px;
}

.results-table th,
.results-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.results-table th {
    background-color: #f4f4f4;
    font-weight: bold;
}

.no-results {
    text-align: center;
    margin-top: 20px;
    color: #555;
    font-size: 16px;
}
</style>
