<template>
    <div class="productividad-container">
        <h2>Productividad del Empleado</h2>
        <button @click="goBack" class="back-button">Volver</button>

        <!-- Selección de Empleado -->
        <div class="form-group">
            <label for="empleado">Selecciona un Empleado:</label>
            <select v-model="empleadoId" @change="obtenerProductividad">
                <option value="" disabled>Seleccione un Empleado</option>
                <option v-for="empleado in empleados" :key="empleado.id" :value="empleado.id">
                    {{ empleado.nombre }}
                </option>
            </select>
        </div>

        <!-- Selección de Categoría -->
        <div class="form-group">
            <label for="categoria">Selecciona una Categoría (Opcional):</label>
            <select v-model="categoriaId" @change="obtenerProductividad">
                <option value="">Todas las Categorías</option>
                <option v-for="categoria in categorias" :key="categoria.id" :value="categoria.id">
                    {{ categoria.nombre }}
                </option>
            </select>
        </div>

        <!-- Selección de Proyecto -->
        <div class="form-group">
            <label for="proyecto">Selecciona un Proyecto (Opcional):</label>
            <select v-model="proyectoId" @change="obtenerProductividad">
                <option value="">Todos los Proyectos</option>
                <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
                    {{ proyecto.nombre }}
                </option>
            </select>
        </div>

        <!-- Información de Productividad -->
        <div v-if="productividadInfo">
            <p><strong>Total de Tareas:</strong> {{ productividadInfo.totalTareas || '0' }}</p>
            <p><strong>Total de Tareas Filtradas:</strong> {{ productividadInfo.totalTareasFiltradas || '0' }}</p>
            <p><strong>Tareas Completadas a Tiempo:</strong> {{ productividadInfo.tareasCompletadasATiempo || '0' }}</p>
            <p><strong>Productividad:</strong> 
                {{ productividadInfo.productividad !== undefined ? `${productividadInfo.productividad.toFixed(2)}%` : 'N/A' }}
            </p>

            <!-- Distribución de Categorías -->
            <div v-if="productividadInfo.distribucionCategorias && productividadInfo.distribucionCategorias.length > 0">
                <h3>Distribución por Categoría:</h3>
                <ul>
                    <li v-for="categoria in productividadInfo.distribucionCategorias" :key="categoria.categoria">
                        {{ categoria.categoria }}: {{ categoria.cantidad }} ({{ categoria.porcentaje.toFixed(2) }}%)
                    </li>
                </ul>
            </div>
                    <!-- Tareas con Retraso -->
            <div v-if="productividadInfo.tareasConRetraso && productividadInfo.tareasConRetraso.length > 0">
                <h3>Tareas con Retraso:</h3>
                <ul>
                    <li v-for="tarea in productividadInfo.tareasConRetraso" :key="tarea.nombre">
                        {{ tarea.nombre }}: {{ tarea.diasRetraso }} días de retraso
                    </li>
                </ul>
            </div>
        </div>
        <p v-else>No hay datos para mostrar. Seleccione un empleado y filtre según categoría o proyecto.</p>
    </div>
</template>

<script>
import apiClient from '../api';

export default {
    data() {
        return {
            empleadoId: '',
            categoriaId: '',
            proyectoId: '',
            empleados: [],
            categorias: [],
            proyectos: [],
            productividadInfo: null
        };
    },
    async mounted() {
        try {
            const empleadosResponse = await apiClient.get('/api/Usuario/GetEmpleados');
            this.empleados = empleadosResponse.data;

            const categoriasResponse = await apiClient.get('/api/Categoria');
            this.categorias = categoriasResponse.data;

            const proyectosResponse = await apiClient.get('/api/Proyecto');
            this.proyectos = proyectosResponse.data;
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    },
    methods: {
        async obtenerProductividad() {
            if (!this.empleadoId) {
                this.productividadInfo = null;
                return;
            }

            this.productividadInfo = null;

            try {
                const response = await apiClient.get(`/api/Tarea/ProductividadEmpleado/${this.empleadoId}`, {
                    params: {
                        categoriaId: this.categoriaId || null,
                        proyectoId: this.proyectoId || null
                    }
                });
                this.productividadInfo = response.data;
            } catch (error) {
                console.error("Error al obtener la productividad:", error);
            }
        },
        goBack() {
            this.$router.push('/coordinator');
        }
    }
};
</script>

<style scoped>
.productividad-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

select, button {
    padding: 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
}

button {
    background-color: #007bff;
    color: white;
    cursor: pointer;
    margin-top: 10px;
    font-weight: bold;
}

button:hover {
    background-color: #0056b3;
}

p {
    font-size: 16px;
    margin: 10px 0;
    color: #333;
}

ul {
    padding-left: 20px;
    color: #333;
}

ul li {
    font-size: 14px;
}
</style>
