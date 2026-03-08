import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    name: 'login', 
    component: () => import('../components/Login.vue')
  },
  { 
    path: '/dashboard', 
    name: 'dashboard', 
    component: () => import('../views/pigs/PigDashboard.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/pigs', 
    name: 'pig-list', 
    component: () => import('../views/pigs/PigList.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/pigs/add', 
    name: 'add-pig', 
    component: () => import('../views/pigs/PigFormView.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/pigs/:id', 
    name: 'pig-details', 
    component: () => import('../views/pigs/PigDetails.vue'),
    props: true,
    meta: { requiresAuth: true }
  },
  { 
    path: '/breeding', 
    name: 'breeding', 
    component: () => import('../views/breeding/BreedingProgram.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/health', 
    name: 'health', 
    component: () => import('../views/health/HealthRecords.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/vaccinations', 
    name: 'vaccinations', 
    component: () => import('../views/health/Vaccinations.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/feed', 
    name: 'feed-management', 
    component: () => import('../views/production/FeedManagement.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/weighing', 
    name: 'weighing', 
    component: () => import('../views/production/WeightTracking.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/sales', 
    name: 'sales', 
    component: () => import('../views/financial/SalesView.vue'),
    meta: { requiresAuth: true }
  },
  { 
    path: '/admin/users', 
    name: 'user-management', 
    component: () => import('../views/admin/UserManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarde de navigation
router.beforeEach((to, from, next) => {
  console.log(`Navigation: ${from.path} -> ${to.path}`)
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const isAuthenticated = localStorage.getItem('currentUser') !== null
  
  // Récupérer les informations utilisateur
  let currentUser = null
  if (isAuthenticated) {
    try {
      currentUser = JSON.parse(localStorage.getItem('currentUser'))
    } catch (error) {
      console.error('Erreur lors de la lecture des données utilisateur:', error)
      localStorage.removeItem('currentUser')
    }
  }
  
  console.log('Vérification d\'authentification:', { 
    requiresAuth, 
    requiresAdmin, 
    isAuthenticated,
    userRole: currentUser?.role 
  })
  
  if (requiresAuth && !isAuthenticated) {
    console.log('Redirection vers login: authentification requise')
    next({ name: 'login' })
  } else if (requiresAdmin && (!currentUser || currentUser.role !== 'admin')) {
    console.log('Redirection vers dashboard: permissions insuffisantes')
    next({ name: 'dashboard' })
  } else if (to.name === 'login' && isAuthenticated) {
    console.log('Redirection vers dashboard: déjà authentifié')
    next({ name: 'dashboard' })
  } else {
    console.log('Navigation autorisée')
    next()
  }
})

export default router