<template>
  <div class="login-wrapper">
    <v-container class="login-container">
      <v-card class="login-card" elevation="10" rounded="xl">
        <div class="form-container-wrapper">
          <!-- Formulaire Invité -->
          <v-card :class="['form-card guest-card', { 'active': isGuestMode }]" elevation="0">
            <v-card-text class="pa-8">
              <div class="text-center">
                <h1 class="text-h5 font-weight-bold mb-4">Démarrer en invité</h1>
                <p class="text-body-2 text-grey-darken-1 mb-6">
                  Aucune inscription nécessaire. Vous pouvez continuer directement.
                </p>
                <v-btn
                  color="primary"
                  size="large"
                  rounded="xl"
                  class="font-weight-bold"
                  @click="continueAsGuest"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Démarrer comme invité
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Formulaire Connexion -->
          <v-card
            v-show="!showResetPassword"
            :class="['form-card sign-in-card', { 'active': !isGuestMode }]"
            elevation="0"
          >
            <v-card-text class="pa-8">
              <v-form @submit.prevent="handleSignIn">
                <h1 class="text-h4 font-weight-bold mb-4">Connexion</h1>
                
                <div class="logo-container mb-6">
                  <v-icon size="64" color="primary">mdi-pig</v-icon>
                  <h2 class="text-h5 font-weight-bold mt-2">PigFarm Manager</h2>
                </div>
                
                <v-text-field
                  v-model="signInForm.username"
                  type="text"
                  placeholder="Nom d'utilisateur"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  hide-details
                  required
                  prepend-inner-icon="mdi-account"
                  @keyup.enter="handleSignIn"
                />
                
                <v-text-field
                  v-model="signInForm.password"
                  type="password"
                  placeholder="Mot de passe"
                  variant="outlined"
                  density="comfortable"
                  class="mb-3"
                  hide-details
                  required
                  prepend-inner-icon="mdi-lock"
                  @keyup.enter="handleSignIn"
                />
                
                <!-- Message d'erreur -->
                <div v-if="loginError" class="error-message mb-3">
                  <v-alert type="error" density="compact">
                    {{ loginError }}
                  </v-alert>
                </div>
                
                <!-- Message de succès -->
                <div v-if="loginSuccess" class="success-message mb-3">
                  <v-alert type="success" density="compact">
                    Connexion réussie !
                  </v-alert>
                </div>
                
                <v-btn
                  type="button"
                  variant="text"
                  size="small"
                  class="text-caption pa-0 mb-6"
                  @click="forgotPassword"
                >
                  Mot de passe oublié ?
                </v-btn>
                
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  rounded="xl"
                  block
                  class="font-weight-bold"
                  :loading="isLoading"
                  :disabled="isLoading"
                >
                  Se connecter
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Formulaire Réinitialisation Mot de Passe -->
          <v-card
            v-show="showResetPassword"
            :class="['form-card reset-password-card', { 'active': !isGuestMode }]"
            elevation="0"
          >
            <v-card-text class="pa-8">
              <div class="mb-6">
                <h1 class="text-h4 font-weight-bold mb-2">Réinitialiser le mot de passe</h1>
                <p class="text-body-2 text-grey-darken-1">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              
              <v-form @submit.prevent="handleResetPassword">
                <v-text-field
                  v-model="resetPasswordForm.email"
                  type="email"
                  placeholder="Email"
                  variant="outlined"
                  density="comfortable"
                  class="mb-6"
                  hide-details
                  prepend-inner-icon="mdi-email"
                />
                
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  rounded="xl"
                  block
                  class="font-weight-bold mb-4"
                  :loading="resetPasswordLoading"
                >
                  Envoyer le lien
                </v-btn>
                
                <div v-if="resetPasswordSuccess" class="success-message text-center">
                  <v-icon color="success" class="mb-2">mdi-check-circle</v-icon>
                  <p class="text-caption text-success">
                    Un lien de réinitialisation a été envoyé à votre email.
                  </p>
                </div>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Panneau Overlay pour Connexion/Invitation -->
          <div class="overlay-container" v-if="!showResetPassword">
            <div class="overlay">
              <div class="overlay-panel overlay-left">
                <div class="overlay-content">
                  <h1 class="text-h3 font-weight-bold mb-4">Bienvenue !</h1>
                  <p class="text-body-1 mb-6">
                    Pour rester connecté avec votre ferme, connectez-vous avec vos identifiants
                  </p>
                  <v-btn
                    class="ghost-btn"
                    variant="outlined"
                    color="white"
                    size="large"
                    rounded="xl"
                    @click="togglePanel(false)"
                  >
                    Connexion
                  </v-btn>
                </div>
              </div>
              <div class="overlay-panel overlay-right">
                <div class="overlay-content">
                  <v-icon size="64" color="white" class="mb-4">mdi-pig</v-icon>
                  <h1 class="text-h4 font-weight-bold mb-4">PigFarm Manager</h1>
                  <p class="text-body-1 mb-6">
                    Gérez efficacement votre élevage porcin avec notre outil complet
                  </p>
                  <v-btn
                    class="ghost-btn"
                    variant="outlined"
                    color="white"
                    size="large"
                    rounded="xl"
                    @click="togglePanel(true)"
                  >
                    Mode Invité
                  </v-btn>
                </div>
              </div>
            </div>
          </div>

          <!-- Panneau Overlay pour Réinitialisation -->
          <div class="overlay-container reset-overlay" v-if="showResetPassword">
            <div class="overlay">
              <div class="overlay-panel overlay-reset">
                <div class="overlay-content">
                  <h1 class="text-h3 font-weight-bold mb-4">Retour à la connexion ?</h1>
                  <p class="text-body-1 mb-6">
                    Cliquez sur le bouton ci-dessous pour retourner à la page de connexion.
                  </p>
                  <v-btn
                    class="ghost-btn"
                    variant="outlined"
                    color="white"
                    size="large"
                    rounded="xl"
                    @click="showResetPassword = false"
                  >
                    Retour à la connexion
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isGuestMode = ref(false)
const showResetPassword = ref(false)
const resetPasswordLoading = ref(false)
const resetPasswordSuccess = ref(false)
const isLoading = ref(false)
const loginError = ref('')
const loginSuccess = ref(false)

