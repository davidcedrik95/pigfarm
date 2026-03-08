<template>
  <v-container fluid class="pa-4">
    <!-- En-tête -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="mb-2">
            <div class="d-flex align-center">
              <v-icon :icon="isEditMode ? 'mdi-pencil' : 'mdi-pig-plus'" class="mr-2" size="small"></v-icon>
              <h1 class="text-h5 font-weight-bold text-grey-darken-3">
                {{ isEditMode ? 'Modifier le porc' : 'Nouveau porc' }}
              </h1>
            </div>
            <p class="text-caption text-grey-darken-1 mt-1">
              {{ isEditMode ? 'Modifier les informations du porc' : 'Ajouter un nouveau porc à l\'élevage' }}
            </p>
          </div>
          
          <div class="d-flex align-center gap-1 flex-wrap">
            <v-btn
              variant="outlined"
              @click="goBack"
              size="small"
              class="mr-1"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-arrow-left</v-icon>
              </template>
              <span class="d-none d-sm-inline">Retour</span>
            </v-btn>
            <v-btn
              color="primary"
              @click="submitForm"
              size="small"
              variant="tonal"
              :loading="loading"
              :disabled="loading"
            >
              <template v-slot:prepend>
                <v-icon size="small">{{ isEditMode ? 'mdi-content-save' : 'mdi-check' }}</v-icon>
              </template>
              <span class="d-none d-sm-inline">{{ isEditMode ? 'Enregistrer' : 'Ajouter' }}</span>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Formulaire -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1" class="pa-4">
          <PigForm 
            ref="pigFormRef"
            :pig="currentPig"
            @submit="handleSubmit"
            @close="goBack"
          />
        </v-card>
      </v-col>
    </v-row>

    <!-- Aide rapide -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="outlined" class="pa-3">
          <v-expansion-panels flat>
            <v-expansion-panel>
              <v-expansion-panel-title class="text-subtitle-2 font-weight-bold">
                <v-icon left size="small">mdi-help-circle</v-icon>
                Conseils pour remplir le formulaire
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary" size="small">mdi-information</v-icon>
                    </template>
                    <v-list-item-title class="text-caption">
                      Le numéro d'oreille doit être unique pour chaque porc
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary" size="small">mdi-information</v-icon>
                    </template>
                    <v-list-item-title class="text-caption">
                      Pour les truies gestantes, renseignez la semaine de gestation
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary" size="small">mdi-information</v-icon>
                    </template>
                    <v-list-item-title class="text-caption">
                      Le poids est important pour suivre la croissance
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon color="primary" size="small">mdi-information</v-icon>
                    </template>
                    <v-list-item-title class="text-caption">
                      Les notes peuvent contenir des informations importantes sur la santé ou le comportement
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'
import PigForm from '@/components/pigs/PigForm.vue'

const router = useRouter()
const route = useRoute()
const pigStore = usePigStore()

const loading = ref(false)
const pigFormRef = ref(null)
const currentPig = ref(null)

// Vérifier si on est en mode édition
const isEditMode = computed(() => {
  return route.params.id !== undefined
})

// Charger le porc en mode édition
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const pigId = route.params.id
      const pig = pigStore.getPigById(pigId)
      
      if (pig) {
        currentPig.value = { ...pig }
      } else {
        console.error('Porc non trouvé:', pigId)
        router.push({ name: 'pig-list' })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du porc:', error)
      router.push({ name: 'pig-list' })
    }
  }
})

const submitForm = () => {
  if (pigFormRef.value) {
    pigFormRef.value.handleSubmit()
  }
}

const handleSubmit = async (pigData) => {
  loading.value = true
  
  try {
    if (isEditMode.value) {
      // Mettre à jour le porc existant
      const updatedPig = pigStore.updatePig(route.params.id, pigData)
      
      if (updatedPig) {
        console.log('Porc mis à jour:', updatedPig)
        
        // Ajouter une notification
        pigStore.addNotification({
          icon: 'mdi-pig',
          title: 'Porc mis à jour',
          message: `${updatedPig.name} a été mis à jour avec succès`,
          color: 'success',
          type: 'pig',
          pigId: updatedPig.id
        })
      }
    } else {
      // Ajouter un nouveau porc
      const newPig = pigStore.addPig(pigData)
      
      if (newPig) {
        console.log('Nouveau porc ajouté:', newPig)
        
        // Ajouter une notification
        pigStore.addNotification({
          icon: 'mdi-pig-plus',
          title: 'Nouveau porc ajouté',
          message: `${newPig.name} a été ajouté à l'élevage`,
          color: 'success',
          type: 'pig',
          pigId: newPig.id
        })
      }
    }
    
    // Rediriger vers la liste des porcs
    setTimeout(() => {
      router.push({ name: 'pig-list' })
    }, 500)
    
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du porc:', error)
    
    // Ajouter une notification d'erreur
    pigStore.addNotification({
      icon: 'mdi-alert',
      title: 'Erreur d\'enregistrement',
      message: 'Une erreur est survenue lors de l\'enregistrement du porc',
      color: 'error',
      type: 'system'
    })
    
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}

.v-expansion-panel {
  border-radius: 8px;
}

.v-list-item {
  border-radius: 6px;
}

@media (max-width: 600px) {
  .pa-4 {
    padding: 16px !important;
  }
  
  .text-h5 {
    font-size: 1.5rem !important;
  }
}
</style>