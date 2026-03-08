<template>
  <v-container fluid class="pa-4">
    <!-- En-tête -->
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div class="mb-2">
            <div class="d-flex align-center">
              <v-icon icon="mdi-format-list-bulleted" class="mr-2" size="small"></v-icon>
              <h1 class="text-h5 font-weight-bold text-grey-darken-3">
                Liste des porcs
              </h1>
            </div>
            <p class="text-caption text-grey-darken-1 mt-1">
              Gestion complète de votre élevage porcin
            </p>
          </div>
          
          <div class="d-flex align-center gap-1 flex-wrap">
            <SearchBar 
              v-model="searchQuery"
              @search="handleSearch"
              maxWidth="250px"
              class="mr-2"
            />
            <v-btn
              color="primary"
              @click="addNewPig"
              size="small"
              variant="tonal"
            >
              <template v-slot:prepend>
                <v-icon size="small">mdi-pig-plus</v-icon>
              </template>
              <span class="d-none d-sm-inline">Ajouter un porc</span>
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Filtres -->
    <v-row class="mb-4">
      <v-col cols="12">
        <v-card variant="outlined" class="pa-3">
          <div class="d-flex flex-wrap align-center gap-2">
            <span class="text-caption font-weight-medium">Filtres :</span>
            <v-chip
              v-for="filter in activeFilters"
              :key="filter.key"
              closable
              @click:close="removeFilter(filter.key)"
              size="small"
              :color="getFilterColor(filter.key)"
            >
              {{ filter.label }}: {{ filter.value }}
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              size="x-small"
              @click="clearFilters"
              :disabled="activeFilters.length === 0"
            >
              Effacer tout
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistiques rapides -->
    <v-row class="mb-4">
      <v-col cols="6" sm="3" v-for="stat in quickStats" :key="stat.title">
        <v-card variant="outlined" class="pa-3 text-center">
          <div class="text-h6 font-weight-bold">{{ stat.value }}</div>
          <div class="text-caption text-grey">{{ stat.title }}</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Liste des porcs -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="1" class="pa-3">
          <div class="d-flex justify-space-between align-center mb-3">
            <h2 class="text-subtitle-1 font-weight-bold">
              Porcs ({{ filteredPigs.length }})
            </h2>
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="itemsPerPage"
                :items="[12, 24, 48, 96]"
                density="compact"
                variant="outlined"
                hide-details
                style="width: 120px;"
                label="Par page"
              />
              <v-btn
                variant="text"
                size="small"
                icon="mdi-refresh"
                @click="refreshData"
              ></v-btn>
            </div>
          </div>
          
          <v-row v-if="filteredPigs.length > 0">
            <v-col 
              cols="12" 
              sm="6" 
              md="4" 
              lg="3" 
              v-for="pig in paginatedPigs" 
              :key="pig.id"
            >
              <PigCard 
                :pig="pig" 
                @click="viewPigDetails(pig)"
                @favorite="toggleFavorite(pig)"
              />
            </v-col>
          </v-row>
          
          <!-- Message si aucun porc -->
          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey-lighten-2" class="mb-4">mdi-pig-off</v-icon>
            <h3 class="text-h6 text-grey mb-2">Aucun porc trouvé</h3>
            <p class="text-caption text-grey mb-4">
              {{ searchQuery || activeFilters.length > 0 ? 'Aucun porc ne correspond à vos critères' : 'Commencez par ajouter votre premier porc' }}
            </p>
            <v-btn
              color="primary"
              @click="addNewPig"
              v-if="!searchQuery && activeFilters.length === 0"
            >
              <v-icon left>mdi-pig-plus</v-icon>
              Ajouter un porc
            </v-btn>
            <v-btn
              variant="outlined"
              @click="clearFiltersAndSearch"
              v-else
            >
              Effacer les filtres
            </v-btn>
          </div>

          <!-- Pagination -->
          <v-pagination
            v-if="filteredPigs.length > itemsPerPage"
            v-model="currentPage"
            :length="totalPages"
            :total-visible="5"
            density="compact"
            class="mt-4"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions rapides en bas -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card variant="flat" class="pa-2" color="grey-lighten-4">
          <div class="d-flex justify-center flex-wrap gap-2">
            <v-btn
              variant="tonal"
              size="small"
              @click="exportToCSV"
              prepend-icon="mdi-download"
              density="compact"
            >
              Exporter CSV
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="printList"
              prepend-icon="mdi-printer"
              density="compact"
            >
              Imprimer
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="showArchived"
              prepend-icon="mdi-archive"
              density="compact"
            >
              Voir les archives
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              @click="openStatistics"
              prepend-icon="mdi-chart-bar"
              density="compact"
            >
              Statistiques
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
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const pigStore = usePigStore()

// États
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const filters = ref({})

// Computed properties
const filteredPigs = computed(() => {
  return pigStore.filteredPigs
})

const paginatedPigs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredPigs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPigs.value.length / itemsPerPage.value)
})

const quickStats = computed(() => [
  { title: 'Total', value: pigStore.stats.totalPigs },
  { title: 'Actifs', value: pigStore.stats.activePigs },
  { title: 'Truies gestantes', value: pigStore.stats.pregnantSows },
  { title: 'Porcelets', value: pigStore.stats.piglets }
])

const activeFilters = computed(() => {
  const filters = []
  if (searchQuery.value) {
    filters.push({
      key: 'search',
      label: 'Recherche',
      value: searchQuery.value
    })
  }
  // Vous pouvez ajouter d'autres filtres ici
  return filters
})

// Méthodes
const handleSearch = (query) => {
  searchQuery.value = query
  pigStore.searchQuery = query
  currentPage.value = 1
}

const addNewPig = () => {
  router.push({ name: 'add-pig' })
}

const viewPigDetails = (pig) => {
  router.push({ 
    name: 'pig-details', 
    params: { id: pig.id } 
  })
}

const toggleFavorite = (pig) => {
  pig.isFavorite = !pig.isFavorite
  // Vous pourriez vouloir sauvegarder ce changement dans le store
}

const refreshData = () => {
  pigStore.updateStats()
}

const exportToCSV = () => {
  console.log('Export CSV des porcs')
  // Implémenter l'export CSV
}

const printList = () => {
  console.log('Impression de la liste')
  window.print()
}

const showArchived = () => {
  console.log('Voir les archives')
  // router.push({ name: 'pig-archive' })
}

const openStatistics = () => {
  console.log('Ouvrir les statistiques')
  // router.push({ name: 'pig-statistics' })
}

const removeFilter = (key) => {
  if (key === 'search') {
    searchQuery.value = ''
    pigStore.searchQuery = ''
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  pigStore.searchQuery = ''
  filters.value = {}
}

const clearFiltersAndSearch = () => {
  clearFilters()
  currentPage.value = 1
}

const getFilterColor = (key) => {
  const colors = {
    search: 'primary',
    category: 'green',
    status: 'orange',
    healthStatus: 'red'
  }
  return colors[key] || 'grey'
}

onMounted(() => {
  console.log('PigList component mounted')
  pigStore.updateStats()
})
</script>

<style scoped>
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

.v-pagination {
  justify-content: center;
}

@media (max-width: 600px) {
  .v-col-sm-6 {
    padding: 8px;
  }
  
  .v-card {
    margin-bottom: 16px;
  }
  
  .v-select {
    width: 100px !important;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>