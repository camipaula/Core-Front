<template>
    <div class="avance-container">
        <h2>Avance del Proyecto</h2>
        <button @click="goBack" class="back-button">Volver</button>
        <div class="form-group">
            <label for="proyecto">Selecciona un Proyecto:</label>
            <select v-model="proyectoId" @change="obtenerAvance">
                <option value="" disabled>Seleccione un Proyecto</option>
                <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
                    {{ proyecto.nombre }}
                </option>
            </select>
        </div>

        <div v-if="avanceInfo">
            <p><strong>Nombre del Proyecto:</strong> {{ avanceInfo.nombre }}</p>
            <p><strong>Total de Tareas:</strong> {{ avanceInfo.totalTareas }}</p>
            <p><strong>Tareas Completadas:</strong> {{ avanceInfo.tareasCompletadas }}</p>
            <p><strong>Avance:</strong> {{ avanceInfo.avance }}%</p>
        </div>
    </div>
</template>

<script>
import apiClient from '../api';

export default {
    data() {
        return {
            proyectoId: '',
            proyectos: [],
            avanceInfo: null
        };
    },
    async mounted() {
        // Obtener la lista de proyectos al montar el componente
        const proyectosResponse = await apiClient.get('/api/Proyecto');
        this.proyectos = proyectosResponse.data;
    },
    methods: {
        async obtenerAvance() {
            if (!this.proyectoId) return;

            try {
                const response = await apiClient.get(`/api/Proyecto/Avance/${this.proyectoId}`);
                this.avanceInfo = response.data;
            } catch (error) {
                console.error("Error al obtener el avance del proyecto:", error);
            }
        },
        goBack() {
            this.$router.push('/coordinator');
        }
    }
};
</script>

<style scoped>
.avance-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
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
}

button:hover {
    background-color: #0056b3;
}
</style>
