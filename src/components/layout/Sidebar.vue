<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    color="grey-darken-4"
    class="elevation-3"
    :width="rail ? 56 : 280"
  >
    <v-list dense nav class="py-0">
      <!-- Logo -->
      <v-list-item
        prepend-icon="mdi-pig"
        title="PigFarm Pro"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="!rail">
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="toggleRail"
            size="small"
          ></v-btn>
        </template>
      </v-list-item>
      
      <v-divider class="my-2"></v-divider>
      
      <!-- Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Tableau de bord"
        value="dashboard"
        :active="activeTab === 'dashboard'"
        @click="setActiveTab('dashboard')"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="rail">
          <v-icon size="small">mdi-view-dashboard</v-icon>
        </template>
      </v-list-item>
      
      <!-- Gestion des Porcs -->
      <v-list-group value="pigs" class="px-0" :prepend-icon="rail ? 'mdi-pig' : null">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="!rail ? 'mdi-pig' : null"
            title="Gestion Porcs"
            class="px-0"
            :title-class="rail ? 'd-none' : ''"
          >
            <template v-slot:append v-if="rail">
              <v-icon size="small">mdi-pig</v-icon>
            </template>
          </v-list-item>
        </template>
        
        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="Liste des porcs"
          value="pig-list"
          :active="activeTab === 'pig-list'"
          @click="setActiveTab('pig-list')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-pig-plus"
          title="Ajouter un porc"
          value="add-pig"
          :active="activeTab === 'add-pig'"
          @click="setActiveTab('add-pig')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-archive"
          title="Archives"
          value="pig-archive"
          :active="activeTab === 'pig-archive'"
          @click="setActiveTab('pig-archive')"
          class="px-0"
        ></v-list-item>
      </v-list-group>
      
      <!-- Reproduction -->
      <v-list-group value="breeding" class="px-0" :prepend-icon="rail ? 'mdi-heart' : null">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="!rail ? 'mdi-heart' : null"
            title="Reproduction"
            class="px-0"
            :title-class="rail ? 'd-none' : ''"
          >
            <template v-slot:append v-if="rail">
              <v-icon size="small">mdi-heart</v-icon>
            </template>
          </v-list-item>
        </template>
        
        <v-list-item
          prepend-icon="mdi-baby-bottle"
          title="Mises bas"
          value="deliveries"
          :active="activeTab === 'deliveries'"
          @click="setActiveTab('deliveries')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-calendar-heart"
          title="Calendrier saillies"
          value="mating-schedule"
          :active="activeTab === 'mating-schedule'"
          @click="setActiveTab('mating-schedule')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-dna"
          title="Génétique"
          value="genetics"
          :active="activeTab === 'genetics'"
          @click="setActiveTab('genetics')"
          class="px-0"
        ></v-list-item>
      </v-list-group>
      
      <!-- Santé -->
      <v-list-item
        prepend-icon="mdi-heart-pulse"
        title="Santé"
        value="health"
        :active="activeTab === 'health'"
        @click="setActiveTab('health')"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="rail">
          <v-icon size="small">mdi-heart-pulse</v-icon>
        </template>
      </v-list-item>
      
      <!-- Alimentation -->
      <v-list-item
        prepend-icon="mdi-silverware-fork-knife"
        title="Alimentation"
        value="feeding"
        :active="activeTab === 'feeding'"
        @click="setActiveTab('feeding')"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="rail">
          <v-icon size="small">mdi-silverware-fork-knife</v-icon>
        </template>
      </v-list-item>
      
      <!-- Production -->
      <v-list-group value="production" class="px-0" :prepend-icon="rail ? 'mdi-chart-line' : null">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="!rail ? 'mdi-chart-line' : null"
            title="Production"
            class="px-0"
            :title-class="rail ? 'd-none' : ''"
          >
            <template v-slot:append v-if="rail">
              <v-icon size="small">mdi-chart-line</v-icon>
            </template>
          </v-list-item>
        </template>
        
        <v-list-item
          prepend-icon="mdi-scale"
          title="Pesées"
          value="weighing"
          :active="activeTab === 'weighing'"
          @click="setActiveTab('weighing')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-chart-bell-curve"
          title="Performances"
          value="performance"
          :active="activeTab === 'performance'"
          @click="setActiveTab('performance')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-truck"
          title="Abattage"
          value="slaughter"
          :active="activeTab === 'slaughter'"
          @click="setActiveTab('slaughter')"
          class="px-0"
        ></v-list-item>
      </v-list-group>
      
      <!-- Ventes & Clients -->
      <v-list-item
        prepend-icon="mdi-currency-eur"
        title="Ventes"
        value="sales"
        :active="activeTab === 'sales'"
        @click="setActiveTab('sales')"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="rail">
          <v-icon size="small">mdi-currency-eur</v-icon>
        </template>
      </v-list-item>
      
      <!-- Administratif -->
      <v-list-group value="admin" class="px-0" v-if="currentUser?.isAdmin" :prepend-icon="rail ? 'mdi-cog' : null">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :prepend-icon="!rail ? 'mdi-cog' : null"
            title="Administration"
            class="px-0"
            :title-class="rail ? 'd-none' : ''"
          >
            <template v-slot:append v-if="rail">
              <v-icon size="small">mdi-cog</v-icon>
            </template>
          </v-list-item>
        </template>
        
        <v-list-item
          prepend-icon="mdi-account-cog"
          title="Utilisateurs"
          value="users"
          :active="activeTab === 'users'"
          @click="setActiveTab('users')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-cog"
          title="Paramètres"
          value="settings"
          :active="activeTab === 'settings'"
          @click="setActiveTab('settings')"
          class="px-0"
        ></v-list-item>
        
        <v-list-item
          prepend-icon="mdi-shield-check"
          title="Conformité"
          value="compliance"
          :active="activeTab === 'compliance'"
          @click="setActiveTab('compliance')"
          class="px-0"
        ></v-list-item>
      </v-list-group>
      
      <!-- Divider -->
      <v-divider class="my-2"></v-divider>
      
      <!-- Aide -->
      <v-list-item
        prepend-icon="mdi-help-circle"
        title="Aide & Support"
        value="help"
        :active="activeTab === 'help'"
        @click="setActiveTab('help')"
        class="px-0"
        :title-class="rail ? 'd-none' : ''"
      >
        <template v-slot:append v-if="rail">
          <v-icon size="small">mdi-help-circle</v-icon>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { usePigStore } from '@/stores/pigStore'

