import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'
import i18n from './i18n'

import 'vuetify/styles'
import vuetify from './plugins/vuetify'

// ✅ Import MDI FONT
import '@mdi/font/css/materialdesignicons.css'

// Import des styles globaux
import './styles/global.css'

const app = createApp(App)

// Utilisation des plugins
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)

// Directive globale pour le focus
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// Montage de l'application
app.mount('#app')

// Log de démarrage
console.log('PigFarm Manager démarré avec succès')