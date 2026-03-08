<template>
  <v-container fluid class="pa-4">
    <!-- Header du Dashboard -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="mb-2">
            <div class="d-flex align-center">
              <v-icon icon="mdi-pig" class="mr-2" size="small"></v-icon>
              <h1 class="text-h5 font-weight-bold text-grey-darken-3">
                Tableau de Bord Porcin
              </h1>
            </div>
            <p class="text-caption text-grey-darken-1 mt-1">
              Gestion complète de votre élevage porcin
            </p>
          </div>
          
          <!-- Actions Rapides -->
          <div class="d-flex align-center gap-1 flex-wrap">
            <v-btn
              color="primary"
              @click="addNewPig"
              size="small"
              variant="tonal"
              class="mr-1"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-pig-plus</v-icon>
              </template>
              <span class="d-none d-sm-inline">Nouveau Porc</span>
            </v-btn>
            <v-btn
              variant="outlined"
              @click="exportReport"
              size="small"
              class="mr-1"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-export</v-icon>
              </template>
              <span class="d-none d-sm-inline">Rapport</span>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Cartes de Statistiques -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="3" v-for="(stat, index) in modernStats" :key="index">
        <v-card 
          class="modern-stat-card-footer"
          elevation="2"
          @click="stat.action"
        >
          <div class="card-content pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <div class="text-uppercase text-caption font-weight-medium mb-1">
                  {{ stat.title }}
                </div>
                <div class="d-flex align-end">
                  <div class="text-h4 font-weight-bold">
                    {{ stat.value }}
                  </div>
                  <div class="text-caption ml-2" v-if="stat.subtitle">
                    {{ stat.subtitle }}
                  </div>
                </div>
              </div>
              <div class="stat-icon-wrapper">
                <div class="stat-icon-circle" :style="{ backgroundColor: stat.cardColor }">
                  <v-icon :color="stat.textColor" size="28">{{ stat.icon }}</v-icon>
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-footer pa-3" :style="{ backgroundColor: stat.footerColor }">
            <div class="d-flex align-center justify-space-between">
              <span class="text-caption font-weight-medium text-white">
                {{ stat.description }}
              </span>
              <v-icon color="white" size="small">mdi-chevron-right</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Porcs Récemment Ajoutés -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="1" class="pa-3">
          <div class="d-flex justify-space-between align-center mb-3">
            <h2 class="text-subtitle-1 font-weight-bold">Porcs Récemment Ajoutés</h2>
            <v-btn 
              variant="text" 
              size="small" 
              @click="viewAllPigs"
            >
              Voir tous
              <v-icon right size="small">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          
          <v-row v-if="recentPigs.length > 0">
            <v-col 
              cols="12" 
              sm="6" 
              md="4" 
              lg="3" 
              v-for="pig in recentPigs" 
              :key="pig.id"
            >
              <PigCard :pig="pig" @click="viewPigDetails(pig)" />
            </v-col>
          </v-row>
          
          <v-alert v-else type="info" variant="tonal" density="compact">
            Aucun porc enregistré. Ajoutez votre premier porc !
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Santé et Reproduction -->
    <v-row class="mb-4">
      <!-- Vaccinations Imminentes -->
      <v-col cols="12" md="8">
        <v-card elevation="1" class="pa-3">
          <div class="d-flex justify-space-between align-center mb-3">
            <h2 class="text-subtitle-1 font-weight-bold">Vaccinations Imminentes</h2>
            <v-btn 
              variant="text" 
              size="small" 
              @click="viewVaccinations"
            >
              Calendrier complet
              <v-icon right size="small">mdi-chevron-right</v-icon>
            </v-btn>
          </div>
          
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-caption">Porc</th>
                <th class="text-caption">Vaccin</th>
                <th class="text-caption">Date</th>
                <th class="text-caption">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="vaccination in upcomingVaccinations" :key="vaccination.id">
                <td class="py-2">
                  <div class="d-flex align-center">
                    <v-icon class="mr-1" color="grey" size="small">mdi-pig</v-icon>
                    <span class="text-caption">{{ vaccination.pigName }}</span>
                  </div>
                </td>
                <td class="py-2">
                  <span class="text-caption">{{ vaccination.vaccine }}</span>
                </td>
                <td class="py-2">
                  <div :class="vaccination.isOverdue ? 'text-error font-weight-bold' : 'text-caption'">
                    {{ vaccination.date }}
                  </div>
                </td>
                <td class="py-2">
                  <v-chip
                    :color="getVaccinationStatusColor(vaccination.status)"
                    size="x-small"
                    label
                    density="compact"
                  >
                    {{ vaccination.status }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- Truies Gestantes -->
      <v-col cols="12" md="4">
        <v-card elevation="1" class="pa-3 h-100">
          <div class="d-flex justify-space-between align-center mb-3">
            <h2 class="text-subtitle-1 font-weight-bold">Truies Gestantes</h2>
            <v-icon color="pink" size="small">mdi-baby-bottle</v-icon>
          </div>
          
          <v-list density="compact" v-if="pregnantSows.length > 0">
            <v-list-item
              v-for="sow in pregnantSows.slice(0, 4)"
              :key="sow.id"
              class="px-0 py-2"
            >
              <template v-slot:prepend>
                <v-avatar size="40" color="pink-lighten-4">
                  <v-icon color="pink">mdi-pig-variant</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title class="text-caption font-weight-bold">
                {{ sow.name }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption">
                <div>Gestation: {{ sow.gestationWeek }}/16 semaines</div>
                <div>Portée prévue: {{ sow.expectedLitterSize }}</div>
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-chip size="x-small" color="pink">
                  {{ sow.daysUntilDelivery }} jours
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
          
          <v-alert v-else type="info" variant="tonal" density="compact">
            Aucune truie gestante
          </v-alert>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Alimentation -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card elevation="1" class="pa-3">
          <div class="d-flex justify-space-between align-center mb-3">
            <h2 class="text-subtitle-1 font-weight-bold">Suivi Alimentaire</h2>
            <div class="d-flex align-center gap-2">
              <v-chip size="x-small" color="green">
                <v-icon left size="small">mdi-silverware</v-icon>
                Consommation: {{ dailyConsumption }} kg/jour
              </v-chip>
              <v-btn 
                variant="text" 
                size="small" 
                @click="viewFeedManagement"
              >
                <v-icon right size="small">mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
          
          <v-row>
            <v-col cols="12" md="8">
              <div class="feed-chart pa-3">
                <!-- Graphique de consommation -->
                <div class="text-center">
                  <div class="text-h4 font-weight-bold text-primary mb-2">
                    {{ feedEfficiency }} g/kg
                  </div>
                  <div class="text-caption text-grey">
                    Efficacité alimentaire
                  </div>
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-list density="compact" class="feed-stats">
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="green">mdi-wheat</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Aliment en stock
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold">
                    {{ feedStock }} kg
                  </v-list-item-subtitle>
                </v-list-item>
                
                <v-divider></v-divider>
                
                <v-list-item>
                  <template v-slot:prepend>
                    <v-icon color="orange">mdi-currency-eur</v-icon>
                  </template>
                  <v-list-item-title class="text-caption">
                    Coût alimentaire/jour
                  </v-list-item-title>
                  <v-list-item-subtitle class="text-h6 font-weight-bold">
                    {{ dailyFeedCost }} €
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions Rapides Footer -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="flat" class="pa-2" color="grey-lighten-4">
          <div class="d-flex justify-center flex-wrap gap-2">
            <v-btn
              variant="tonal"
              size="small"
              @click="addNewPig"
              prepend-icon="mdi-pig-plus"
              density="compact"
            >
              Ajouter Porc
            </v-btn>
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
              prepend-icon="mdi-scale"
              density="compact"
            >
              Pesée
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="recordDelivery"
              prepend-icon="mdi-baby-bottle"
              density="compact"
            >
              Mise Bas
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'
import PigCard from '@/components/pigs/PigCard.vue'

const router = useRouter()
const pigStore = usePigStore()

// Données du dashboard
const recentPigs = ref([
  {
    id: 'P001',
    name: 'Babe',
    breed: 'Large White',
    category: 'grower',
    status: 'active',
    weight: 45,
    age: 4,
    location: 'Enclos A',
    isFavorite: true
  },
  {
    id: 'P002',
    name: 'Rose',
    breed: 'Landrace',
    category: 'sow',
    status: 'pregnant',
    weight: 220,
    age: 24,
    location: 'Maternité',
    isFavorite: false,
    gestationWeek: 12
  },
  {
    id: 'P003',
    name: 'Max',
    breed: 'Pietrain',
    category: 'boar',
    status: 'active',
    weight: 280,
    age: 30,
    location: 'Verratière',
    isFavorite: false
  },
  {
    id: 'P004',
    name: 'Petit',
    breed: 'Large White',
    category: 'piglet',
    status: 'active',
    weight: 8,
    age: 1,
    location: 'Nurserie',
    isFavorite: true
  }
])

const upcomingVaccinations = ref([
  {
    id: 1,
    pigId: 'P001',
    pigName: 'Babe',
    vaccine: 'PCV2',
    date: '2024-12-15',
    status: 'Prévue',
    isOverdue: false
  },
  {
    id: 2,
    pigId: 'P002',
    pigName: 'Rose',
    vaccine: 'Parvovirus',
    date: '2024-12-10',
    status: 'En retard',
    isOverdue: true
  }
])

const pregnantSows = ref([
  {
    id: 'P002',
    name: 'Rose',
    breed: 'Landrace',
    gestationWeek: 12,
    expectedLitterSize: 12,
    daysUntilDelivery: 28
  }
])

const dailyConsumption = ref(350)
const feedEfficiency = ref('2.8')
const feedStock = ref(1500)
const dailyFeedCost = ref(420)

// Méthodes
const viewAllPigs = () => {
  router.push({ name: 'pig-list' })
}

const viewPigDetails = (pig) => {
  router.push({ 
    name: 'pig-details', 
    params: { id: pig.id } 
  })
}

const viewVaccinations = () => {
  router.push({ name: 'vaccinations' })
}

const viewFeedManagement = () => {
  router.push({ name: 'feed-management' })
}

const addNewPig = () => {
  router.push({ name: 'add-pig' })
}

const recordVaccination = () => {
  router.push({ name: 'record-vaccination' })
}

const recordWeight = () => {
  router.push({ name: 'record-weight' })
}

const recordDelivery = () => {
  router.push({ name: 'record-delivery' })
}

const exportReport = () => {
  console.log('Export du rapport')
  // Logique d'export
}

const getVaccinationStatusColor = (status) => {
  const colors = {
    'Prévue': 'warning',
    'En retard': 'error',
    'Effectuée': 'success',
    'Annulée': 'grey'
  }
  return colors[status] || 'grey'
}

onMounted(() => {
  // Charger les données initiales
  pigStore.updateStats()
})
</script>

<style scoped>
.modern-stat-card-footer {
  border-radius: 12px !important;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
}

.modern-stat-card-footer:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.card-content {
  flex: 1;
}

.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-icon-wrapper {
  position: relative;
}

.stat-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}

.feed-chart {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feed-stats {
  background: #f8f9fa;
  border-radius: 8px;
}

.gap-2 {
  gap: 8px;
}

@media (max-width: 960px) {
  .modern-stat-card-footer {
    margin-bottom: 16px;
  }
  
  .stat-icon-circle {
    width: 48px;
    height: 48px;
  }
}
</style>