const signInForm = ref({
  username: '',
  password: ''
})

const resetPasswordForm = ref({
  email: ''
})

// Données utilisateurs - Fallback si JSON non chargé
const usersData = ref([
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrateur' },
  { id: 2, username: 'eleveur', password: 'eleveur123', role: 'farmer', name: 'Éleveur' },
  { id: 3, username: 'technicien', password: 'technicien123', role: 'technician', name: 'Technicien' },
  { id: 4, username: 'invite', password: 'invite', role: 'guest', name: 'Invité' }
])

// Charger les utilisateurs depuis le fichier JSON
const loadUsers = async () => {
  try {
    const response = await fetch('/data/users.json')
    if (!response.ok) {
      console.log('Utilisation des données utilisateurs de secours')
      return // Utiliser les données de secours
    }
    const data = await response.json()
    if (Array.isArray(data) && data.length > 0) {
      usersData.value = data
      console.log('Utilisateurs chargés avec succès:', usersData.value)
    }
  } catch (error) {
    console.log('Erreur lors du chargement de users.json, utilisation des données de secours:', error)
    // Utiliser les données de secours
  }
}

onMounted(() => {
  console.log('Composant Login monté')
  loadUsers()
  
  // Vérifier si l'utilisateur est déjà connecté
  const currentUser = localStorage.getItem('currentUser')
  if (currentUser) {
    console.log('Utilisateur déjà connecté, redirection vers le tableau de bord')
    router.push({ name: 'dashboard' })
  }
})

const togglePanel = (showGuest) => {
  isGuestMode.value = showGuest
}

const handleSignIn = async () => {
  console.log('Tentative de connexion avec:', signInForm.value.username)
  loginError.value = ''
  loginSuccess.value = false
  
  if (!signInForm.value.username || !signInForm.value.password) {
    loginError.value = 'Veuillez saisir le nom d\'utilisateur et le mot de passe'
    return
  }
  
  isLoading.value = true
  
  try {
    // Vérifier les identifiants dans les données utilisateurs
    const user = usersData.value.find(
      u => u.username === signInForm.value.username && 
           u.password === signInForm.value.password
    )
    
    if (user) {
      console.log('Utilisateur trouvé:', user.username)
      loginSuccess.value = true
      
      // Stocker les informations utilisateur dans localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        username: user.username,
        name: user.name || user.username,
        role: user.role || 'farmer',
        isGuest: false
      }))
      
      console.log('Données utilisateur stockées dans localStorage')
      
      // Naviguer vers le tableau de bord après un court délai
      setTimeout(() => {
        console.log('Navigation vers le tableau de bord')
        router.push({ name: 'dashboard' })
      }, 1000)
    } else {
      console.log('Utilisateur non trouvé ou mot de passe incorrect')
      loginError.value = 'Nom d\'utilisateur ou mot de passe invalide'
    }
  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    loginError.value = 'Erreur lors de la connexion'
  } finally {
    isLoading.value = false
  }
}

