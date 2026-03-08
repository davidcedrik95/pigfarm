<template>
  <div class="dashboard-stats">
    <v-row class="mb-4">
      <v-col 
        cols="12" 
        sm="6" 
        md="3" 
        v-for="(stat, index) in stats" 
        :key="index"
      >
        <v-card 
          class="modern-stat-card"
          elevation="2"
          @click="stat.action"
          density="compact"
          :style="{ backgroundColor: stat.cardColor }"
        >
          <div class="card-content pa-4">
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <div class="text-uppercase text-caption font-weight-medium mb-1" 
                     :style="{ color: stat.textColor }">
                  {{ stat.title }}
                </div>
                <div class="d-flex align-end">
                  <div class="text-h4 font-weight-bold" :style="{ color: stat.textColor }">
                    {{ stat.value }}
                  </div>
                  <div 
                    class="text-caption ml-2" 
                    :style="{ color: stat.subtitleColor }" 
                    v-if="stat.subtitle"
                  >
                    {{ stat.subtitle }}
                  </div>
                </div>
              </div>
              <div class="stat-icon-wrapper">
                <div class="stat-icon-circle" :style="{ backgroundColor: stat.iconBgColor }">
                  <v-icon :color="stat.iconColor" size="28">{{ stat.icon }}</v-icon>
                </div>
              </div>
            </div>
            
            <!-- Progression si disponible -->
            <div v-if="stat.progress !== undefined" class="mt-2">
              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-caption" :style="{ color: stat.textColor }">
                  Progression
                </span>
                <span class="text-caption font-weight-medium" :style="{ color: stat.progressColor }">
                  {{ stat.progress }}%
                </span>
              </div>
              <v-progress-linear
                :model-value="stat.progress"
                :color="stat.progressColor"
                height="4"
                rounded
                :bg-color="stat.progressBgColor"
              ></v-progress-linear>
            </div>
          </div>
          
          <!-- Card Footer -->
          <div class="card-footer pa-3" :style="{ backgroundColor: stat.footerColor }">
            <div class="d-flex align-center justify-space-between">
              <span class="text-caption font-weight-medium" :style="{ color: stat.footerTextColor }">
                {{ stat.description }}
              </span>
              <v-icon :color="stat.footerTextColor" size="small">mdi-chevron-right</v-icon>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  stats: {
    type: Array,
    required: true,
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.dashboard-stats {
  width: 100%;
}

.modern-stat-card {
  border-radius: 12px !important;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  border: none !important;
}

.modern-stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.modern-stat-card .card-content {
  flex: 1;
}

.modern-stat-card .card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.modern-stat-card:hover .card-footer {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.stat-icon-wrapper {
  position: relative;
}

.stat-icon-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modern-stat-card:hover .stat-icon-circle {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Animation for the chevron */
.modern-stat-card:hover .card-footer .v-icon {
  transform: translateX(3px);
}

.modern-stat-card .card-footer .v-icon {
  transition: transform 0.2s ease;
}

/* Compact mode */
.modern-stat-card.compact {
  min-height: 120px;
}

.modern-stat-card.compact .card-content {
  padding: 16px !important;
}

.modern-stat-card.compact .card-footer {
  padding: 12px !important;
}

.modern-stat-card.compact .stat-icon-circle {
  width: 40px;
  height: 40px;
}

.modern-stat-card.compact .text-h4 {
  font-size: 1.8rem !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .modern-stat-card {
    margin-bottom: 16px;
  }
  
  .stat-icon-circle {
    width: 48px;
    height: 48px;
  }
  
  .text-h4 {
    font-size: 2rem !important;
  }
}

@media (max-width: 600px) {
  .modern-stat-card {
    min-height: 120px;
  }
  
  .card-content {
    padding: 16px !important;
  }
  
  .card-footer {
    padding: 12px !important;
  }
  
  .stat-icon-circle {
    width: 40px;
    height: 40px;
  }
  
  .text-h4 {
    font-size: 1.8rem !important;
  }
}

/* Animation subtile au chargement */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modern-stat-card {
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: calc(var(--card-index, 0) * 0.1s);
  opacity: 0;
}

/* Style pour les progrès */
.v-progress-linear {
  border-radius: 2px;
}
</style>