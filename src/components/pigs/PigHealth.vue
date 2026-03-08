<template>
  <v-card class="pig-health-card" elevation="1">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">Santé - {{ pig.name }}</span>
      <v-btn color="primary" size="small" @click="addHealthRecord">
        <v-icon left small>mdi-plus</v-icon>
        Ajouter un enregistrement
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <!-- Résumé de santé -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold" :class="getHealthStatusClass()">
              {{ getHealthStatusLabel() }}
            </div>
            <div class="text-caption text-grey">État de santé</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ lastVaccination || 'Aucune' }}</div>
            <div class="text-caption text-grey">Dernière vaccination</div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card variant="outlined" class="pa-3 text-center">
            <div class="text-h6 font-weight-bold">{{ lastWeight || '?' }} kg</div>
            <div class="text-caption text-grey">Dernier poids</div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Historique médical -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Historique médical">
          <v-expansion-panel-text>
            <v-list lines="two" density="compact">
              <v-list-item
                v-for="record in healthRecords"
                :key="record.id"
                :prepend-icon="getRecordIcon(record.type)"
                :title="record.title"
                :subtitle="`${record.date} - ${record.notes}`"
              >
                <template v-slot:prepend>
                  <v-icon :color="getRecordColor(record.type)">{{ getRecordIcon(record.type) }}</v-icon>
                </template>
                <template v-slot:append>
                  <v-chip size="x-small" :color="getRecordColor(record.type)">
                    {{ getRecordTypeLabel(record.type) }}
                  </v-chip>
                </template>
              </v-list-item>
              
              <v-list-item v-if="healthRecords.length === 0">
                <v-list-item-title class="text-grey text-center">
                  Aucun enregistrement de santé
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Vaccinations -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Vaccinations">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Vaccin</th>
                  <th>Date</th>
                  <th>Prochaine dose</th>
                  <th>Vétérinaire</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vaccination in vaccinations" :key="vaccination.id">
                  <td>{{ vaccination.vaccine }}</td>
                  <td>{{ vaccination.date }}</td>
                  <td>
                    <v-chip :color="getVaccinationStatusColor(vaccination.nextDate)" size="x-small">
                      {{ vaccination.nextDate }}
                    </v-chip>
                  </td>
                  <td>{{ vaccination.veterinarian }}</td>
                </tr>
                
                <tr v-if="vaccinations.length === 0">
                  <td colspan="4" class="text-center text-grey">
                    Aucune vaccination enregistrée
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Traitements en cours -->
      <v-expansion-panels v-if="activeTreatments.length > 0">
        <v-expansion-panel title="Traitements en cours" color="warning">
          <v-expansion-panel-text>
            <v-alert type="warning" variant="tonal" density="compact" class="mb-3">
              {{ activeTreatments.length }} traitement(s) en cours
            </v-alert>
            
            <v-list density="compact">
              <v-list-item
                v-for="treatment in activeTreatments"
                :key="treatment.id"
                :prepend-icon="'mdi-pill'"
              >
                <v-list-item-title>{{ treatment.medication }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ treatment.dosage }} - {{ treatment.frequency }}
                </v-list-item-subtitle>
                <template v-slot:append>
                  <div class="text-caption">
                    Jusqu'au {{ treatment.endDate }}
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
    
    <!-- Dialogue pour ajouter un enregistrement -->
    <v-dialog v-model="showAddRecordDialog" max-width="500">
      <v-card>
        <v-card-title>Nouvel enregistrement de santé</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveHealthRecord">
            <v-select
              v-model="newRecord.type"
              :items="recordTypes"
              label="Type d'enregistrement"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-model="newRecord.title"
              label="Titre"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-textarea
              v-model="newRecord.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="3"
              required
            />
            
            <v-text-field
              v-model="newRecord.date"
              label="Date"
              type="date"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn variant="outlined" @click="showAddRecordDialog = false">
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

const showAddRecordDialog = ref(false)
const newRecord = ref({
  type: 'checkup',
  title: '',
  notes: '',
  date: new Date().toISOString().split('T')[0]
})

// Données de santé
const healthRecords = ref([
  { id: 1, type: 'vaccination', title: 'Vaccination PCV2', date: '2024-11-15', notes: 'Vaccin administré par Dr. Martin' },
  { id: 2, type: 'treatment', title: 'Traitement antibiotique', date: '2024-10-20', notes: 'Amoxicilline pour infection respiratoire' },
  { id: 3, type: 'checkup', title: 'Contrôle de routine', date: '2024-11-01', notes: 'État général bon, poids stable' }
])

