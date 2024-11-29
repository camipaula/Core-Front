<template>
  <div class="comparar-proyectos-container">
    <h2>Comparar Proyectos</h2>

    <!-- Selección de Proyectos -->
    <div class="form-group">
      <label for="proyecto1">Selecciona el Proyecto 1:</label>
      <select v-model="proyecto1Id">
        <option value="" disabled>Seleccione un Proyecto</option>
        <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
          {{ proyecto.nombre }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="proyecto2">Selecciona el Proyecto 2:</label>
      <select v-model="proyecto2Id">
        <option value="" disabled>Seleccione un Proyecto</option>
        <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
          {{ proyecto.nombre }}
        </option>
      </select>
    </div>

    <button class="compare-button" @click="obtenerComparacion">Comparar</button>

    <!-- Resultado de la Comparación -->
    <div v-if="comparacion" class="resultado">
      <h3>Resultado de la Comparación</h3>
      <table class="tabla-comparacion">
        <thead>
          <tr>
            <th>Atributo</th>
            <th>{{ comparacion.proyecto1.nombre }}</th>
            <th>{{ comparacion.proyecto2.nombre }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fecha Inicio</td>
            <td>{{ formatFecha(comparacion.proyecto1.fechaInicio) }}</td>
            <td>{{ formatFecha(comparacion.proyecto2.fechaInicio) }}</td>
          </tr>
          <tr>
            <td>Fecha Fin</td>
            <td>{{ formatFecha(comparacion.proyecto1.fechaFin) }}</td>
            <td>{{ formatFecha(comparacion.proyecto2.fechaFin) }}</td>
          </tr>
          <tr>
            <td>Total Tareas</td>
            <td>{{ comparacion.proyecto1.totalTareas }}</td>
            <td>{{ comparacion.proyecto2.totalTareas }}</td>
          </tr>
          <tr>
            <td>Tareas Pendientes</td>
            <td>{{ comparacion.proyecto1.tareasPendientes }}</td>
            <td>{{ comparacion.proyecto2.tareasPendientes }}</td>
          </tr>
          <tr>
            <td>Tareas Completadas</td>
            <td>{{ comparacion.proyecto1.tareasCompletadas }}</td>
            <td>{{ comparacion.proyecto2.tareasCompletadas }}</td>
          </tr>
          <tr>
            <td>Progreso</td>
            <td>{{ comparacion.proyecto1.progreso.toFixed(2) }}%</td>
            <td>{{ comparacion.proyecto2.progreso.toFixed(2) }}%</td>
          </tr>
          <tr>
            <td>Retrasos</td>
            <td>{{ comparacion.proyecto1.retrasos }}</td>
            <td>{{ comparacion.proyecto2.retrasos }}</td>
          </tr>
          <tr>
            <td>Tamaño del Equipo</td>
            <td>{{ comparacion.proyecto1.tamañoEquipo }}</td>
            <td>{{ comparacion.proyecto2.tamañoEquipo }}</td>
          </tr>
        </tbody>
      </table>

      <div class="analisis">
        <h3>Análisis</h3>
        <p>{{ comparacion.analisis }}</p>
      </div>
    </div>
  </div>
</template>


<script>
import apiClient from "../api";

export default {
  data() {
    return {
      proyectos: [], // Lista de proyectos para el dropdown
      proyecto1Id: "", // ID del Proyecto 1
      proyecto2Id: "", // ID del Proyecto 2
      comparacion: null, // Resultado de la comparación
    };
  },
  async mounted() {
    try {
      const response = await apiClient.get("/api/Proyecto");
      this.proyectos = response.data;
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  },
  methods: {
    async obtenerComparacion() {
      if (!this.proyecto1Id || !this.proyecto2Id) {
        alert("Debe seleccionar ambos proyectos.");
        return;
      }

      try {
        const response = await apiClient.get("/api/Proyecto/CompararProyectos", {
          params: {
            proyecto1Id: this.proyecto1Id,
            proyecto2Id: this.proyecto2Id,
          },
        });
        this.comparacion = response.data;
      } catch (error) {
        console.error("Error al comparar proyectos:", error);
        alert("Ocurrió un error al comparar proyectos. Intente de nuevo.");
      }
    },
    formatFecha(fecha) {
      return new Date(fecha).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style scoped>
.comparar-proyectos-container {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.form-group {
  margin-bottom: 15px;
}

.compare-button {
  padding: 10px 15px;
  margin: 15px 0;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.compare-button:hover {
  background-color: #0056b3;
}

.resultado {
  margin-top: 20px;
}

.tabla-comparacion {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
}

.tabla-comparacion th,
.tabla-comparacion td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.tabla-comparacion th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.analisis {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  border-radius: 5px;
}
</style>
