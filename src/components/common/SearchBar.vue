<template>
  <v-text-field
    v-model="internalSearch"
    density="compact"
    variant="outlined"
    :placeholder="placeholder"
    prepend-inner-icon="mdi-magnify"
    hide-details
    single-line
    @keyup.enter="onSearch"
    @click:clear="onClear"
    @update:model-value="onInput"
    clearable
    class="search-bar"
    :style="{ maxWidth: maxWidth }"
  >
    <template v-slot:append v-if="showAdvanced">
      <v-menu location="bottom end" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            size="small"
            variant="text"
            class="ml-1"
          >
            <v-icon size="small">mdi-filter-variant</v-icon>
          </v-btn>
        </template>
        <v-card class="pa-2" width="250">
          <div class="text-caption font-weight-bold mb-2">Filtres avancés</div>
          
          <v-select
            v-model="filters.category"
            :items="categories"
            label="Catégorie"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-2"
            clearable
          />
          
          <v-select
            v-model="filters.status"
            :items="statuses"
            label="Statut"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-2"
            clearable
          />
          
          <v-select
            v-model="filters.healthStatus"
            :items="healthStatuses"
            label="État de santé"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-2"
            clearable
          />
          
          <v-select
            v-model="filters.location"
            :items="locations"
            label="Localisation"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-2"
            clearable
          />
          
          <v-select
            v-model="filters.breed"
            :items="breeds"
            label="Race"
            density="compact"
            variant="outlined"
            hide-details
            class="mb-2"
            clearable
          />
          
          <div class="d-flex justify-space-between mt-3">
            <v-btn
              size="x-small"
              variant="text"
              @click="resetFilters"
            >
              Réinitialiser
            </v-btn>
            <v-btn
              size="x-small"
              color="primary"
              @click="applyFilters"
            >
              Appliquer
            </v-btn>
          </div>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue'
import { usePigStore } from '@/stores/pigStore'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Rechercher...'
  },
  maxWidth: {
    type: String,
    default: '300px'
  },
  showAdvanced: {
    type: Boolean,
    default: true
  },
  autoFocus: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'filter'])

const pigStore = usePigStore()

const internalSearch = ref(props.modelValue)

// Filtres avancés
const filters = ref({
  category: null,
  status: null,
  healthStatus: null,
  location: null,
  breed: null
})

const categories = ref([
  { title: 'Verrat', value: 'boar' },
  { title: 'Truie', value: 'sow' },
  { title: 'Porcelet', value: 'piglet' },
  { title: 'Élevage', value: 'grower' },
  { title: 'Finition', value: 'finisher' }
])

const statuses = ref([
  { title: 'Actif', value: 'active' },
  { title: 'Malade', value: 'sick' },
  { title: 'Gestante', value: 'pregnant' },
  { title: 'Vendu', value: 'sold' },
  { title: 'Inactif', value: 'inactive' }
])

const healthStatuses = ref([
  { title: 'En bonne santé', value: 'healthy' },
  { title: 'Malade', value: 'sick' },
  { title: 'En convalescence', value: 'recovering' },
  { title: 'Sous traitement', value: 'treatment' }
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

// Surveiller les changements de la recherche interne
watch(internalSearch, (newValue) => {
  emit('update:modelValue', newValue)
})

// Surveiller les changements de la valeur du modèle
watch(() => props.modelValue, (newValue) => {
  internalSearch.value = newValue
})

const onSearch = () => {
  emit('search', internalSearch.value)
}

const onInput = () => {
  emit('search', internalSearch.value)
}

const onClear = () => {
  internalSearch.value = ''
  emit('search', '')
  resetFilters()
}

const applyFilters = () => {
  emit('filter', filters.value)
}

const resetFilters = () => {
  filters.value = {
    category: null,
    status: null,
    healthStatus: null,
    location: null,
    breed: null
  }
  emit('filter', filters.value)
}

// Focus automatique
onMounted(() => {
  if (props.autoFocus) {
    const searchInput = document.querySelector('.search-bar input')
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 100)
    }
  }
})
</script>

<style scoped>
.search-bar {
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  max-width: 400px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar .v-field__append-inner {
  padding-left: 8px;
}

@media (max-width: 600px) {
  .search-bar {
    max-width: 150px !important;
  }
  
  .search-bar:focus-within {
    max-width: 250px !important;
  }
  
  .search-bar .v-menu {
    display: none;
  }
}
</style>