const vaccinations = ref([
  { id: 1, vaccine: 'PCV2', date: '2024-11-15', nextDate: '2025-05-15', veterinarian: 'Dr. Martin' },
  { id: 2, vaccine: 'Parvovirus', date: '2024-09-10', nextDate: '2025-03-10', veterinarian: 'Dr. Martin' }
])

const activeTreatments = ref([
  { id: 1, medication: 'Amoxicilline', dosage: '500mg', frequency: '2x/jour', endDate: '2024-12-20' }
])

const recordTypes = ref([
  { title: 'Vaccination', value: 'vaccination' },
  { title: 'Traitement', value: 'treatment' },
  { title: 'Contrôle de routine', value: 'checkup' },
  { title: 'Pesée', value: 'weighing' },
  { title: 'Observation', value: 'observation' },
  { title: 'Autre', value: 'other' }
])

// Computed properties
const lastVaccination = computed(() => {
  if (vaccinations.value.length === 0) return null
  const sorted = [...vaccinations.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  return sorted[0].date
})

const lastWeight = computed(() => {
  const weightRecords = healthRecords.value.filter(r => r.type === 'weighing')
  if (weightRecords.length === 0) return null
  const sorted = [...weightRecords].sort((a, b) => new Date(b.date) - new Date(a.date))
  return sorted[0].notes.match(/\d+/)?.[0] || null
})

// Méthodes
const getHealthStatusClass = () => {
  const classes = {
    healthy: 'text-success',
    sick: 'text-error',
    pregnant: 'text-purple',
    recovering: 'text-warning'
  }
  return classes[props.pig.healthStatus] || 'text-grey'
}

const getHealthStatusLabel = () => {
  const labels = {
    healthy: 'En bonne santé',
    sick: 'Malade',
    pregnant: 'Gestante',
    recovering: 'En convalescence'
  }
  return labels[props.pig.healthStatus] || props.pig.healthStatus
}

const getRecordIcon = (type) => {
  const icons = {
    vaccination: 'mdi-needle',
    treatment: 'mdi-pill',
    checkup: 'mdi-stethoscope',
    weighing: 'mdi-scale',
    observation: 'mdi-eye',
    other: 'mdi-file-document'
  }
  return icons[type] || 'mdi-help-circle'
}

const getRecordColor = (type) => {
  const colors = {
    vaccination: 'blue',
    treatment: 'orange',
    checkup: 'green',
    weighing: 'purple',
    observation: 'info',
    other: 'grey'
  }
  return colors[type] || 'grey'
}

const getRecordTypeLabel = (type) => {
  const labels = {
    vaccination: 'Vaccination',
    treatment: 'Traitement',
    checkup: 'Contrôle',
    weighing: 'Pesée',
    observation: 'Observation',
    other: 'Autre'
  }
  return labels[type] || type
}

const getVaccinationStatusColor = (nextDate) => {
  const today = new Date()
  const next = new Date(nextDate)
  const daysUntil = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
  
  if (daysUntil < 0) return 'error'
  if (daysUntil <= 7) return 'warning'
  return 'success'
}

const addHealthRecord = () => {
  newRecord.value = {
    type: 'checkup',
    title: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  }
  showAddRecordDialog.value = true
}

const saveHealthRecord = () => {
  const record = {
    id: Date.now(),
    ...newRecord.value,
    pigId: props.pig.id
  }
  
  healthRecords.value.unshift(record)
  showAddRecordDialog.value = false
  
  // Mettre à jour l'état de santé si nécessaire
  if (record.type === 'treatment') {
    // Ajouter au traitement actif
    activeTreatments.value.push({
      id: Date.now() + 1,
      medication: record.title,
      dosage: 'À définir',
      frequency: '1x/jour',
      endDate: record.date
    })
  }
}

onMounted(() => {
  console.log('PigHealth component mounted for pig:', props.pig.name)
})
</script>

<style scoped>
.pig-health-card {
  border-radius: 12px;
}

.gap-2 {
  gap: 8px;
}

.v-expansion-panel {
  border-radius: 8px;
  margin-bottom: 8px;
}

@media (max-width: 600px) {
  .pig-health-card {
    margin: 8px;
  }
}
</style>