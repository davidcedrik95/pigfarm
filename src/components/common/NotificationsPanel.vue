<template>
  <v-navigation-drawer
    v-model="showPanel"
    location="right"
    temporary
    width="320"
    class="notifications-panel"
  >
    <v-toolbar density="compact" flat class="panel-header">
      <v-toolbar-title class="text-subtitle-1">
        Notifications
        <v-badge
          v-if="unreadCount > 0"
          :content="unreadCount"
          color="error"
          inline
          class="ml-2"
        ></v-badge>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon="mdi-close" @click="closePanel" size="small"></v-btn>
    </v-toolbar>
    
    <div class="panel-actions px-3 py-2">
      <v-btn
        variant="tonal"
        size="small"
        @click="markAllAsRead"
        :disabled="unreadCount === 0"
        class="mr-2"
      >
        <v-icon left size="small">mdi-check-all</v-icon>
        Tout marquer comme lu
      </v-btn>
      <v-btn
        variant="tonal"
        size="small"
        @click="clearAll"
        :disabled="notifications.length === 0"
        color="error"
      >
        <v-icon left size="small">mdi-delete</v-icon>
        Tout effacer
      </v-btn>
    </div>
    
    <v-divider></v-divider>
    
    <v-list density="compact" class="py-0 notifications-list">
      <v-list-item
        v-for="notification in notifications"
        :key="notification.id"
        :class="{ 'notification-unread': !notification.read }"
        @click="handleNotificationClick(notification)"
        class="notification-item"
      >
        <template v-slot:prepend>
          <v-avatar size="36" :color="getNotificationColor(notification)" class="notification-icon">
            <v-icon :color="notification.color || 'white'" size="small">
              {{ notification.icon || 'mdi-bell' }}
            </v-icon>
          </v-avatar>
        </template>
        
        <v-list-item-title class="text-caption font-weight-medium">
          {{ notification.title }}
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption">
          {{ notification.message }}
        </v-list-item-subtitle>
        
        <div class="notification-time text-caption text-grey">
          {{ formatTime(notification.time) }}
        </div>
        
        <template v-slot:append>
          <v-btn
            icon
            size="x-small"
            variant="text"
            @click.stop="removeNotification(notification.id)"
            class="notification-delete-btn"
          >
            <v-icon size="small">mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
      
      <v-list-item v-if="notifications.length === 0">
        <v-list-item-title class="text-grey text-center py-4">
          <v-icon size="large" class="mb-2" color="grey-lighten-1">mdi-bell-off</v-icon>
          <div>Aucune notification</div>
        </v-list-item-title>
      </v-list-item>
    </v-list>
    
    <template v-slot:append>
      <div class="pa-3 text-center">
        <v-btn
          variant="text"
          size="small"
          block
          @click="openNotificationSettings"
        >
          <v-icon left size="small">mdi-cog</v-icon>
          Paramètres des notifications
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'

const router = useRouter()
const pigStore = usePigStore()

const showPanel = ref(false)

// Computed properties
const notifications = computed(() => pigStore.notifications)
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Surveiller l'état du store
watch(() => pigStore.showNotifications, (newValue) => {
  showPanel.value = newValue
})

// Surveiller l'état local pour mettre à jour le store
watch(showPanel, (newValue) => {
  pigStore.showNotifications = newValue
})

// Méthodes
const getNotificationColor = (notification) => {
  const colors = {
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',
    primary: '#1976D2'
  }
  return colors[notification.color] || colors.info
}

const formatTime = (timeString) => {
  const time = new Date(timeString)
  const now = new Date()
  const diff = Math.floor((now - time) / 1000) // Différence en secondes
  
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`
  
  return time.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: time.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

const handleNotificationClick = (notification) => {
  // Marquer comme lu
  notification.read = true
  
  // Action selon le type de notification
  switch(notification.type) {
    case 'vaccination':
      router.push({ name: 'vaccinations' })
      break
    case 'pig':
      if (notification.pigId) {
        router.push({ name: 'pig-details', params: { id: notification.pigId } })
      }
      break
    case 'delivery':
      router.push({ name: 'deliveries' })
      break
    case 'feed':
      router.push({ name: 'feed-management' })
      break
    case 'health':
      if (notification.pigId) {
        router.push({ name: 'pig-details', params: { id: notification.pigId } })
      }
      break
    case 'system':
      // Notification système, pas de navigation
      break
  }
  
  closePanel()
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  pigStore.notifications = []
}

const closePanel = () => {
  showPanel.value = false
}

const openNotificationSettings = () => {
  closePanel()
  console.log('Ouvrir les paramètres des notifications')
  // Implémenter la navigation vers les paramètres
  // router.push({ name: 'notification-settings' })
}

// Exemple de création de notification de test
const createTestNotification = () => {
  const testNotifications = [
    {
      id: Date.now(),
      icon: 'mdi-needle',
      title: 'Vaccination en retard',
      message: 'La vaccination PCV2 pour le porc #P001 est en retard',
      color: 'error',
      type: 'vaccination',
      time: new Date().toISOString(),
      read: false
    },
    {
      id: Date.now() + 1,
      icon: 'mdi-food',
      title: 'Stock bas',
      message: 'Aliment croissance : seulement 200kg restant',
      color: 'warning',
      type: 'feed',
      time: new Date(Date.now() - 3600000).toISOString(), // 1 heure avant
      read: false
    },
    {
      id: Date.now() + 2,
      icon: 'mdi-baby-bottle',
      title: 'Mise bas imminente',
      message: 'La truie Rose devrait mettre bas dans 3 jours',
      color: 'primary',
      type: 'delivery',
      time: new Date(Date.now() - 7200000).toISOString(), // 2 heures avant
      read: true
    }
  ]
  
  testNotifications.forEach(notification => {
    pigStore.notifications.unshift(notification)
  })
}

// Pour les tests, vous pouvez appeler createTestNotification() dans onMounted
</script>

<style scoped>
.notifications-panel {
  z-index: 9999 !important;
}

.panel-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
}

.panel-actions {
  background-color: #f8f9fa;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.notifications-list {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
}

.notification-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 12px 16px;
}

.notification-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.notification-item.notification-unread {
  background-color: rgba(33, 150, 243, 0.05);
  border-left: 3px solid #2196F3;
}

.notification-item.notification-unread:hover {
  background-color: rgba(33, 150, 243, 0.08);
}

.notification-icon {
  margin-right: 12px;
}

.notification-time {
  margin-top: 4px;
  font-size: 0.7rem;
}

.notification-delete-btn {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification-item:hover .notification-delete-btn {
  opacity: 1;
}

/* Scrollbar personnalisée */
.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 600px) {
  .notifications-panel {
    width: 100% !important;
    max-width: 320px;
  }
  
  .notification-item {
    padding: 10px 12px;
  }
}
</style>