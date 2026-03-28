import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE_URL = 'http://localhost/pigfarm/api' // Adapter

export const usePigStore = defineStore('pig', () => {
  // États
  const pigs = ref([])
  const currentUser = ref(null)
  const notifications = ref([])
  const activeTab = ref('dashboard')
  const drawer = ref(true)
  const rail = ref(false)
  const searchQuery = ref('')
  const showNotifications = ref(false)
  const loading = ref(false)

  // Autres données mockées (à remplacer plus tard par des appels API)
  const upcomingVaccinations = ref([])
  const recentActivities = ref([])
  const dueInspections = ref([])

  // Statistiques
  const stats = ref({
    totalPigs: 0,
    activePigs: 0,
    pregnantSows: 0,
    piglets: 0,
    dueVaccinations: 0,
    overdueVaccinations: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalTasks: 0,
    activeTasks: 0,
    monthlyFeedConsumption: 0,
    averageDailyGain: 0,
    feedConversionRatio: 0
  })

  // Computed
  const filteredPigs = computed(() => {
    if (!searchQuery.value) return pigs.value
    return pigs.value.filter(pig =>
      pig.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.breed?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.earTag?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const notificationCount = computed(() =>
    notifications.value.filter(n => !n.is_read).length
  )

  const modernStats = computed(() => [
    {
      title: 'Porcs Totaux',
      value: stats.value.totalPigs,
      subtitle: `${stats.value.activePigs} actifs`,
      description: 'Effectif total',
      icon: 'mdi-pig',
      cardColor: '#E8F5E9',
      footerColor: '#4CAF50',
      textColor: '#1B5E20',
      subtitleColor: '#388E3C',
      footerTextColor: '#FFFFFF',
      iconColor: '#4CAF50',
      iconBgColor: 'rgba(76, 175, 80, 0.1)',
      action: () => setActiveTab('pig-list')
    },
    {
      title: 'Truies Gestantes',
      value: stats.value.pregnantSows,
      subtitle: `${stats.value.piglets} porcelets`,
      description: 'Reproduction',
      icon: 'mdi-baby-bottle',
      cardColor: '#FFF3E0',
      footerColor: '#FF9800',
      textColor: '#E65100',
      subtitleColor: '#FF5722',
      footerTextColor: '#FFFFFF',
      iconColor: '#FF9800',
      iconBgColor: 'rgba(255, 152, 0, 0.1)',
      action: () => setActiveTab('breeding')
    },
    {
      title: 'Vaccinations',
      value: stats.value.dueVaccinations,
      subtitle: stats.value.overdueVaccinations > 0 ? `${stats.value.overdueVaccinations} en retard` : '',
      description: 'À effectuer',
      icon: 'mdi-needle',
      cardColor: '#FFEBEE',
      footerColor: '#F44336',
      textColor: '#B71C1C',
      subtitleColor: '#D32F2F',
      footerTextColor: '#FFFFFF',
      iconColor: '#F44336',
      iconBgColor: 'rgba(244, 67, 54, 0.1)',
      action: () => setActiveTab('vaccinations')
    },
    {
      title: 'Performance',
      value: `${stats.value.averageDailyGain}g`,
      subtitle: `Ratio: ${stats.value.feedConversionRatio}`,
      description: 'Croissance journalière',
      icon: 'mdi-chart-line',
      cardColor: '#E3F2FD',
      footerColor: '#2196F3',
      textColor: '#0D47A1',
      subtitleColor: '#1976D2',
      footerTextColor: '#FFFFFF',
      iconColor: '#2196F3',
      iconBgColor: 'rgba(33, 150, 243, 0.1)',
      action: () => setActiveTab('performance')
    }
  ])

  const quickActions = ref([
    { id: 1, icon: 'mdi-pig-plus', title: 'Ajouter un porc', subtitle: 'Nouvelle entrée', action: 'addPig', color: 'primary' },
    { id: 2, icon: 'mdi-needle', title: 'Enregistrer vaccination', subtitle: 'Nouvelle vaccination', action: 'vaccination', color: 'orange' },
    { id: 3, icon: 'mdi-silverware-fork-knife', title: 'Ajouter alimentation', subtitle: 'Nouveau repas', action: 'feeding', color: 'green' },
    { id: 4, icon: 'mdi-baby-bottle', title: 'Enregistrer mise bas', subtitle: 'Nouvelle portée', action: 'delivery', color: 'blue' },
    { id: 5, icon: 'mdi-scale-bathroom', title: 'Pesée', subtitle: 'Contrôle de poids', action: 'weighing', color: 'purple' },
    { id: 6, icon: 'mdi-account-plus', title: 'Ajouter client', subtitle: 'Nouveau client', action: 'customer', color: 'teal' }
  ])

  // Méthodes API
  const fetchPigs = async () => {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE_URL}/getPigs.php`)
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      pigs.value = data
      updateStats()
    } catch (error) {
      console.error('Erreur fetchPigs:', error)
    } finally {
      loading.value = false
    }
  }

  const addPig = async (pigData) => {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE_URL}/addPig.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pigData)
      })
      const result = await res.json()
      if (result.success) {
        await fetchPigs()
        return result
      } else {
        throw new Error(result.error || 'Erreur ajout')
      }
    } catch (error) {
      console.error('addPig error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePig = async (id, pigData) => {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE_URL}/updatePig.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...pigData })
      })
      const result = await res.json()
      if (result.success) {
        await fetchPigs()
        return result
      } else {
        throw new Error(result.error || 'Erreur mise à jour')
      }
    } catch (error) {
      console.error('updatePig error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deletePig = async (id) => {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE_URL}/deletePig.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const result = await res.json()
      if (result.success) {
        await fetchPigs()
        return true
      } else {
        throw new Error(result.error || 'Erreur suppression')
      }
    } catch (error) {
      console.error('deletePig error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getPigById = (id) => pigs.value.find(p => p.id === id)

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getStats.php`)
      const data = await res.json()
      stats.value = { ...stats.value, ...data }
    } catch (error) {
      console.error('fetchStats error:', error)
    }
  }

  const fetchNotifications = async () => {
    if (!currentUser.value) return
    try {
      const res = await fetch(`${API_BASE_URL}/getNotifications.php?user_id=${currentUser.value.id}`)
      const data = await res.json()
      notifications.value = data
    } catch (error) {
      console.error('fetchNotifications error:', error)
    }
  }

  const addNotification = async (notification) => {
    try {
      const res = await fetch(`${API_BASE_URL}/addNotification.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...notification,
          user_id: currentUser.value?.id || 0,
          is_read: false
        })
      })
      const result = await res.json()
      if (result.success) await fetchNotifications()
    } catch (error) {
      console.error('addNotification error:', error)
    }
  }

  const markNotificationAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/markNotificationRead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      const notif = notifications.value.find(n => n.id === id)
      if (notif) notif.is_read = true
    } catch (error) {
      console.error('markNotificationAsRead error:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!currentUser.value) return
    try {
      await fetch(`${API_BASE_URL}/markAllNotificationsRead.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.value.id })
      })
      notifications.value.forEach(n => n.is_read = true)
    } catch (error) {
      console.error('markAllAsRead error:', error)
    }
  }

  const clearNotifications = async () => {
    if (!currentUser.value) return
    try {
      await fetch(`${API_BASE_URL}/clearNotifications.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.value.id })
      })
      notifications.value = []
    } catch (error) {
      console.error('clearNotifications error:', error)
    }
  }

  const login = async (username, password) => {
    loading.value = true
    try {
      const res = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const result = await res.json()
      if (result.success) {
        currentUser.value = result.user
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        await fetchNotifications()
        return true
      } else {
        throw new Error(result.error || 'Identifiants invalides')
      }
    } catch (error) {
      console.error('login error:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem('currentUser')
    notifications.value = []
  }

  const updateStats = () => {
    stats.value.totalPigs = pigs.value.length
    stats.value.activePigs = pigs.value.filter(p => p.status === 'active').length
    stats.value.pregnantSows = pigs.value.filter(p => p.category === 'sow' && p.status === 'pregnant').length
    stats.value.piglets = pigs.value.filter(p => p.category === 'piglet').length
  }

  // UI
  const toggleDrawer = () => { drawer.value = !drawer.value }
  const toggleRail = () => { rail.value = !rail.value }
  const setActiveTab = (tab) => { activeTab.value = tab }

  const quickAction = (action) => {
    const router = useRouter()
    switch (action) {
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
      default:
        console.warn('Action rapide inconnue:', action)
    }
  }

  // Initialisation
  const initializeStore = async () => {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      try {
        currentUser.value = JSON.parse(userData)
      } catch (error) {
        console.error('Erreur parsing utilisateur:', error)
      }
    }
    await fetchPigs()
    await fetchStats()
    if (currentUser.value) await fetchNotifications()
  }

  initializeStore()

  return {
    // États
    pigs,
    currentUser,
    notifications,
    activeTab,
    drawer,
    rail,
    searchQuery,
    showNotifications,
    loading,

    // Computed
    filteredPigs,
    modernStats,
    notificationCount,
    quickActions,

    // Données
    stats,
    upcomingVaccinations,
    recentActivities,
    dueInspections,

    // Méthodes
    fetchPigs,
    addPig,
    updatePig,
    deletePig,
    getPigById,
    fetchStats,
    fetchNotifications,
    addNotification,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications,
    login,
    logout,
    toggleDrawer,
    toggleRail,
    setActiveTab,
    quickAction
  }
})