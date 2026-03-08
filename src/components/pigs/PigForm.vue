<template>
  <v-card class="pig-form-card" elevation="1">
    <v-card-title class="d-flex justify-space-between align-center">
      <span class="text-h6">{{ isEditMode ? 'Modifier le porc' : 'Nouveau porc' }}</span>
      <v-btn icon @click="$emit('close')" size="small">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    
    <v-card-text>
      <v-form @submit.prevent="handleSubmit">
        <v-row>
          <!-- Informations de base -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.name"
              label="Nom du porc"
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Le nom est requis']"
              required
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.earTag"
              label="Numéro d'oreille"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.breed"
              :items="breeds"
              label="Race"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.category"
              :items="categories"
              label="Catégorie"
              variant="outlined"
              density="comfortable"
              required
              @update:model-value="updateGenderByCategory"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.gender"
              :items="genders"
              label="Sexe"
              variant="outlined"
              density="comfortable"
              :disabled="formData.category === 'boar' || formData.category === 'sow'"
              required
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.birthDate"
              label="Date de naissance"
              type="date"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <!-- Localisation et santé -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.location"
              :items="locations"
              label="Localisation"
              variant="outlined"
              density="comfortable"
              required
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.healthStatus"
              :items="healthStatuses"
              label="État de santé"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.weight"
              label="Poids (kg)"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="kg"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.color"
              label="Couleur"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <!-- Alimentation -->
          <v-col cols="12">
            <v-divider class="my-2"></v-divider>
            <h4 class="text-subtitle-1 mb-3">Alimentation</h4>
          </v-col>
          
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.feedType"
              :items="feedTypes"
              label="Type d'aliment"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.dailyFeed"
              label="Quantité journalière"
              type="number"
              variant="outlined"
              density="comfortable"
              suffix="kg/jour"
            />
          </v-col>
          
          <!-- Notes -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.notes"
              label="Notes"
              variant="outlined"
              density="comfortable"
              rows="3"
              auto-grow
            />
          </v-col>
          
          <!-- Champs spécifiques pour les truies -->
          <template v-if="formData.category === 'sow'">
            <v-col cols="12">
              <v-divider class="my-2"></v-divider>
              <h4 class="text-subtitle-1 mb-3">Informations de reproduction</h4>
            </v-col>
            
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.status"
                :items="sowStatuses"
                label="Statut"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
            
            <v-col cols="12" md="6" v-if="formData.status === 'pregnant'">
              <v-text-field
                v-model="formData.gestationWeek"
                label="Semaine de gestation"
                type="number"
                variant="outlined"
                density="comfortable"
                min="1"
                max="16"
              />
            </v-col>
            
            <v-col cols="12" md="6" v-if="formData.status === 'pregnant'">
              <v-text-field
                v-model="formData.expectedDelivery"
                label="Date de mise bas prévue"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>
          </template>
          
          <!-- Boutons d'action -->
          <v-col cols="12" class="d-flex justify-end gap-2">
            <v-btn variant="outlined" @click="$emit('close')">
              Annuler
            </v-btn>
            <v-btn color="primary" type="submit" :loading="loading">
              {{ isEditMode ? 'Mettre à jour' : 'Ajouter le porc' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  pig: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit', 'close'])

const isEditMode = computed(() => !!props.pig)
const loading = ref(false)

// Données du formulaire
const formData = ref({
  name: '',
  earTag: '',
  breed: '',
  category: 'grower',
  gender: 'male',
  birthDate: '',
  location: '',
  healthStatus: 'healthy',
  weight: '',
  color: '',
  feedType: '',
  dailyFeed: '',
  notes: '',
  status: 'active'
})

// Options des listes déroulantes
const breeds = ref([
  'Large White',
  'Landrace',
  'Pietrain',
  'Duroc',
  'Hampshire',
  'Berkshire',
  'Tamworth',
  'Autre'
])

const categories = ref([
  { title: 'Verrat', value: 'boar' },
  { title: 'Truie', value: 'sow' },
  { title: 'Porcelet', value: 'piglet' },
  { title: 'Élevage', value: 'grower' },
  { title: 'Finition', value: 'finisher' }
])

const genders = ref([
  { title: 'Mâle', value: 'male' },
  { title: 'Femelle', value: 'female' }
])

const locations = ref([
  'Nurserie',
  'Maternité',
  'Élevage',
  'Finition',
  'Verratière',
  'Quarantaine',
  'Infirmerie'
])

const healthStatuses = ref([
  { title: 'En bonne santé', value: 'healthy' },
  { title: 'Malade', value: 'sick' },
  { title: 'En convalescence', value: 'recovering' },
  { title: 'Sous traitement', value: 'treatment' }
])

const feedTypes = ref([
  'Porcelet (pré-démarrage)',
  'Démarrage',
  'Croissance',
  'Finition',
  'Gestation',
  'Lactation',
  'Verrat'
])

const sowStatuses = ref([
  { title: 'Active', value: 'active' },
  { title: 'Gestante', value: 'pregnant' },
  { title: 'Lactation', value: 'lactating' },
  { title: 'Vide', value: 'empty' }
])

// Méthodes
const updateGenderByCategory = () => {
  if (formData.value.category === 'boar') {
    formData.value.gender = 'male'
  } else if (formData.value.category === 'sow') {
    formData.value.gender = 'female'
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // Validation
    if (!formData.value.name || !formData.value.earTag || !formData.value.breed || !formData.value.category) {
      throw new Error('Veuillez remplir tous les champs obligatoires')
    }
    
    // Préparer les données
    const submissionData = {
      ...formData.value,
      age: calculateAge(formData.value.birthDate)
    }
    
    // Émettre l'événement
    emit('submit', submissionData)
    
  } catch (error) {
    console.error('Erreur lors de la soumission:', error)
    // Vous pouvez ajouter une notification d'erreur ici
  } finally {
    loading.value = false
  }
}

const calculateAge = (birthDate) => {
  if (!birthDate) return null
  const birth = new Date(birthDate)
  const now = new Date()
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  return months
}

// Initialiser avec les données du porc si en mode édition
watch(() => props.pig, (newPig) => {
  if (newPig) {
    formData.value = { ...newPig }
  }
}, { immediate: true })

// Initialiser avec la date du jour pour la date de naissance
onMounted(() => {
  if (!isEditMode.value) {
    const today = new Date().toISOString().split('T')[0]
    formData.value.birthDate = today
  }
})
</script>

<style scoped>
.pig-form-card {
  border-radius: 12px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 600px) {
  .pig-form-card {
    margin: 8px;
  }
}
</style>