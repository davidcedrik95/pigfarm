<template>
  <v-app-bar color="primary" density="compact" flat class="elevation-2">
    <!-- Hamburger Menu -->
    <v-app-bar-nav-icon 
      @click.stop="toggleDrawer" 
      variant="text"
      size="small"
    ></v-app-bar-nav-icon>
    
    <!-- Logo & App Name -->
    <v-toolbar-title class="text-h6 font-weight-bold d-flex align-center">
      <v-icon icon="mdi-pig" size="small" class="mr-2"></v-icon>
      <span class="d-none d-sm-flex">PigFarm Manager</span>
      <span class="d-sm-none">PigFarm</span>
      <v-chip 
        color="white" 
        size="x-small" 
        class="ml-2 text-primary" 
        v-if="currentUser"
        density="compact"
      >
        {{ getUserRoleLabel() }}
      </v-chip>
    </v-toolbar-title>
    
    <v-spacer></v-spacer>
    
    <!-- Quick Actions -->
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props"
          color="white" 
          variant="tonal" 
          @click="toggleQuickActions"
          class="mr-1"
          size="small"
          icon="mdi-plus"
        >
          <v-icon size="small">mdi-plus</v-icon>
        </v-btn>
      </template>
      <span>Actions rapides</span>
    </v-tooltip>
    
    <!-- Notifications -->
    <v-tooltip location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn 
          v-bind="props"
          icon 
          @click="toggleNotifications" 
          size="small"
          class="mr-1"
        >
          <v-badge 
            :content="notificationCount" 
            color="error" 
            :model-value="notificationCount > 0"
            size="small"
          >
            <v-icon size="small">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <span>Notifications ({{ notificationCount }})</span>
    </v-tooltip>
    
    <!-- Quick Actions Menu -->
    <v-menu
      v-model="showQuickActionsMenu"
      :close-on-content-click="true"
      location="bottom end"
      offset-y
      style="max-width: 300px;"
    >
      <template v-slot:activator="{ props }">
        <div style="display: none;"></div>
      </template>
      <v-card class="pa-2" elevation="4">
        <div class="text-subtitle-2 font-weight-bold mb-2">Actions rapides</div>
        <v-list density="compact" class="py-0">
          <v-list-item 
            v-for="action in quickActions" 
            :key="action.id"
            @click="handleQuickAction(action.action)"
            class="px-2 py-1 mb-1"
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
    
    <!-- Search -->
    <v-text-field
      density="compact"
      variant="outlined"
      placeholder="Rechercher..."
      prepend-inner-icon="mdi-magnify"
      class="mr-2 mt-2 search-field"
      style="max-width: 200px;"
      hide-details
      single-line
      @click:clear="clearSearch"
      clearable
      v-model="searchQuery"
    ></v-text-field>
    
    <!-- User Menu -->
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn 
          variant="text" 
          v-bind="props" 
          size="small"
          class="px-1"
        >
          <v-avatar size="32" color="white" class="mr-1">
            <span class="text-primary text-subtitle-2">{{ getUserInitials() }}</span>
          </v-avatar>
          <span class="text-caption d-none d-md-inline">{{ currentUser?.name || currentUser?.username }}</span>
          <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list density="compact">
        <v-list-item @click="openUserProfile">
          <template v-slot:prepend>
            <v-icon size="small">mdi-account-cog</v-icon>
          </template>
          <v-list-item-title class="text-caption">Profil utilisateur</v-list-item-title>
        </v-list-item>
        <v-list-item @click="toggleTheme" class="mb-1">
          <template v-slot:prepend>
            <v-icon size="small">{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
          </template>
          <v-list-item-title class="text-caption">
            {{ isDarkTheme ? 'Mode clair' : 'Mode sombre' }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleLogout" color="error" density="compact">
          <template v-slot:prepend>
            <v-icon size="small">mdi-logout</v-icon>
          </template>
          <v-list-item-title class="text-caption">Déconnexion</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'

const router = useRouter()
const pigStore = usePigStore()

const isDarkTheme = ref(false)
const showQuickActionsMenu = ref(false)

// Computed
const currentUser = computed(() => pigStore.currentUser)
const quickActions = computed(() => pigStore.quickActions)
const notificationCount = computed(() => pigStore.notificationCount)
const searchQuery = computed({
  get: () => pigStore.searchQuery,
  set: (value) => { pigStore.searchQuery = value }
})

// Méthodes
const toggleDrawer = () => {
  pigStore.toggleDrawer()
}

const toggleNotifications = () => {
  pigStore.showNotifications = !pigStore.showNotifications
}

const toggleQuickActions = () => {
  showQuickActionsMenu.value = !showQuickActionsMenu.value
}

const handleQuickAction = (action) => {
  showQuickActionsMenu.value = false
  pigStore.quickAction(action)
  
  // Navigation selon l'action
  switch(action) {
    case 'addPig':
      router.push({ name: 'add-pig' })
      break
    case 'vaccination':
      router.push({ name: 'vaccinations' })
      break
    case 'feeding':
      router.push({ name: 'feed-management' })
      break
  }
}

const clearSearch = () => {
  pigStore.searchQuery = ''
}

const getUserInitials = () => {
  if (!currentUser.value || !currentUser.value.name) return '?'
  return currentUser.value.name.charAt(0).toUpperCase()
}

const getUserRoleLabel = () => {
  const labels = {
    admin: 'Admin',
    farmer: 'Éleveur',
    technician: 'Technicien',
    veterinarian: 'Vétérinaire',
    guest: 'Invité'
  }
  return labels[currentUser.value?.role] || currentUser.value?.role || 'Utilisateur'
}

const openUserProfile = () => {
  console.log('Ouvrir le profil utilisateur')
  // Implémenter la navigation vers le profil
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('theme--dark', isDarkTheme.value)
}

const handleLogout = () => {
  console.log('Déconnexion')
  localStorage.removeItem('currentUser')
  pigStore.currentUser = null
  router.push({ name: 'login' })
}
</script>

<style scoped>
:deep(.v-toolbar) {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-field :deep(.v-field) {
  font-size: 0.875rem !important;
}

.search-field :deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

@media (max-width: 600px) {
  .search-field {
    max-width: 120px !important;
  }
}
</style>