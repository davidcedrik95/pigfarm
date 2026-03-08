<template>
  <v-card class="pig-card" elevation="2" @click="$emit('click', pig)">
    <div class="card-header" :style="{ backgroundColor: getStatusColor() }">
      <div class="d-flex justify-space-between align-center">
        <div class="pig-id">
          <v-icon small class="mr-1">mdi-tag</v-icon>
          <strong>{{ pig.earTag || pig.id }}</strong>
        </div>
        <v-chip size="x-small" :color="getCategoryColor()" density="compact">
          {{ getCategoryLabel() }}
        </v-chip>
      </div>
    </div>
    
    <v-card-text class="py-3">
      <div class="text-center mb-3">
        <v-avatar size="80" :color="getAvatarColor()" class="pig-avatar">
          <v-icon size="40" dark>{{ getPigIcon() }}</v-icon>
        </v-avatar>
        <h3 class="text-h6 mt-2">{{ pig.name || 'Sans nom' }}</h3>
        <div class="text-caption text-grey">{{ pig.breed || 'Race non spécifiée' }}</div>
      </div>
      
      <v-divider class="my-2"></v-divider>
      
      <v-row dense class="pig-info">
        <v-col cols="6">
          <div class="info-item">
            <v-icon small class="mr-1">mdi-scale</v-icon>
            <span>{{ pig.weight || '?' }} kg</span>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-item">
            <v-icon small class="mr-1">mdi-cake-variant</v-icon>
            <span>{{ pig.age || '?' }} mois</span>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-item">
            <v-icon small class="mr-1">{{ pig.gender === 'male' ? 'mdi-gender-male' : 'mdi-gender-female' }}</v-icon>
            <span>{{ pig.gender === 'male' ? 'Mâle' : 'Femelle' }}</span>
          </div>
        </v-col>
        <v-col cols="6">
          <div class="info-item">
            <v-icon small class="mr-1">mdi-map-marker</v-icon>
            <span>{{ pig.location || 'Non défini' }}</span>
          </div>
        </v-col>
        <v-col cols="12" v-if="pig.healthStatus">
          <div class="info-item">
            <v-icon small class="mr-1" :color="getHealthColor()">mdi-heart-pulse</v-icon>
            <span>{{ getHealthLabel() }}</span>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-card-actions class="pt-0">
      <v-btn size="small" variant="text" @click.stop="viewDetails">
        <v-icon small left>mdi-eye</v-icon>
        Détails
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn size="small" icon @click.stop="toggleFavorite">
        <v-icon :color="pig.isFavorite ? 'yellow-darken-2' : 'grey'">
          {{ pig.isFavorite ? 'mdi-star' : 'mdi-star-outline' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  pig: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      breed: '',
      category: 'grower',
      status: 'active',
      weight: null,
      age: null,
      location: '',
      gender: 'male',
      healthStatus: 'healthy',
      earTag: '',
      isFavorite: false
    })
  }
})

const emit = defineEmits(['click', 'favorite'])

const getStatusColor = () => {
  const colors = {
    active: '#4CAF50',
    sick: '#F44336',
    pregnant: '#9C27B0',
    sold: '#9E9E9E',
    inactive: '#757575'
  }
  return colors[props.pig.status] || '#757575'
}

const getCategoryColor = () => {
  const colors = {
    boar: 'blue',
    sow: 'pink',
    piglet: 'orange',
    grower: 'green',
    finisher: 'brown'
  }
  return colors[props.pig.category] || 'grey'
}

const getCategoryLabel = () => {
  const labels = {
    boar: 'Verrat',
    sow: 'Truie',
    piglet: 'Porcelet',
    grower: 'Élevage',
    finisher: 'Finition'
  }
  return labels[props.pig.category] || 'Inconnu'
}

const getAvatarColor = () => {
  const colors = {
    boar: 'blue-darken-2',
    sow: 'pink-darken-2',
    piglet: 'orange-darken-2',
    grower: 'green-darken-2',
    finisher: 'brown-darken-2'
  }
  return colors[props.pig.category] || 'grey-darken-2'
}

const getPigIcon = () => {
  const icons = {
    boar: 'mdi-pig',
    sow: 'mdi-pig-variant',
    piglet: 'mdi-pig-variant-outline',
    grower: 'mdi-piggy-bank',
    finisher: 'mdi-food-drumstick'
  }
  return icons[props.pig.category] || 'mdi-pig'
}

const getHealthColor = () => {
  const colors = {
    healthy: 'success',
    sick: 'error',
    pregnant: 'purple',
    recovering: 'warning'
  }
  return colors[props.pig.healthStatus] || 'grey'
}

const getHealthLabel = () => {
  const labels = {
    healthy: 'En bonne santé',
    sick: 'Malade',
    pregnant: 'Gestante',
    recovering: 'En convalescence'
  }
  return labels[props.pig.healthStatus] || props.pig.healthStatus
}

const viewDetails = () => {
  emit('click', props.pig)
}

const toggleFavorite = () => {
  emit('favorite', props.pig)
}
</script>

<style scoped>
.pig-card {
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 100%;
  border: 1px solid #e0e0e0;
}

.pig-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  border-color: #4CAF50;
}

.card-header {
  padding: 12px 16px;
  color: white;
  border-radius: 12px 12px 0 0;
  font-size: 0.9rem;
}

.pig-id {
  color: white;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.pig-avatar {
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.pig-card:hover .pig-avatar {
  transform: scale(1.05);
}

.pig-info .info-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(0, 0, 0, 0.87);
  margin-bottom: 4px;
}

.pig-info .info-item .v-icon {
  min-width: 20px;
}

@media (max-width: 600px) {
  .pig-card {
    margin-bottom: 16px;
  }
  
  .card-header {
    padding: 8px 12px;
  }
  
  .pig-avatar {
    width: 60px;
    height: 60px;
  }
  
  .text-h6 {
    font-size: 1rem;
  }
}
</style>