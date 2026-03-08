<template>
  <v-card class="pig-reproduction-card" elevation="1">
    <v-card-title class="text-h6">
      Reproduction - {{ pig.name }}
    </v-card-title>
    
    <v-card-text>
      <!-- Informations de reproduction -->
      <v-row v-if="pig.category === 'sow' || pig.category === 'boar'" class="mb-6">
        <v-col cols="12">
          <h4 class="text-subtitle-1 mb-3">Statut de reproduction</h4>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-gender-female</v-icon>
              <div>
                <div class="text-caption text-grey">Statut</div>
                <div class="text-h6 font-weight-bold">{{ getReproductionStatus() }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6" v-if="pig.category === 'sow' && pig.status === 'pregnant'">
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center mb-2">
              <v-icon color="purple" class="mr-2">mdi-baby-bottle</v-icon>
              <div>
                <div class="text-caption text-grey">Gestation</div>
                <div class="text-h6 font-weight-bold">
                  {{ pig.gestationWeek || '?' }}/16 semaines
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6" v-if="pig.category === 'boar'">
          <v-card variant="outlined" class="pa-3">
            <div class="d-flex align-center mb-2">
              <v-icon color="blue" class="mr-2">mdi-gender-male</v-icon>
              <div>
                <div class="text-caption text-grey">Saillies réussies</div>
                <div class="text-h6 font-weight-bold">{{ successfulMatings }}</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Historique des reproductions -->
      <v-expansion-panels class="mb-4">
        <v-expansion-panel title="Historique des saillies">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th v-if="pig.category === 'sow'">Verrat</th>
                  <th v-if="pig.category === 'boar'">Truie</th>
                  <th>Résultat</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="mating in matings" :key="mating.id">
                  <td>{{ mating.date }}</td>
                  <td v-if="pig.category === 'sow'">
                    <v-chip size="x-small" color="blue">{{ mating.boarName }}</v-chip>
                  </td>
                  <td v-if="pig.category === 'boar'">
                    <v-chip size="x-small" color="pink">{{ mating.sowName }}</v-chip>
                  </td>
                  <td>
                    <v-chip :color="getMatingResultColor(mating.result)" size="x-small">
                      {{ getMatingResultLabel(mating.result) }}
                    </v-chip>
                  </td>
                  <td class="text-caption">{{ mating.notes }}</td>
                </tr>
                
                <tr v-if="matings.length === 0">
                  <td :colspan="pig.category === 'sow' ? 4 : 4" class="text-center text-grey">
                    Aucune saillie enregistrée
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Historique des mises bas -->
      <v-expansion-panels class="mb-4" v-if="pig.category === 'sow'">
        <v-expansion-panel title="Historique des mises bas">
          <v-expansion-panel-text>
            <v-table density="compact">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Portée</th>
                  <th>Porcelets vivants</th>
                  <th>Poids moyen</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="delivery in deliveries" :key="delivery.id">
                  <td>{{ delivery.date }}</td>
                  <td>
                    <v-chip size="x-small" color="green">{{ delivery.litterSize }}</v-chip>
                  </td>
                  <td>{{ delivery.livePiglets }}</td>
                  <td>{{ delivery.averageWeight }} kg</td>
                  <td class="text-caption">{{ delivery.notes }}</td>
                </tr>
                
                <tr v-if="deliveries.length === 0">
                  <td colspan="5" class="text-center text-grey">
                    Aucune mise bas enregistrée
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Porcelets actuels -->
      <v-expansion-panels v-if="currentLitter.length > 0 && pig.category === 'sow'">
        <v-expansion-panel title="Portée actuelle">
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="piglet in currentLitter" :key="piglet.id">
                <v-card variant="outlined" class="pa-2">
                  <div class="d-flex align-center">
                    <v-avatar size="40" color="orange-lighten-4" class="mr-2">
                      <v-icon color="orange">mdi-pig-variant-outline</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">{{ piglet.name }}</div>
                      <div class="text-caption">{{ piglet.age }} semaines - {{ piglet.weight }} kg</div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
      
      <!-- Actions -->
      <div class="d-flex justify-end gap-2 mt-4">
        <v-btn
          v-if="pig.category === 'sow'"
          color="primary"
          @click="recordMating"
          variant="tonal"
          size="small"
        >
          <v-icon left small>mdi-heart</v-icon>
          Enregistrer saillie
        </v-btn>
        
        <v-btn
          v-if="pig.category === 'sow' && pig.status === 'pregnant'"
          color="purple"
          @click="recordDelivery"
          variant="tonal"
          size="small"
        >
          <v-icon left small>mdi-baby-bottle</v-icon>
          Enregistrer mise bas
        </v-btn>
      </div>
    </v-card-text>
    
    <!-- Dialogues -->
    <v-dialog v-model="showMatingDialog" max-width="500">
      <v-card>
        <v-card-title>Nouvelle saillie</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveMating">
            <v-text-field
              v-model="newMating.date"
              label="Date"
              type="date"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-if="pig.category === 'sow'"
              v-model="newMating.boarName"
              label="Nom du verrat"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-if="pig.category === 'boar'"
              v-model="newMating.sowName"
              label="Nom de la truie"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-select
              v-model="newMating.result"
              :items="matingResults"
              label="Résultat"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-textarea
              v-model="newMating.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="2"
            />
            
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn variant="outlined" @click="showMatingDialog = false">
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
    
    <v-dialog v-model="showDeliveryDialog" max-width="500">
      <v-card>
        <v-card-title>Nouvelle mise bas</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveDelivery">
            <v-text-field
              v-model="newDelivery.date"
              label="Date"
              type="date"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-model="newDelivery.litterSize"
              label="Taille de la portée"
              type="number"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-model="newDelivery.livePiglets"
              label="Porcelets vivants"
              type="number"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-text-field
              v-model="newDelivery.averageWeight"
              label="Poids moyen (kg)"
              type="number"
              variant="outlined"
              density="comfortable"
              required
            />
            
            <v-textarea
              v-model="newDelivery.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="2"
            />
            
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn variant="outlined" @click="showDeliveryDialog = false">
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
import { ref, computed } from 'vue'

const props = defineProps({
  pig: {
    type: Object,
    required: true
  }
})

const showMatingDialog = ref(false)
const showDeliveryDialog = ref(false)

// Données de reproduction
const matings = ref([
  { id: 1, date: '2024-10-15', boarName: 'Max', result: 'successful', notes: 'Saillie naturelle' },
  { id: 2, date: '2024-08-20', boarName: 'Brutus', result: 'unsuccessful', notes: 'Insémination artificielle' }
])

const deliveries = ref([
  { id: 1, date: '2024-03-10', litterSize: 12, livePiglets: 11, averageWeight: 1.4, notes: 'Portée normale' },
  { id: 2, date: '2023-11-05', litterSize: 10, livePiglets: 10, averageWeight: 1.5, notes: 'Excellente portée' }
])

const currentLitter = ref([
  { id: 1, name: 'Petit', age: 4, weight: 8.5 },
  { id: 2, name: 'Mimi', age: 4, weight: 9.2 }
])

const matingResults = ref([
  { title: 'Réussie', value: 'successful' },
  { title: 'Échouée', value: 'unsuccessful' },
  { title: 'En attente', value: 'pending' }
])

const newMating = ref({
  date: new Date().toISOString().split('T')[0],
  boarName: '',
  sowName: '',
  result: 'pending',
  notes: ''
})

const newDelivery = ref({
  date: new Date().toISOString().split('T')[0],
  litterSize: '',
  livePiglets: '',
  averageWeight: '',
  notes: ''
})

// Computed properties
const successfulMatings = computed(() => {
  return matings.value.filter(m => m.result === 'successful').length
})

// Méthodes
const getReproductionStatus = () => {
  if (props.pig.category === 'boar') {
    return 'Verrat reproducteur'
  }
  
  if (props.pig.category === 'sow') {
    if (props.pig.status === 'pregnant') {
      return `Gestante (${props.pig.gestationWeek || '?'}/16 semaines)`
    } else if (props.pig.status === 'lactating') {
      return 'En lactation'
    } else {
      return 'Disponible'
    }
  }
  
  return 'Non applicable'
}

const getMatingResultColor = (result) => {
  const colors = {
    successful: 'success',
    unsuccessful: 'error',
    pending: 'warning'
  }
  return colors[result] || 'grey'
}

const getMatingResultLabel = (result) => {
  const labels = {
    successful: 'Réussie',
    unsuccessful: 'Échouée',
    pending: 'En attente'
  }
  return labels[result] || result
}

const recordMating = () => {
  newMating.value = {
    date: new Date().toISOString().split('T')[0],
    boarName: '',
    sowName: '',
    result: 'pending',
    notes: ''
  }
  showMatingDialog.value = true
}

const saveMating = () => {
  const mating = {
    id: Date.now(),
    ...newMating.value,
    pigId: props.pig.id
  }
  
  matings.value.unshift(mating)
  
  // Mettre à jour le statut de la truie si la saillie est réussie
  if (props.pig.category === 'sow' && newMating.value.result === 'successful') {
    props.pig.status = 'pregnant'
    props.pig.gestationWeek = 0
  }
  
  showMatingDialog.value = false
}

const recordDelivery = () => {
  newDelivery.value = {
    date: new Date().toISOString().split('T')[0],
    litterSize: '',
    livePiglets: '',
    averageWeight: '',
    notes: ''
  }
  showDeliveryDialog.value = true
}

const saveDelivery = () => {
  const delivery = {
    id: Date.now(),
    ...newDelivery.value,
    sowId: props.pig.id
  }
  
  deliveries.value.unshift(delivery)
  
  // Mettre à jour le statut de la truie
  if (props.pig.status === 'pregnant') {
    props.pig.status = 'lactating'
    delete props.pig.gestationWeek
    delete props.pig.expectedDelivery
  }
  
  showDeliveryDialog.value = false
}
</script>

<style scoped>
.pig-reproduction-card {
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
  .pig-reproduction-card {
    margin: 8px;
  }
}
</style>