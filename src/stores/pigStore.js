import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  // Données initiales
  const initialPigs = [
    {
      id: 'P001',
      name: 'Babe',
      breed: 'Large White',
      category: 'grower',
      status: 'active',
      weight: 45,
      age: 4,
      location: 'Enclos A',
      birthDate: '2023-08-15',
      gender: 'male',
      isFavorite: true,
      color: 'Rose',
      earTag: '001',
      healthStatus: 'healthy',
      feedType: 'Croissance',
      dailyFeed: 2.5,
      notes: 'Porc en bonne santé, croissance normale'
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
      birthDate: '2022-01-10',
      gender: 'female',
      isFavorite: false,
      color: 'Blanc',
      earTag: '002',
      healthStatus: 'pregnant',
      feedType: 'Gestation',
      dailyFeed: 3.2,
      gestationWeek: 12,
      expectedDelivery: '2024-03-20',
      notes: 'Truie gestante, 12ème semaine'
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
      birthDate: '2021-11-05',
      gender: 'male',
      isFavorite: false,
      color: 'Tacheté',
      earTag: '003',
      healthStatus: 'healthy',
      feedType: 'Reproduction',
      dailyFeed: 3.5,
      notes: 'Verrat reproducteur, excellente génétique'
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
      birthDate: '2024-01-20',
      gender: 'female',
      isFavorite: true,
      color: 'Rose clair',
      earTag: '004',
      healthStatus: 'healthy',
      feedType: 'Porcelet',
      dailyFeed: 0.8,
      motherId: 'P002',
      notes: 'Porcelet né le 20/01/2024'
    }
  ]

  // Statistiques
  const stats = ref({
    totalPigs: 0,
    activePigs: 0,
    pregnantSows: 0,
    piglets: 0,
    dueVaccinations: 5,
    overdueVaccinations: 2,
    totalCustomers: 25,
    activeCustomers: 20,
    totalTasks: 15,
    activeTasks: 8,
    monthlyFeedConsumption: 10500,
    averageDailyGain: 850,
    feedConversionRatio: 2.8
  })

  // Données pour le dashboard
  const upcomingVaccinations = ref([
    { id: 1, pigId: 'P001', pigName: 'Babe', vaccine: 'PCV2', date: '2024-12-15', status: 'Prévue' },
    { id: 2, pigId: 'P002', pigName: 'Rose', vaccine: 'Parvovirus', date: '2024-12-10', status: 'En retard' },
    { id: 3, pigId: 'P003', pigName: 'Max', vaccine: 'Rouget', date: '2024-12-20', status: 'Prévue' }
  ])

  const recentActivities = ref([
    { icon: 'mdi-scale-bathroom', title: 'Pesée de Babe', time: 'Il y a 30 minutes', color: 'success' },
    { icon: 'mdi-needle', title: 'Vaccination de Max', time: 'Il y a 2 heures', color: 'info' },
    { icon: 'mdi-baby-bottle', title: 'Mise bas de Truie #12', time: 'Aujourd\'hui, 09:15', color: 'primary' },
    { icon: 'mdi-food', title: 'Distribution alimentaire', time: 'Hier, 16:30', color: 'warning' }
  ])

  const dueInspections = ref([
    { id: 1, deviceName: 'Pesée automatique', customer: 'Enclos A', dueDate: '15.12.2024', status: 'Fällig' },
    { id: 2, deviceName: 'Distributeur alimentaire', customer: 'Maternité', dueDate: '10.12.2024', status: 'Überfällig' }
  ])

  const notificationCount = computed(() => notifications.value.length)
  const dueInspectionsCount = computed(() => dueInspections.value.length)

  // Computed
  const filteredPigs = computed(() => {
    if (!searchQuery.value) return pigs.value
    return pigs.value.filter(pig => 
      pig.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.breed.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      pig.earTag.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

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
      action: () => activeTab.value = 'pig-list'
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
      action: () => activeTab.value = 'breeding'
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
      action: () => activeTab.value = 'vaccinations'
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
      action: () => activeTab.value = 'performance'
    }
  ])

  // Actions rapides
  const quickActions = ref([
    { id: 1, icon: 'mdi-pig-plus', title: 'Ajouter un porc', subtitle: 'Nouvelle entrée', action: 'addPig', color: 'primary' },
    { id: 2, icon: 'mdi-needle', title: 'Enregistrer vaccination', subtitle: 'Nouvelle vaccination', action: 'vaccination', color: 'orange' },
    { id: 3, icon: 'mdi-silverware-fork-knife', title: 'Ajouter alimentation', subtitle: 'Nouveau repas', action: 'feeding', color: 'green' },
    { id: 4, icon: 'mdi-baby-bottle', title: 'Enregistrer mise bas', subtitle: 'Nouvelle portée', action: 'delivery', color: 'blue' },
    { id: 5, icon: 'mdi-scale-bathroom', title: 'Pesée', subtitle: 'Contrôle de poids', action: 'weighing', color: 'purple' },
    { id: 6, icon: 'mdi-account-plus', title: 'Ajouter client', subtitle: 'Nouveau client', action: 'customer', color: 'teal' }
  ])

  // Méthodes
  const initializeStore = () => {
    pigs.value = initialPigs
    updateStats()
    
    // Notifications de test
    notifications.value = [
      { id: 1, icon: 'mdi-alert', title: 'Vaccination en retard', message: 'Rose - Parvovirus', color: 'error' },
      { id: 2, icon: 'mdi-bell', title: 'Pesée programmée', message: 'Babe - Contrôle mensuel', color: 'info' },
      { id: 3, icon: 'mdi-food', title: 'Commande aliment', message: 'Aliment croissance - 500kg', color: 'success' }
    ]
    
    // Charger l'utilisateur depuis localStorage
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      try {
        currentUser.value = JSON.parse(userData)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
      }
    }
  }

  const updateStats = () => {
    stats.value = {
      totalPigs: pigs.value.length,
      activePigs: pigs.value.filter(p => p.status === 'active').length,
      pregnantSows: pigs.value.filter(p => p.category === 'sow' && p.status === 'pregnant').length,
      piglets: pigs.value.filter(p => p.category === 'piglet').length,
      dueVaccinations: 5,
      overdueVaccinations: 2,
      totalCustomers: 25,
      activeCustomers: 20,
      totalTasks: 15,
      activeTasks: 8,
      monthlyFeedConsumption: 10500,
      averageDailyGain: 850,
      feedConversionRatio: 2.8
    }
  }

  const addPig = (pigData) => {
    const newPig = {
      id: `P${String(pigs.value.length + 1).padStart(3, '0')}`,
      ...pigData,
      createdAt: new Date().toISOString(),
      status: 'active'
    }
    pigs.value.push(newPig)
    updateStats()
    return newPig
  }

  const updatePig = (id, pigData) => {
    const index = pigs.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pigs.value[index] = { ...pigs.value[index], ...pigData }
      updateStats()
      return pigs.value[index]
    }
    return null
  }

  const deletePig = (id) => {
    const index = pigs.value.findIndex(p => p.id === id)
    if (index !== -1) {
      pigs.value.splice(index, 1)
      updateStats()
      return true
    }
    return false
  }

  const getPigById = (id) => {
    return pigs.value.find(p => p.id === id)
  }

  const toggleDrawer = () => {
    drawer.value = !drawer.value
  }

  const toggleRail = () => {
    rail.value = !rail.value
  }

  const setActiveTab = (tab) => {
    activeTab.value = tab
  }

  const addNotification = (notification) => {
    notifications.value.unshift({
      id: Date.now(),
      ...notification,
      time: new Date().toISOString()
    })
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const quickAction = (action) => {
    switch(action) {
      case 'addPig':
        console.log('Ajouter un porc')
        break
      case 'vaccination':
        console.log('Vaccination')
        break
      case 'feeding':
        console.log('Alimentation')
        break
      case 'delivery':
        console.log('Mise bas')
        break
      case 'weighing':
        console.log('Pesée')
        break
      case 'customer':
        console.log('Client')
        break
    }
  }

  // Initialiser le store
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
    
    // Computed
    filteredPigs,
    modernStats,
    notificationCount,
    dueInspectionsCount,
    quickActions,
    
    // Données
    stats,
    upcomingVaccinations,
    recentActivities,
    dueInspections,
    
    // Méthodes
    initializeStore,
    updateStats,
    addPig,
    updatePig,
    deletePig,
    getPigById,
    toggleDrawer,
    toggleRail,
    setActiveTab,
    addNotification,
    clearNotifications,
    quickAction
  }
})