const continueAsGuest = async () => {
  console.log('Continuer en tant qu\'invité')
  isLoading.value = true
  
  try {
    // Trouver l'utilisateur invité
    const guestUser = usersData.value.find(u => u.username === 'invite')
    
    if (guestUser) {
      // Stocker les informations invité dans localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        id: guestUser.id,
        username: guestUser.username,
        name: guestUser.name || 'Invité',
        role: guestUser.role || 'guest',
        isGuest: true
      }))
      
      console.log('Connexion invité réussie')
      router.push({ name: 'dashboard' })
    } else {
      // Fallback si l'utilisateur invité n'est pas trouvé dans le JSON
      localStorage.setItem('currentUser', JSON.stringify({
        id: 999,
        username: 'invite',
        name: 'Invité',
        role: 'guest',
        isGuest: true
      }))
      
      console.log('Connexion invité avec données de secours')
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    console.error('Erreur lors de la connexion invité:', error)
    loginError.value = 'Erreur lors de la connexion invité'
  } finally {
    isLoading.value = false
  }
}

const forgotPassword = () => {
  console.log('Mot de passe oublié cliqué')
  showResetPassword.value = true
}

const handleResetPassword = async () => {
  console.log('Réinitialisation du mot de passe pour:', resetPasswordForm.value.email)
  resetPasswordLoading.value = true
  
  // Simuler une requête API
  setTimeout(() => {
    console.log('Email de réinitialisation envoyé')
    resetPasswordLoading.value = false
    resetPasswordSuccess.value = true
    
    // Réinitialiser après 5 secondes
    setTimeout(() => {
      resetPasswordSuccess.value = false
      resetPasswordForm.value.email = ''
      showResetPassword.value = false
    }, 5000)
  }, 1500)
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.login-container {
  max-width: 800px;
  width: 100%;
  padding: 0;
}

.login-card {
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  min-height: 500px;
}

.form-container-wrapper {
  display: flex;
  position: relative;
  min-height: 500px;
}

.form-card {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  transition: all 0.6s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.sign-in-card {
  left: 0;
  opacity: 1;
  z-index: 2;
}

.guest-card {
  left: 0;
  opacity: 0;
  z-index: 1;
}

.guest-card.active {
  opacity: 1;
  z-index: 5;
  transform: translateX(100%);
}

.reset-password-card {
  left: 0;
  opacity: 1;
  z-index: 10;
  width: 50% !important;
  background: white;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 10;
}

.guest-card.active ~ .overlay-container {
  transform: translateX(-100%);
}

.reset-overlay {
  left: 50%;
  width: 50%;
}

.overlay {
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  background: linear-gradient(rgba(56, 142, 60, 0.9), rgba(76, 175, 80, 0.9));
}

.overlay-right {
  background: linear-gradient(rgba(139, 195, 74, 0.9), rgba(104, 159, 56, 0.9));
}

.reset-overlay .overlay {
  background: linear-gradient(rgba(121, 85, 72, 0.9), rgba(93, 64, 55, 0.9));
  left: 0;
  width: 100%;
}

.guest-card.active ~ .overlay-container .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.guest-card.active ~ .overlay-container .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.overlay-reset {
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guest-card.active ~ .overlay-container .overlay-right {
  transform: translateX(20%);
}

.overlay-content {
  max-width: 400px;
  width: 100%;
  z-index: 2;
}

.logo-container {
  text-align: center;
  margin-bottom: 24px;
}

.ghost-btn {
  background-color: transparent !important;
  border: 1px solid white !important;
  color: white !important;
}

.success-message {
  padding: 10px;
  background-color: rgba(76, 175, 80, 0.1);
  border-radius: 8px;
}

.error-message {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.reset-password-card {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .form-card {
    width: 100%;
    position: relative;
  }
  
  .sign-in-card,
  .guest-card,
  .reset-password-card {
    transform: none !important;
    width: 100% !important;
  }
  
  .guest-card.active {
    transform: none !important;
  }
  
  .overlay-container {
    display: none;
  }
  
  .reset-overlay {
    display: none;
  }
}

.text-h3, .text-body-1 {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
}

.ghost-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.v-icon {
  transition: transform 0.3s ease;
}

.v-icon:hover {
  transform: scale(1.1);
}
</style>