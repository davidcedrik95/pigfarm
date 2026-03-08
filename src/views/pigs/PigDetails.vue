<template>
  <v-container fluid class="pa-4">
    <!-- En-tête avec navigation -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="mb-2">
            <div class="d-flex align-center">
              <v-btn
                icon
                @click="goBack"
                size="small"
                variant="text"
                class="mr-2"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-icon icon="mdi-pig" class="mr-2" size="small"></v-icon>
              <h1 class="text-h5 font-weight-bold text-grey-darken-3">
                {{ pig?.name || 'Détails du porc' }}
              </h1>
              <v-chip 
                :color="getStatusColor(pig?.status)" 
                size="x-small" 
                class="ml-2"
                density="compact"
              >
                {{ getStatusLabel(pig?.status) }}
              </v-chip>
              <v-chip 
                :color="getCategoryColor(pig?.category)" 
                size="x-small" 
                class="ml-2"
                density="compact"
              >
                {{ getCategoryLabel(pig?.category) }}
              </v-chip>
            </div>
            <p class="text-caption text-grey-darken-1 mt-1 ml-8">
              ID: {{ pig?.id }} • Boucle: {{ pig?.earTag || 'Non définie' }}
            </p>
          </div>
          
          <!-- Actions -->
          <div class="d-flex align-center gap-1 flex-wrap">
            <v-btn
              variant="outlined"
              @click="editPig"
              size="small"
              class="mr-1"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-pencil</v-icon>
              </template>
              <span class="d-none d-sm-inline">Modifier</span>
            </v-btn>
            <v-btn
              color="primary"
              @click="printReport"
              size="small"
              variant="tonal"
              class="mr-1"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-printer</v-icon>
              </template>
              <span class="d-none d-sm-inline">Imprimer</span>
            </v-btn>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  size="small"
                  icon="mdi-dots-vertical"
                ></v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="toggleFavorite">
                  <template v-slot:prepend>
                    <v-icon :color="pig?.isFavorite ? 'yellow-darken-2' : 'grey'">
                      {{ pig?.isFavorite ? 'mdi-star' : 'mdi-star-outline' }}
                    </v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    {{ pig?.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="recordVaccination">
                  <template v-slot:prepend>
                    <v-icon color="orange">mdi-needle</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Enregistrer vaccination
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="recordWeight">
                  <template v-slot:prepend>
                    <v-icon color="purple">mdi-scale-bathroom</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Enregistrer pesée
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item @click="archivePig" color="error">
                  <template v-slot:prepend>
                    <v-icon>mdi-archive</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Archiver
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Informations principales -->
    <v-row class="mb-4">
      <v-col cols="12" md="3">
        <v-card class="pig-avatar-card" elevation="1">
          <div class="text-center pa-4">
            <v-avatar size="120" :color="getAvatarColor()" class="mb-3">
              <v-icon size="60" dark>{{ getPigIcon() }}</v-icon>
            </v-avatar>
            <h2 class="text-h6">{{ pig?.name || 'Sans nom' }}</h2>
            <div class="text-caption text-grey">{{ pig?.breed || 'Race non spécifiée' }}</div>
            
            <v-divider class="my-3"></v-divider>
            
            <div class="text-left">
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">mdi-cake-variant</v-icon>
                <div>
                  <div class="text-caption text-grey">Âge</div>
                  <div class="font-weight-medium">{{ pig?.age || '?' }} mois</div>
                </div>
              </div>
              
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">mdi-scale</v-icon>
                <div>
                  <div class="text-caption text-grey">Poids</div>
                  <div class="font-weight-medium">{{ pig?.weight || '?' }} kg</div>
                </div>
              </div>
              
              <div class="d-flex align-center mb-2">
                <v-icon size="small" class="mr-2">{{ pig?.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}</v-icon>
                <div>
                  <div class="text-caption text-grey">Sexe</div>
                  <div class="font-weight-medium">{{ pig?.gender === 'male' ? 'Mâle' : 'Femelle' }}</div>
                </div>
              </div>
              
              <div class="d-flex align-center">
                <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                <div>
                  <div class="text-caption text-grey">Localisation</div>
                  <div class="font-weight-medium">{{ pig?.location || 'Non définie' }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="9">
        <!-- Onglets -->
        <v-card elevation="1">
          <v-tabs v-model="activeTab" bg-color="primary" grow>
            <v-tab value="overview">
              <v-icon left>mdi-information</v-icon>
              Vue d'ensemble
            </v-tab>
            <v-tab value="health">
              <v-icon left>mdi-heart-pulse</v-icon>
              Santé
            </v-tab>
            <v-tab value="reproduction" v-if="pig?.category === 'sow' || pig?.category === 'boar'">
              <v-icon left>mdi-heart</v-icon>
              Reproduction
            </v-tab>
            <v-tab value="growth">
              <v-icon left>mdi-chart-line</v-icon>
              Croissance
            </v-tab>
            <v-tab value="stats">
              <v-icon left>mdi-chart-bar</v-icon>
              Statistiques
            </v-tab>
          </v-tabs>
          
          <v-card-text class="pa-0">
            <!-- Contenu des onglets -->
            <v-window v-model="activeTab">
              <!-- Vue d'ensemble -->
              <v-window-item value="overview">
                <div class="pa-4">
                  <v-row>
                    <v-col cols="12" md="6">
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">Informations détaillées</h3>
                      <v-table density="compact">
                        <tbody>
                          <tr>
                            <td class="text-caption font-weight-medium">Date de naissance</td>
                            <td>{{ pig?.birthDate ? formatDate(pig.birthDate) : 'Non définie' }}</td>
                          </tr>
                          <tr>
                            <td class="text-caption font-weight-medium">Couleur</td>
                            <td>{{ pig?.color || 'Non définie' }}</td>
                          </tr>
                          <tr>
                            <td class="text-caption font-weight-medium">État de santé</td>
                            <td>
                              <v-chip :color="getHealthColor(pig?.healthStatus)" size="x-small" density="compact">
                                {{ getHealthLabel(pig?.healthStatus) }}
                              </v-chip>
                            </td>
                          </tr>
                          <tr>
                            <td class="text-caption font-weight-medium">Type d'aliment</td>
                            <td>{{ pig?.feedType || 'Non défini' }}</td>
                          </tr>
                          <tr>
                            <td class="text-caption font-weight-medium">Quantité journalière</td>
                            <td>{{ pig?.dailyFeed || '?' }} kg/jour</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <h3 class="text-subtitle-1 font-weight-bold mb-3">Notes</h3>
                      <v-textarea
                        v-model="notes"
                        variant="outlined"
                        density="comfortable"
                        rows="6"
                        auto-grow
                        @blur="saveNotes"
                        placeholder="Ajoutez des notes concernant ce porc..."
                      ></v-textarea>
                      
                      <div class="mt-4">
                        <h4 class="text-subtitle-2 font-weight-bold mb-2">Dernières activités</h4>
                        <v-list density="compact" class="pa-0">
                          <v-list-item
                            v-for="activity in recentActivities"
                            :key="activity.id"
                            :prepend-icon="activity.icon"
                            :title="activity.title"
                            :subtitle="activity.time"
                            class="px-0"
                          >
                            <template v-slot:prepend>
                              <v-icon :color="activity.color" size="small">{{ activity.icon }}</v-icon>
                            </template>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-window-item>
              
              <!-- Santé -->
              <v-window-item value="health">
                <div class="pa-4">
                  <PigHealth :pig="pig" v-if="pig" />
                </div>
              </v-window-item>
              
              <!-- Reproduction -->
              <v-window-item value="reproduction">
                <div class="pa-4">
                  <PigReproduction :pig="pig" v-if="pig" />
                </div>
              </v-window-item>
              
              <!-- Croissance -->
              <v-window-item value="growth">
                <div class="pa-4">
                  <PigGrowth :pig="pig" v-if="pig" />
                </div>
              </v-window-item>
              
              <!-- Statistiques -->
              <v-window-item value="stats">
                <div class="pa-4">
                  <PigStats :pig="pig" v-if="pig" />
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Pied de page avec actions rapides -->
    <v-row>
      <v-col cols="12">
        <v-card variant="flat" class="pa-2" color="grey-lighten-4">
          <div class="d-flex justify-center flex-wrap gap-2">
            <v-btn
              variant="tonal"
              size="small"
              @click="recordVaccination"
              prepend-icon="mdi-needle"
              density="compact"
            >
              Vaccination
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="recordWeight"
              prepend-icon="mdi-scale-bathroom"
              density="compact"
            >
              Pesée
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="recordTreatment"
              prepend-icon="mdi-pill"
              density="compact"
            >
              Traitement
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="recordMovement"
              prepend-icon="mdi-swap-horizontal"
              density="compact"
            >
              Déplacement
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="viewHistory"
              prepend-icon="mdi-history"
              density="compact"
            >
              Historique
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'
import PigHealth from '@/components/pigs/PigHealth.vue'
import PigReproduction from '@/components/pigs/PigReproduction.vue'
import PigGrowth from '@/components/pigs/PigGrowth.vue'
import PigStats from '@/components/pigs/PigStats.vue'

const router = useRouter()
const route = useRoute()
const pigStore = usePigStore()

// États
const activeTab = ref('overview')
const notes = ref('')
const loading = ref(false)

// Récupérer le porc depuis le store
const pig = computed(() => {
  return pigStore.getPigById(route.params.id)
})

// Données de test pour les activités récentes
const recentActivities = ref([
  { id: 1, icon: 'mdi-scale-bathroom', title: 'Pesée mensuelle', time: 'Il y a 2 jours', color: 'success' },
  { id: 2, icon: 'mdi-needle', title: 'Vaccination PCV2', time: 'Il y a 1 semaine', color: 'info' },
  { id: 3, icon: 'mdi-food', title: 'Changement d\'aliment', time: 'Il y a 2 semaines', color: 'warning' }
])

// Méthodes
onMounted(() => {
  if (!pig.value) {
    console.error('Porc non trouvé:', route.params.id)
    router.push({ name: 'pig-list' })
  } else {
    notes.value = pig.value.notes || ''
  }
})

const goBack = () => {
  router.back()
}

const editPig = () => {
  if (pig.value) {
    router.push({ 
      name: 'pig-details', 
      params: { id: pig.value.id },
      query: { edit: true }
    })
  }
}

const printReport = () => {
  console.log('Impression du rapport pour:', pig.value?.name)
  // Implémenter l'impression
}

const toggleFavorite = () => {
  if (pig.value) {
    pig.value.isFavorite = !pig.value.isFavorite
    // Sauvegarder dans le store si nécessaire
  }
}

const recordVaccination = () => {
  console.log('Enregistrer vaccination pour:', pig.value?.name)
  // Ouvrir un dialogue pour enregistrer une vaccination
}

const recordWeight = () => {
  console.log('Enregistrer pesée pour:', pig.value?.name)
  // Ouvrir un dialogue pour enregistrer une pesée
}

const recordTreatment = () => {
  console.log('Enregistrer traitement pour:', pig.value?.name)
  // Ouvrir un dialogue pour enregistrer un traitement
}

const recordMovement = () => {
  console.log('Enregistrer déplacement pour:', pig.value?.name)
  // Ouvrir un dialogue pour enregistrer un déplacement
}

const archivePig = () => {
  if (confirm(`Êtes-vous sûr de vouloir archiver ${pig.value?.name} ?`)) {
    console.log('Archivage du porc:', pig.value?.name)
    // Implémenter l'archivage
    router.push({ name: 'pig-list' })
  }
}

const viewHistory = () => {
  console.log('Voir l\'historique pour:', pig.value?.name)
  // Naviguer vers la page d'historique
}

const saveNotes = () => {
  if (pig.value) {
    pig.value.notes = notes.value
    // Sauvegarder dans le store
    console.log('Notes sauvegardées pour:', pig.value.name)
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Non définie'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

// Méthodes utilitaires pour les couleurs et labels
const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    sick: 'error',
    pregnant: 'purple',
    sold: 'grey',
    inactive: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    active: 'Actif',
    sick: 'Malade',
    pregnant: 'Gestante',
    sold: 'Vendu',
    inactive: 'Inactif'
  }
  return labels[status] || status
}

const getCategoryColor = (category) => {
  const colors = {
    boar: 'blue',
    sow: 'pink',
    piglet: 'orange',
    grower: 'green',
    finisher: 'brown'
  }
  return colors[category] || 'grey'
}

const getCategoryLabel = (category) => {
  const labels = {
    boar: 'Verrat',
    sow: 'Truie',
    piglet: 'Porcelet',
    grower: 'Élevage',
    finisher: 'Finition'
  }
  return labels[category] || category
}

const getAvatarColor = () => {
  const colors = {
    boar: 'blue-darken-2',
    sow: 'pink-darken-2',
    piglet: 'orange-darken-2',
    grower: 'green-darken-2',
    finisher: 'brown-darken-2'
  }
  return colors[pig.value?.category] || 'grey-darken-2'
}

const getPigIcon = () => {
  const icons = {
    boar: 'mdi-pig',
    sow: 'mdi-pig-variant',
    piglet: 'mdi-pig-variant-outline',
    grower: 'mdi-piggy-bank',
    finisher: 'mdi-food-drumstick'
  }
  return icons[pig.value?.category] || 'mdi-pig'
}

const getHealthColor = (healthStatus) => {
  const colors = {
    healthy: 'success',
    sick: 'error',
    pregnant: 'purple',
    recovering: 'warning'
  }
  return colors[healthStatus] || 'grey'
}

const getHealthLabel = (healthStatus) => {
  const labels = {
    healthy: 'En bonne santé',
    sick: 'Malade',
    pregnant: 'Gestante',
    recovering: 'En convalescence'
  }
  return labels[healthStatus] || healthStatus
}

// Surveillance du changement de porc
watch(() => route.params.id, (newId) => {
  if (newId) {
    console.log('Changement de porc:', newId)
    // Réinitialiser les notes si le porc change
    const currentPig = pigStore.getPigById(newId)
    if (currentPig) {
      notes.value = currentPig.notes || ''
    }
  }
})
</script>

<style scoped>
.pig-avatar-card {
  border-radius: 12px;
  height: 100%;
}

.pig-avatar-card .v-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-tabs {
  border-radius: 8px 8px 0 0;
}

.v-window {
  min-height: 400px;
}

.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 960px) {
  .pa-4 {
    padding: 16px !important;
  }
  
  .text-h5 {
    font-size: 1.5rem !important;
  }
  
  .pig-avatar-card {
    margin-bottom: 16px;
  }
}
</style>