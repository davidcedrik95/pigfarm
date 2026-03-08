<template>
  <div class="notifications">
    <v-menu
      v-model="showMenu"
      :close-on-content-click="false"
      location="bottom end"
      offset-y
      max-width="350"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          icon
          size="small"
          class="mr-1"
        >
          <v-badge
            :content="unreadCount"
            color="error"
            :model-value="unreadCount > 0"
            size="small"
          >
            <v-icon size="small">mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>

      <v-card class="notifications-card" elevation="4">
        <v-toolbar density="compact" flat>
          <v-toolbar-title class="text-subtitle-1">Notifications</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn 
            icon 
            size="small"
            @click="markAllAsRead"
            :disabled="unreadCount === 0"
          >
            <v-icon size="small">mdi-check-all</v-icon>
          </v-btn>
        </v-toolbar>
        
        <v-list density="compact" class="py-0" max-height="400" style="overflow-y: auto;">
          <v-list-item
            v-for="notification in notifications"
            :key="notification.id"
            :class="{ 'unread': !notification.read }"
            @click="handleNotification(notification)"
          >
            <template v-slot:prepend>
              <v-icon :color="notification.color" size="small">{{ notification.icon }}</v-icon>
            </template>
            
            <v-list-item-title class="text-caption font-weight-medium">
              {{ notification.title }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ notification.message }}
              <div class="text-caption text-grey mt-1">
                {{ formatTime(notification.time) }}
              </div>
            </v-list-item-subtitle>
            
            <template v-slot:append>
              <v-btn
                icon
                size="x-small"
                variant="text"
                @click.stop="removeNotification(notification.id)"
              >
                <v-icon size="small">mdi-close</v-icon>
              </v-btn>
            </template>
          </v-list-item>
          
          <v-list-item v-if="notifications.length === 0">
            <v-list-item-title class="text-grey text-center">
              Aucune notification
            </v-list-item-title>
          </v-list-item>
        </v-list>
        
        <v-card-actions v-if="notifications.length > 0" class="justify-center">
          <v-btn
            variant="text"
            size="small"
            @click="clearAllNotifications"
          >
            Tout effacer
          </v-btn>
          <v-btn
            variant="text"
            size="small"
            @click="showAllNotifications"
          >
            Voir tout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePigStore } from '@/stores/pigStore'

const router = useRouter()
const pigStore = usePigStore()

const showMenu = ref(false)

// Computed properties
const notifications = computed(() => pigStore.notifications)
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// Méthodes
const formatTime = (timeString) => {
  const time = new Date(timeString)
  const now = new Date()
  const diff = Math.floor((now - time) / 1000) // Différence en secondes
  
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minutes`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heures`
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} jours`
  
  return time.toLocaleDateString()
}

const handleNotification = (notification) => {
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
    case 'system':
      // Notification système, pas de navigation
      break
  }
  
  showMenu.value = false
}

const removeNotification = (id) => {
  pigStore.notifications = pigStore.notifications.filter(n => n.id !== id)
}

const markAllAsRead = () => {
  pigStore.notifications.forEach(n => n.read = true)
}

const clearAllNotifications = () => {
  pigStore.notifications = []
}

const showAllNotifications = () => {
  showMenu.value = false
  // Naviguer vers une page qui liste toutes les notifications
  console.log('Afficher toutes les notifications')
  // router.push({ name: 'notifications' })
}

// Simuler de nouvelles notifications
let notificationInterval

onMounted(() => {
  // Simulation de notifications périodiques
  notificationInterval = setInterval(() => {
    // Ajouter une notification aléatoire de temps en temps
    if (Math.random() > 0.8) {
      const notificationTypes = [
        {
          icon: 'mdi-information',
          title: 'Rappel quotidien',
          message: 'Vérifier les animaux et les stocks',
          color: 'info',
          type: 'system'
        },
        {
          icon: 'mdi-food',
          title: 'Stock bas',
          message: 'Aliment croissance : 200kg restant',
          color: 'warning',
          type: 'feed'
        },
        {
          icon: 'mdi-temperature-celsius',
          title: 'Température élevée',
          message: 'Enclos A : 28°C',
          color: 'error',
          type: 'system'
        }
      ]
      
      const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
      
      pigStore.addNotification({
        ...randomType,
        id: Date.now(),
        time: new Date().toISOString(),
        read: false
      })
    }
  }, 60000) // Toutes les minutes
})

onUnmounted(() => {
  if (notificationInterval) {
    clearInterval(notificationInterval)
  }
})
</script>

<style scoped>
.notifications-card {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.notifications-card .v-list {
  flex: 1;
  overflow-y: auto;
}

.notifications-card .v-list-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.notifications-card .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.notifications-card .v-list-item.unread {
  background-color: rgba(33, 150, 243, 0.05);
  border-left: 3px solid #2196F3;
}

.notifications-card .v-list-item.unread:hover {
  background-color: rgba(33, 150, 243, 0.08);
}

.notifications-card .v-list-item:last-child {
  border-bottom: none;
}

.notifications-card .v-card-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px;
}
</style>