<template>
  <v-card class="pig-stats-card" elevation="1">
    <v-card-title class="text-h6">
      Statistiques - {{ pig.name }}
    </v-card-title>
    
    <v-card-text>
      <!-- Vue d'ensemble -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h4 class="text-subtitle-1 mb-3">Vue d'ensemble</h4>
        </v-col>
        
        <v-col cols="6" md="3">
          <v-card variant="outlined" class="pa-2 text-center">
            <div class="text-h5 font-weight-bold">{{ ageInMonths }} mois</div>
            <div class="text-caption text-grey">Âge</div>
          </v-card>
        </v-col>
        
        <v-col cols="6" md="3">
          <v-card variant="outlined" class="pa-2 text-center">
            <div class="text-h5 font-weight-bold">{{ pig.weight || '?' }} kg</div>
            <div class="text-caption text-grey">Poids actuel</div>
          </v-card>
        </v-col>
        
        <v-col cols="6" md="3">
          <v-card variant="outlined" class="pa-2 text-center">
            <div class="text-h5 font-weight-bold">{{ dailyGain }} g/j</div>
            <div class="text-caption text-grey">Gain moyen</div>
          </v-card>
        </v-col>
        
        <v-col cols="6" md="3">
          <v-card variant="outlined" class="pa-2 text-center">
            <div class="text-h5 font-weight-bold">{{ feedEfficiency }}</div>
            <div class="text-caption text-grey">Indice alimentaire</div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Indicateurs de santé -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Indicateurs de santé">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Indicateur</th>
                  <th>Valeur</th>
                  <th>Norme</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="indicator in healthIndicators" :key="indicator.name">
                  <td>{{ indicator.name }}</td>
                  <td>
                    <strong>{{ indicator.value }} {{ indicator.unit }}</strong>
                  </td>
                  <td>{{ indicator.norm }}</td>
                  <td>
                    <v-chip :color="indicator.statusColor" size="x-small" density="compact">
                      {{ indicator.status }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Performance économique -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Performance économique">
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <h5 class="text-subtitle-2 mb-2">Coûts d'élevage</h5>
                  <v-list density="compact">
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="blue-grey" size="small">mdi-food</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Alimentation</v-list-item-title>
                      <v-list-item-subtitle class="text-h6">€ {{ feedCost }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="blue-grey" size="small">mdi-needle</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Santé</v-list-item-title>
                      <v-list-item-subtitle class="text-h6">€ {{ healthCost }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <template v-slot:prepend>
                        <v-icon color="blue-grey" size="small">mdi-home</v-icon>
                      </template>
                      <v-list-item-title class="text-caption">Logement</v-list-item-title>
                      <v-list-item-subtitle class="text-h6">€ {{ housingCost }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <h5 class="text-subtitle-2 mb-2">Rentabilité</h5>
                  <v-list density="compact">
                    <v-list-item>
                      <v-list-item-title class="text-caption">Coût total</v-list-item-title>
                      <v-list-item-subtitle class="text-h6 text-error">€ {{ totalCost }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title class="text-caption">Valeur estimée</v-list-item-title>
                      <v-list-item-subtitle class="text-h6 text-success">€ {{ estimatedValue }}</v-list-item-subtitle>
                    </v-list-item>
                    
                    <v-list-item>
                      <v-list-item-title class="text-caption">Marge brute</v-list-item-title>
                      <v-list-item-subtitle 
                        :class="`text-h6 ${profitMargin >= 0 ? 'text-success' : 'text-error'}`"
                      >
                        € {{ profitMargin }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Graphiques -->
      <v-expansion-panels>
        <v-expansion-panel title="Graphiques">
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" md="6">
                <div class="chart-container pa-3">
                  <h6 class="text-subtitle-2 mb-3 text-center">Évolution du poids</h6>
                  <div class="weight-chart">
                    <!-- Graphique simulé -->
                    <div class="chart-grid">
                      <div class="grid-line" v-for="i in 5" :key="i"></div>
                    </div>
                    <div class="chart-data">
                      <div 
                        v-for="(point, index) in weightHistory"
                        :key="index"
                        class="chart-point"
                        :style="{
                          left: `${(index / (weightHistory.length - 1)) * 100}%`,
                          bottom: `${(point / maxWeight) * 100}%`
                        }"
                      ></div>
                    </div>
                  </div>
                  <div class="chart-x-axis text-center text-caption mt-2">
                    Temps (semaines)
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" md="6">
                <div class="chart-container pa-3">
                  <h6 class="text-subtitle-2 mb-3 text-center">Répartition des coûts</h6>
                  <div class="costs-chart">
                    <div class="doughnut-chart">
                      <div class="doughnut-slice" style="background-color: #FF9800; transform: rotate(0deg);"></div>
                      <div class="doughnut-slice" style="background-color: #4CAF50; transform: rotate(120deg);"></div>
                      <div class="doughnut-slice" style="background-color: #2196F3; transform: rotate(240deg);"></div>
                      <div class="doughnut-center"></div>
                    </div>
                    <div class="chart-legend">
                      <div class="legend-item">
                        <div class="legend-color" style="background-color: #FF9800;"></div>
                        <span class="text-caption">Alimentation</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color" style="background-color: #4CAF50;"></div>
                        <span class="text-caption">Santé</span>
                      </div>
                      <div class="legend-item">
                        <div class="legend-color" style="background-color: #2196F3;"></div>
                        <span class="text-caption">Logement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  pig: {
    type: Object,
    required: true
  }
})

// Données calculées
const ageInMonths = computed(() => {
  return props.pig.age || Math.floor(Math.random() * 24) + 1
})

const dailyGain = computed(() => {
  return Math.floor(Math.random() * 300) + 700
})

const feedEfficiency = computed(() => {
  return (Math.random() * 0.5 + 2.5).toFixed(2)
})

const weightHistory = computed(() => {
  return [8, 15, 25, 38, 45]
})

const maxWeight = computed(() => {
  return Math.max(...weightHistory.value) * 1.2
})

// Indicateurs de santé
const healthIndicators = ref([
  { name: 'Température', value: 39.2, unit: '°C', norm: '38.5-39.5', status: 'Normal', statusColor: 'success' },
  { name: 'Rythme cardiaque', value: 95, unit: 'bpm', norm: '70-120', status: 'Normal', statusColor: 'success' },
  { name: 'Fréquence respiratoire', value: 25, unit: 'rpm', norm: '20-35', status: 'Normal', statusColor: 'success' },
  { name: 'Consommation eau', value: 8, unit: 'L/j', norm: '6-10', status: 'Normal', statusColor: 'success' }
])

// Coûts
const feedCost = computed(() => {
  return (ageInMonths.value * 15).toFixed(2)
})

const healthCost = computed(() => {
  return (ageInMonths.value * 5).toFixed(2)
})

const housingCost = computed(() => {
  return (ageInMonths.value * 8).toFixed(2)
})

const totalCost = computed(() => {
  return (parseFloat(feedCost.value) + parseFloat(healthCost.value) + parseFloat(housingCost.value)).toFixed(2)
})

const estimatedValue = computed(() => {
  return (props.pig.weight * 2.5).toFixed(2)
})

const profitMargin = computed(() => {
  return (parseFloat(estimatedValue.value) - parseFloat(totalCost.value)).toFixed(2)
})
</script>

<style scoped>
.pig-stats-card {
  border-radius: 12px;
}

.chart-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  height: 250px;
  display: flex;
  flex-direction: column;
}

.weight-chart {
  flex: 1;
  position: relative;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 8px;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-grid .grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e0e0e0;
}

.chart-grid .grid-line:nth-child(1) { top: 0%; }
.chart-grid .grid-line:nth-child(2) { top: 25%; }
.chart-grid .grid-line:nth-child(3) { top: 50%; }
.chart-grid .grid-line:nth-child(4) { top: 75%; }
.chart-grid .grid-line:nth-child(5) { top: 100%; }

.chart-data {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #4CAF50;
  border-radius: 50%;
  transform: translate(-50%, 50%);
}

.chart-point::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: rgba(76, 175, 80, 0.2);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.costs-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.doughnut-chart {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  background-color: #f5f5f5;
  margin-right: 20px;
}

.doughnut-slice {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
}

.doughnut-center {
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

@media (max-width: 960px) {
  .doughnut-chart {
    width: 100px;
    height: 100px;
  }
  
  .doughnut-center {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 600px) {
  .chart-container {
    height: 200px;
  }
  
  .costs-chart {
    flex-direction: column;
    gap: 16px;
  }
  
  .doughnut-chart {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .chart-legend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>