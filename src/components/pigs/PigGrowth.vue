<template>
  <v-card class="pig-growth-card" elevation="1">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Croissance - {{ pig.name }}</span>
      <v-btn color="primary" size="small" @click="addWeightRecord">
        <v-icon left small>mdi-plus</v-icon>
        Ajouter une pesée
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <!-- Résumé de croissance -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ currentWeight || '?' }} kg</div>
            <div class="text-caption text-grey">Poids actuel</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ dailyGain || '?' }} g/jour</div>
            <div class="text-caption text-grey">Gain moyen</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ feedConversion || '?' }}</div>
            <div class="text-caption text-grey">Indice de conversion</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ estimatedFinish || '?' }} jours</div>
            <div class="text-caption text-grey">Jusqu'à finition</div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Graphique de croissance -->
      <v-card variant="outlined" class="pa-3 mb-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <h4 class="text-subtitle-1">Courbe de croissance</h4>
          <v-btn-toggle v-model="chartRange" density="compact" mandatory>
            <v-btn size="x-small" value="7">7j</v-btn>
            <v-btn size="x-small" value="30">30j</v-btn>
            <v-btn size="x-small" value="90">90j</v-btn>
            <v-btn size="x-small" value="all">Tout</v-btn>
          </v-btn-toggle>
        </div>
        
        <div class="growth-chart-container">
          <!-- Graphique simulé -->
          <div class="growth-chart">
            <div class="chart-grid">
              <div class="grid-line" v-for="i in 5" :key="i" :style="{ bottom: `${i * 20}%` }"></div>
            </div>
            
            <div class="chart-line">
              <div
                v-for="(point, index) in growthPoints"
                :key="index"
                class="chart-point"
                :style="{
                  left: `${(index / (growthPoints.length - 1)) * 100}%`,
                  bottom: `${(point.weight / maxWeight) * 100}%`
                }"
                :title="`${point.date}: ${point.weight}kg`"
              ></div>
            </div>
          </div>
          
          <div class="chart-y-axis">
            <div class="axis-label" v-for="i in 5" :key="i">
              {{ Math.round((maxWeight / 5) * (5 - i)) }} kg
            </div>
          </div>
        </div>
      </v-card>
      
      <!-- Historique des pesées -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Historique des pesées">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Poids</th>
                  <th>Gain journalier</th>
                  <th>Opérateur</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in weightRecords" :key="record.id">
                  <td>{{ record.date }}</td>
                  <td>
                    <strong>{{ record.weight }} kg</strong>
                  </td>
                  <td>
                    <v-chip :color="getGainColor(record.dailyGain)" size="x-small" density="compact">
                      {{ record.dailyGain }} g/j
                    </v-chip>
                  </td>
                  <td>{{ record.operator }}</td>
                  <td class="text-caption">{{ record.notes }}</td>
                </tr>
                
                <tr v-if="weightRecords.length === 0">
                  <td colspan="5" class="text-center text-grey">
                    Aucune pesée enregistrée
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Consommation alimentaire -->
      <v-expansion-panels>
        <v-expansion-panel title="Consommation alimentaire">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Aliment</th>
                  <th>Quantité</th>
                  <th>Coût</th>
                  <th>Indice de conversion</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="feed in feedConsumption" :key="feed.id">
                  <td>{{ feed.period }}</td>
                  <td>{{ feed.feedType }}</td>
                  <td>{{ feed.quantity }} kg</td>
                  <td>{{ feed.cost }} €</td>
                  <td>
                    <v-chip :color="getConversionColor(feed.conversion)" size="x-small" density="compact">
                      {{ feed.conversion }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    
    <!-- Dialogue pour ajouter une pesée -->
    <v-dialog v-model="showAddWeightDialog" max-width="500">
      <v-card>
        <v-card-title>Nouvelle pesée</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveWeightRecord">
            <v-text-field
              v-model="newWeightRecord.date"
              label="Date"
              type="date"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-model="newWeightRecord.weight"
              label="Poids (kg)"
              type="number"
              step="0.1"
              variant="outlined"
              density="comfortable"
              suffix="kg"
              required
            />
            
            <v-text-field
              v-model="newWeightRecord.operator"
              label="Opérateur"
              variant="outlined"
              density="comfortable"
            />
            
            <v-textarea
              v-model="newWeightRecord.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="2"
            />
            
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn variant="outlined" @click="showAddWeightDialog = false">
                Annuler
              </v-btn>
              <v-btn color="primary" type="submit">
                Enregistrer
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  pig: {
    type: Object,
    required: true
  }
})

const chartRange = ref('30')
const showAddWeightDialog = ref(false)

// Données de croissance
const weightRecords = ref([
  { id: 1, date: '2024-12-01', weight: 45.2, dailyGain: 850, operator: 'J. Dupont', notes: 'Pesée mensuelle' },
  { id: 2, date: '2024-11-01', weight: 38.5, dailyGain: 820, operator: 'J. Dupont', notes: 'Pesée mensuelle' },
  { id: 3, date: '2024-10-01', weight: 31.8, dailyGain: 790, operator: 'J. Dupont', notes: 'Pesée mensuelle' },
  { id: 4, date: '2024-09-01', weight: 25.4, dailyGain: 760, operator: 'J. Dupont', notes: 'Pesée mensuelle' },
  { id: 5, date: '2024-08-15', weight: 8.5, dailyGain: 730, operator: 'J. Dupont', notes: 'Arrivée en élevage' }
])

