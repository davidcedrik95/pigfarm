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

  // Autres données mockées (à remplacer par des appels API)
  const upcomingVaccinations = ref([])  // à peupler plus tard
  const recentActivities = ref([])
  const dueInspections = ref([])

  // Données alimentaires
  const feedSummary = ref({
    dailyConsumption: 0,
    feedEfficiency: 2.8,
    feedStock: 0,
    dailyFeedCost: 0
  })

  // Statistiques (on peut garder pour d'autres usages, mais modernStats va être recalculé directement)
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

  // Nouveau computed pour les statistiques avancées
  const pigStats = computed(() => {
    const totalPigs = pigs.value.length
    const activePigs = pigs.value.filter(p => p.status === 'active').length
    const inactivePigs = totalPigs - activePigs
    const pregnantSows = pigs.value.filter(p => p.category === 'sow' && p.status === 'pregnant').length
    const expectedPiglets = pigs.value
      .filter(p => p.category === 'sow' && p.status === 'pregnant')
      .reduce((sum, sow) => sum + (sow.expectedLitterSize || 0), 0)

    // Vaccinations : ici on suppose que upcomingVaccinations est peuplé
    const dueVaccinations = upcomingVaccinations.value.filter(v => v.status === 'Prévue').length
    const overdueVaccinations = upcomingVaccinations.value.filter(v => v.status === 'En retard').length

    // Performance : poids moyen
    const validWeights = pigs.value.map(p => parseFloat(p.weight)).filter(w => !isNaN(w))
    const avgWeight = validWeights.length ? (validWeights.reduce((a,b) => a+b, 0) / validWeights.length).toFixed(1) : 0

    return {
      totalPigs,
      activePigs,
      inactivePigs,
      pregnantSows,
      expectedPiglets,
      dueVaccinations,
      overdueVaccinations,
      avgWeight
    }
  })

  // Cartes modernes recalculées dynamiquement
  const modernStats = computed(() => {
    const router = useRouter()  // Attention : useRouter() doit être appelé dans un composant, pas dans un store.
    // Pour contourner, on peut utiliser la fonction navigateur ou passer par une action.
    // On va plutôt stocker l'instance du router à l'initialisation (voir plus bas).
    const stats = pigStats.value
    return [
      {
        title: 'Porcs',
        mainValue: stats.totalPigs,
        details: [
          { label: `${stats.activePigs} actifs`, color: 'success' },
          { label: `${stats.inactivePigs} inactifs`, color: 'grey' }
        ],
        icon: 'mdi-pig',
        cardColor: '#E8F5E9',
        textColor: '#1B5E20',
        footerColor: '#4CAF50',
        description: 'Effectif total',
        action: () => setActiveTab('pig-list')
      },
      {
        title: 'Reproduction',
        mainValue: stats.pregnantSows,
        details: [
          { label: `${stats.expectedPiglets} porcelets attendus`, color: 'pink' }
        ],
        icon: 'mdi-baby-bottle',
        cardColor: '#FFF3E0',
        textColor: '#E65100',
        footerColor: '#FF9800',
        description: 'Truies gestantes',
        action: () => setActiveTab('breeding')
      },
      {
        title: 'Vaccinations',
        mainValue: stats.dueVaccinations,
        details: stats.overdueVaccinations > 0
          ? [{ label: `${stats.overdueVaccinations} en retard`, color: 'error' }]
          : [],
        icon: 'mdi-needle',
        cardColor: '#FFEBEE',
        textColor: '#B71C1C',
        footerColor: '#F44336',
        description: 'Vaccinations à effectuer',
        action: () => setActiveTab('vaccinations')
      },
      {
        title: 'Performance',
        mainValue: `${stats.avgWeight} kg`,
        details: [],
        icon: 'mdi-chart-line',
        cardColor: '#E3F2FD',
        textColor: '#0D47A1',
        footerColor: '#2196F3',
        description: 'Poids moyen',
        action: () => setActiveTab('performance')
      }
    ]
  })

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
      console.log('Porcs chargés :', pigs.value.length, pigs.value) // Debug
      updateStats()  // Met à jour stats.value si nécessaire
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
    // Met à jour stats.value pour compatibilité avec d'autres parties du code
    stats.value.totalPigs = pigs.value.length
    stats.value.activePigs = pigs.value.filter(p => p.status === 'active').length
    stats.value.pregnantSows = pigs.value.filter(p => p.category === 'sow' && p.status === 'pregnant').length
    stats.value.piglets = pigs.value.filter(p => p.category === 'piglet').length
  }

  // Action pour récupérer les données alimentaires
  const fetchFeedSummary = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/getFeedSummary.php`)
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      feedSummary.value = data
    } catch (error) {
      console.error('Erreur fetchFeedSummary:', error)
    }
  }

  // UI
  const toggleDrawer = () => { drawer.value = !drawer.value }
  const toggleRail = () => { rail.value = !rail.value }
  const setActiveTab = (tab) => { activeTab.value = tab }

  const quickAction = (action) => {
    // Pour utiliser le router dans le store, on doit importer useRouter() depuis un composant.
    // On va plutôt utiliser une fonction qui sera injectée depuis le composant.
    // On peut aussi utiliser window.location ou passer par une action avec le router comme paramètre.
    // Solution simple : stocker une référence au router dans le store (voir après).
    if (routerInstance) {
      switch (action) {
        case 'addPig':
          routerInstance.push({ name: 'add-pig' })
          break
        case 'vaccination':
          routerInstance.push({ name: 'vaccinations' })
          break
        case 'feeding':
          routerInstance.push({ name: 'feed-management' })
          break
        case 'delivery':
          routerInstance.push({ name: 'deliveries' })
          break
        case 'weighing':
          routerInstance.push({ name: 'weighing' })
          break
        case 'customer':
          routerInstance.push({ name: 'sales' })
          break
        default:
          console.warn('Action rapide inconnue:', action)
      }
    } else {
      console.warn('Router non disponible')
    }
  }

  // Pour pouvoir utiliser le router dans le store, on peut le stocker lors de l'initialisation.
  let routerInstance = null
  const setRouter = (router) => {
    routerInstance = router
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
    await fetchFeedSummary()
    if (currentUser.value) await fetchNotifications()
  }

  // Appel de l'initialisation automatique
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
    feedSummary,

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
    fetchFeedSummary,
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
    quickAction,
    setRouter  // pour injecter le router depuis le composant principal
  }
})