const pigStore = usePigStore()

const drawer = computed({
  get: () => pigStore.drawer,
  set: (value) => { pigStore.drawer = value }
})

const rail = computed({
  get: () => pigStore.rail,
  set: (value) => { pigStore.rail = value }
})

const activeTab = computed(() => pigStore.activeTab)
const currentUser = computed(() => pigStore.currentUser)

const toggleRail = () => {
  pigStore.rail = !pigStore.rail
}

const setActiveTab = (tab) => {
  pigStore.setActiveTab(tab)
  // Note: La navigation réelle sera gérée par le routeur dans les vues
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

.v-navigation-drawer .v-list-item {
  min-height: 36px !important;
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

.v-navigation-drawer .v-list-item--active {
  background-color: rgba(25, 118, 210, 0.08);
  color: #1976d2;
  font-weight: 500;
}

.v-navigation-drawer .v-list-item--active .v-icon {
  color: #1976d2;
}

.v-navigation-drawer .v-list-group__items .v-list-item {
  padding-left: 32px !important;
}

.v-list-group__items {
  padding: 0 !important;
}

.v-list-group__header {
  padding: 0 !important;
}

@media (max-width: 600px) {
  .v-navigation-drawer {
    width: 56px !important;
  }
  
  .v-navigation-drawer:not(.v-navigation-drawer--rail) {
    width: 280px !important;
  }
}
</style>