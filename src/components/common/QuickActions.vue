<template>
  <div class="quick-actions">
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      location="bottom end"
      offset-y
      max-width="300"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          color="primary"
          variant="tonal"
          size="small"
          class="mr-1"
          icon
        >
          <v-icon size="small">mdi-lightning-bolt</v-icon>
        </v-btn>
      </template>

      <v-card class="pa-2" elevation="4">
        <div class="text-subtitle-2 font-weight-bold mb-2">Actions rapides</div>
        <v-list density="compact" class="py-0">
          <v-list-item 
            v-for="action in actions" 
            :key="action.id"
            @click="handleAction(action)"
            class="px-2 py-1 mb-1"
            :disabled="action.disabled"
          >
            <template v-slot:prepend>
              <v-icon :color="action.color" size="small">{{ action.icon }}</v-icon>
            </template>
            <v-list-item-title class="text-caption">{{ action.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-caption text-grey">{{ action.subtitle }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'

const router = useRouter()
const pigStore = usePigStore()

const showMenu = ref(false)

const actions = computed(() => [
  { 
    id: 1, 
    icon: 'mdi-pig-plus', 
    title: 'Ajouter un porc', 
    subtitle: 'Nouvelle entrée', 
    action: 'addPig', 
    color: 'primary' 
  },
  { 
    id: 2, 
    icon: 'mdi-needle', 
    title: 'Enregistrer vaccination', 
    subtitle: 'Nouvelle vaccination', 
    action: 'vaccination', 
    color: 'orange' 
  },
  { 
    id: 3, 
    icon: 'mdi-silverware-fork-knife', 
    title: 'Ajouter alimentation', 
    subtitle: 'Nouveau repas', 
    action: 'feeding', 
    color: 'green' 
  },
  { 
    id: 4, 
    icon: 'mdi-baby-bottle', 
    title: 'Enregistrer mise bas', 
    subtitle: 'Nouvelle portée', 
    action: 'delivery', 
    color: 'blue' 
  },
  { 
    id: 5, 
    icon: 'mdi-scale-bathroom', 
    title: 'Pesée', 
    subtitle: 'Contrôle de poids', 
    action: 'weighing', 
    color: 'purple' 
  },
  { 
    id: 6, 
    icon: 'mdi-account-plus', 
    title: 'Ajouter client', 
    subtitle: 'Nouveau client', 
    action: 'customer', 
    color: 'teal' 
  },
  { 
    id: 7, 
    icon: 'mdi-cash', 
    title: 'Nouvelle vente', 
    subtitle: 'Vendre un porc', 
    action: 'sale', 
    color: 'green-darken-2' 
  },
  { 
    id: 8, 
    icon: 'mdi-file-document', 
    title: 'Générer rapport', 
    subtitle: 'Rapport mensuel', 
    action: 'report', 
    color: 'blue-grey' 
  }
])

const handleAction = (action) => {
  showMenu.value = false
  console.log('Action rapide:', action.action)
  
  // Navigation selon l'action
  switch(action.action) {
    case 'addPig':
      router.push({ name: 'add-pig' })
      break
    case 'vaccination':
      router.push({ name: 'vaccinations' })
      break
    case 'feeding':
      router.push({ name: 'feed-management' })
      break
    case 'delivery':
      router.push({ name: 'deliveries' })
      break
    case 'weighing':
      router.push({ name: 'weighing' })
      break
    case 'customer':
      router.push({ name: 'sales' })
      break
    case 'sale':
      router.push({ name: 'sales' })
      break
    case 'report':
      generateReport()
      break
  }
}

const generateReport = () => {
  console.log('Génération du rapport...')
  // Logique de génération de rapport
}
</script>

<style scoped>
.quick-actions .v-list-item {
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-actions .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transform: translateX(2px);
}

.quick-actions .v-list-item:active {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>