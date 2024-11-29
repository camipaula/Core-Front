<template>
    <div class="create-task-container">
        <h2>Crear Tarea</h2>
        <button @click="goBack" class="back-button">Volver</button>
        <form @submit.prevent="crearTarea" class="task-form">
            <!-- Nombre de la Tarea -->
            <div class="form-group">
                <input type="text" v-model="nombre" placeholder="Nombre de la Tarea" required />
            </div>

            <!-- Descripción de la Tarea -->
            <div class="form-group">
                <input type="text" v-model="descripcion" placeholder="Descripción de la Tarea" required />
            </div>

            <!-- Combobox de Categoría -->
            <div class="form-group">
                <select v-model="categoriaId" required>
                    <option value="" disabled>Selecciona una Categoría</option>
                    <option v-for="categoria in categorias" :value="categoria.id" :key="categoria.id">
                        {{ categoria.nombre }}
                    </option>
                </select>
            </div>

            <!-- Mostrar rango de fechas del proyecto -->
            <div v-if="proyecto">
                <p><strong>Rango de Fechas del Proyecto:</strong> {{ proyecto.fechaInicio }} - {{ proyecto.fechaFin }}</p>
            </div>

            <!-- Fecha de Inicio -->
            <div class="form-group">
                <label>Fecha de Inicio</label>
                <input 
                    type="date" 
                    v-model="fechaInicio" 
                    required 
                    :class="{ 'invalid-date': !isFechaInicioValida }"
                />
                <p v-if="!isFechaInicioValida" class="error-message">
                    La fecha de inicio debe estar entre {{ proyecto.fechaInicio }} y {{ proyecto.fechaFin }}.
                </p>
            </div>

            <!-- Fecha Estimada de Completación -->
            <div class="form-group">
                <label>Fecha Estimada de Completación</label>
                <input 
                    type="date" 
                    v-model="fechaEstimada" 
                    required 
                    :class="{ 'invalid-date': !isFechaEstimadaValida }"
                />
                <p v-if="!isFechaEstimadaValida" class="error-message">
                    La fecha estimada debe ser posterior a la fecha de inicio y estar dentro del rango {{ proyecto.fechaInicio }} - {{ proyecto.fechaFin }}.
                </p>
            </div>

            <!-- Combobox de Empleado Responsable -->
            <div class="form-group">
                <select v-model="usuarioId" required>
                    <option value="" disabled>Selecciona un Empleado</option>
                    <option v-for="usuario in empleados" :value="usuario.id" :key="usuario.id">
                        {{ usuario.nombre }}
                    </option>
                </select>
            </div>

            <!-- Botón para Crear Tarea -->
            <button type="submit" class="submit-button">Crear Tarea</button>
        </form>
    </div>
</template>

<script>
import apiClient from '../api';

export default {
    data() {
        return {
            nombre: '',
            descripcion: '',
            categoriaId: '',
            fechaInicio: '',
            fechaEstimada: '',
            usuarioId: '',
            empleados: [],
            categorias: [],
            proyecto: null, // Detalles del proyecto seleccionado
            isFechaInicioValida: true, // Validar la fecha de inicio
            isFechaEstimadaValida: true // Validar la fecha estimada
        };
    },
    async created() {
        const token = localStorage.getItem('token');
        const proyectoId = this.$route.params.projectId; // ID del proyecto desde la ruta

        try {
            // Cargar categorías
            const categoriasResponse = await apiClient.get('/api/Categoria', {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.categorias = categoriasResponse.data;

            // Cargar empleados
            const empleadosResponse = await apiClient.get('/api/Usuario/GetEmpleados', {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.empleados = empleadosResponse.data;

            // Cargar datos del proyecto
            const proyectoResponse = await apiClient.get(`/api/Proyecto/${proyectoId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.proyecto = proyectoResponse.data;
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    },
    watch: {
        // Validar fecha de inicio
        fechaInicio(newFechaInicio) {
            if (this.proyecto) {
                const fechaInicioProyecto = new Date(this.proyecto.fechaInicio);
                const fechaFinProyecto = new Date(this.proyecto.fechaFin);
                const fechaIngresada = new Date(newFechaInicio);

                this.isFechaInicioValida = fechaIngresada >= fechaInicioProyecto && fechaIngresada <= fechaFinProyecto;

                // También validar la fecha estimada si ya fue seleccionada
                if (this.fechaEstimada) {
                    const fechaEstimadaIngresada = new Date(this.fechaEstimada);
                    this.isFechaEstimadaValida = fechaEstimadaIngresada > fechaIngresada && fechaEstimadaIngresada <= fechaFinProyecto;
                }
            }
        },
        // Validar fecha estimada
        fechaEstimada(newFechaEstimada) {
            if (this.proyecto && this.fechaInicio) {
                const fechaInicioIngresada = new Date(this.fechaInicio);
                const fechaFinProyecto = new Date(this.proyecto.fechaFin);
                const fechaIngresada = new Date(newFechaEstimada);

                this.isFechaEstimadaValida = fechaIngresada > fechaInicioIngresada && fechaIngresada <= fechaFinProyecto;
            }
        }
    },
    methods: {
        async crearTarea() {
            const proyectoId = this.$route.params.projectId;

            if (!this.isFechaInicioValida) {
                alert("La fecha de inicio no está dentro del rango del proyecto.");
                return;
            }

            if (!this.isFechaEstimadaValida) {
                alert("La fecha estimada no es válida.");
                return;
            }

            try {
                const token = localStorage.getItem('token');
                await apiClient.post('/api/Tarea', {
                    nombre: this.nombre,
                    descripcion: this.descripcion,
                    categoriaId: this.categoriaId,
                    fechaInicio: this.fechaInicio, // Nueva propiedad
                    fechaEstimada: this.fechaEstimada,
                    usuarioId: this.usuarioId,
                    proyectoId: proyectoId,
                    statusId: 1 // Estado inicial
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.$router.push('/manageTasks');
            } catch (error) {
                console.error("Error al crear la tarea:", error);
            }
        },
        goBack() {
            this.$router.push('/manageTasks');
        }
    }
};
</script>


<style scoped>
/* Contenedor principal */
.create-task-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f4f4f9;
    padding: 20px;
}

/* Título */
h2 {
    color: #333;
    margin-bottom: 20px;
}

/* Botón de regresar */
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

/* Formulario */
.task-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

/* Grupo de entradas */
.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

input,
select {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
    width: 100%;
    box-sizing: border-box;
}

input:focus,
select:focus {
    border-color: #007bff;
}

/* Botón de envío */
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:hover {
    background-color: #0056b3;
    transform: scale(1.02);
}

/* Etiqueta */
label {
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
}
.invalid-date {
    border-color: red;
}

.error-message {
    color: red;
    font-size: 14px;
    margin-top: 5px;
}

</style>