const feedConsumption = ref([
  { id: 1, period: 'Nov 2024', feedType: 'Croissance', quantity: 75, cost: 45, conversion: 2.8 },
  { id: 2, period: 'Oct 2024', feedType: 'Croissance', quantity: 70, cost: 42, conversion: 2.9 },
  { id: 3, period: 'Sep 2024', feedType: 'Démarrage', quantity: 65, cost: 52, conversion: 3.1 }
])

const newWeightRecord = ref({
  date: new Date().toISOString().split('T')[0],
  weight: '',
  operator: '',
  notes: ''
})

// Computed properties
const currentWeight = computed(() => {
  if (weightRecords.value.length === 0) return null
  const sorted = [...weightRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  return sorted[0].weight
})

const dailyGain = computed(() => {
  if (weightRecords.value.length < 2) return null
  
  const sorted = [...weightRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  const last = sorted[0]
  const previous = sorted[1]
  
  const daysDiff = (new Date(last.date) - new Date(previous.date)) / (1000 * 60 * 60 * 24)
  const weightDiff = (last.weight - previous.weight) * 1000 // Convertir en grammes
  
  return Math.round(weightDiff / daysDiff)
})

const feedConversion = computed(() => {
  if (feedConsumption.value.length === 0) return null
  const average = feedConsumption.value.reduce((sum, item) => sum + item.conversion, 0) / feedConsumption.value.length
  return average.toFixed(2)
})

const estimatedFinish = computed(() => {
  if (!currentWeight.value || !dailyGain.value) return null
  
  const targetWeight = 110 // Poids cible de finition
  const remainingWeight = targetWeight - currentWeight.value
  const days = Math.round((remainingWeight * 1000) / dailyGain.value)
  
  return days
})

const growthPoints = computed(() => {
  const points = [...weightRecords.value]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(record => ({
      date: record.date,
      weight: record.weight
    }))
  
  return points
})

const maxWeight = computed(() => {
  if (growthPoints.value.length === 0) return 100
  return Math.max(...growthPoints.value.map(p => p.weight)) * 1.2
})

// Méthodes
const getGainColor = (gain) => {
  if (gain >= 900) return 'success'
  if (gain >= 800) return 'warning'
  return 'error'
}

const getConversionColor = (conversion) => {
  if (conversion <= 2.8) return 'success'
  if (conversion <= 3.0) return 'warning'
  return 'error'
}

const addWeightRecord = () => {
  newWeightRecord.value = {
    date: new Date().toISOString().split('T')[0],
    weight: '',
    operator: '',
    notes: ''
  }
  showAddWeightDialog.value = true
}

const saveWeightRecord = () => {
  // Calculer le gain journalier
  let dailyGain = 0
  if (weightRecords.value.length > 0) {
    const lastRecord = [...weightRecords.value].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
    const daysDiff = (new Date(newWeightRecord.value.date) - new Date(lastRecord.date)) / (1000 * 60 * 60 * 24)
    const weightDiff = (parseFloat(newWeightRecord.value.weight) - lastRecord.weight) * 1000
    
    if (daysDiff > 0) {
      dailyGain = Math.round(weightDiff / daysDiff)
    }
  }
  
  const record = {
    id: Date.now(),
    date: newWeightRecord.value.date,
    weight: parseFloat(newWeightRecord.value.weight),
    dailyGain: dailyGain,
    operator: newWeightRecord.value.operator || 'Système',
    notes: newWeightRecord.value.notes,
    pigId: props.pig.id
  }
  
  weightRecords.value.unshift(record)
  showAddWeightDialog.value = false
  
  // Mettre à jour le poids du porc
  props.pig.weight = record.weight
}

onMounted(() => {
  console.log('PigGrowth component mounted for pig:', props.pig.name)
})
</script>

<style scoped>
.pig-growth-card {
  border-radius: 12px;
}

.gap-2 {
  gap: 8px;
}

.v-expansion-panel {
  border-radius: 8px;
  margin-bottom: 8px;
}

.growth-chart-container {
  display: flex;
  height: 200px;
  position: relative;
}

.growth-chart {
  flex: 1;
  position: relative;
  border-left: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
  margin-left: 40px;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #e0e0e0;
}

.chart-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.chart-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
}

.chart-point:hover {
  width: 12px;
  height: 12px;
  background-color: #388E3C;
}

.chart-y-axis {
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px 0;
}

.axis-label {
  font-size: 0.7rem;
  color: #757575;
  text-align: right;
  padding-right: 8px;
}

@media (max-width: 600px) {
  .pig-growth-card {
    margin: 8px;
  }
  
  .growth-chart-container {
    height: 150px;
  }
}
</style>