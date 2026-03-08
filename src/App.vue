<template>
  <v-app>
    <!-- Sidebar -->
    <Sidebar v-if="isAuthenticated" />
    
    <!-- App Bar -->
    <AppHeader v-if="isAuthenticated" />
    
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
    
    <!-- Notifications Panel -->
    <NotificationsPanel v-if="isAuthenticated" />
    
    <!-- Footer -->
    <AppFooter v-if="isAuthenticated && showFooter" />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

// Composants
import Sidebar from './components/layout/Sidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import NotificationsPanel from './components/common/NotificationsPanel.vue'

const route = useRoute()

// États
const isAuthenticated = computed(() => {
  const user = localStorage.getItem('currentUser')
  return user !== null && user !== undefined
})

const showFooter = computed(() => {
  // Ne pas afficher le footer sur certaines pages
  const hideOnRoutes = ['login']
  return !hideOnRoutes.includes(route.name)
})

// Surveillance de l'authentification
watch(isAuthenticated, (newValue) => {
  console.log('État d\'authentification changé:', newValue)
}, { immediate: true })

onMounted(() => {
  console.log('Application PigFarm Manager démarrée')
  
  // Vérifier la présence des données utilisateur
  const userData = localStorage.getItem('currentUser')
  if (userData) {
    try {
      const user = JSON.parse(userData)
      console.log('Utilisateur connecté:', user.username)
    } catch (error) {
      console.error('Erreur lors de la lecture des données utilisateur:', error)
    }
  }
})
</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
}

/* Styles pour les transitions de page */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Styles pour les cartes */
.v-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Styles pour les boutons */
.v-btn {
  text-transform: none !important;
  letter-spacing: normal !important;
}

/* Responsive utilities */
@media (max-width: 600px) {
  .hidden-sm {
    display: none !important;
  }
}

@media (max-width: 960px) {
  .hidden-md {
    display: none !important;
  }
}
</style>