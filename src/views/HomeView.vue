<template>
  <v-app>
    <!-- Optimierte App Bar (oben) -->
    <v-app-bar color="primary" density="compact" flat class="elevation-2">
      <!-- Hamburger Menu -->
      <v-app-bar-nav-icon 
        @click.stop="drawer = !drawer" 
        variant="text"
        size="small"
      ></v-app-bar-nav-icon>
      
      <!-- Logo & App Name -->
      <v-toolbar-title class="text-h6 font-weight-bold d-flex align-center">
        <v-icon icon="mdi-medical-bag" size="small" class="mr-2"></v-icon>
        <span class="d-none d-sm-flex">eMPA</span>
        <span class="d-sm-none">eMPA</span>
        <v-chip 
          color="white" 
          size="x-small" 
          class="ml-2 text-primary" 
          v-if="currentUser"
          density="compact"
        >
          {{ currentUser.isAdmin ? 'Admin' : currentUser.isTechnician ? 'Tech' : 'Betreiber' }}
        </v-chip>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Schnellerfassung als Icon mit Tooltip -->
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            color="white" 
            variant="tonal" 
            @click="toggleQuickActions"
            class="mr-1"
            size="small"
            icon="mdi-plus"
          >
            <v-icon size="small">mdi-plus</v-icon>
          </v-btn>
        </template>
        <span>Schnellerfassung</span>
      </v-tooltip>
      
      <!-- Prüfungserinnerungen -->
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            icon 
            @click="showDueInspections" 
            size="small"
            class="mr-1"
          >
            <v-badge 
              :content="dueInspectionsCount" 
              color="error" 
              :model-value="dueInspectionsCount > 0"
              size="small"
            >
              <v-icon size="small">mdi-calendar-alert</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Fällige Prüfungen ({{ dueInspectionsCount }})</span>
      </v-tooltip>
      
      <!-- Benachrichtigungen -->
      <v-tooltip location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn 
            v-bind="props"
            icon 
            @click="toggleNotifications" 
            size="small"
            class="mr-1"
          >
            <v-badge 
              :content="notificationCount" 
              color="info" 
              :model-value="notificationCount > 0"
              size="small"
            >
              <v-icon size="small">mdi-bell</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Benachrichtigungen ({{ notificationCount }})</span>
      </v-tooltip>
      
      <!-- Schnellerfassung Menu -->
      <v-menu
        v-model="showQuickActionsMenu"
        :close-on-content-click="true"
        location="bottom end"
        offset-y
        style="max-width: 300px;"
      >
        <template v-slot:activator="{ props }">
          <div style="display: none;"></div>
        </template>
        <v-card class="pa-2" elevation="4">
          <div class="text-subtitle-2 font-weight-bold mb-2">Schnellerfassung</div>
          <v-list density="compact" class="py-0">
            <v-list-item 
              v-for="action in quickActions" 
              :key="action.id"
              @click="quickAction(action.action)"
              class="px-2 py-1 mb-1"
            >
              <template v-slot:prepend>
                <v-icon :color="action.color" size="small">{{ action.icon }}</v-icon>
              </template>
              <v-list-item-title class="text-caption">{{ action.title }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption text-grey">{{ action.subtitle }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      
      <!-- Suchfunktion -->
      <v-text-field
        density="compact"
        variant="outlined"
        placeholder="Suchen..."
        prepend-inner-icon="mdi-magnify"
        class="mr-2 mt-2 search-field"
        style="max-width: 200px;"
        hide-details
        single-line
        @click:clear="clearSearch"
        clearable
        v-model="searchQuery"
      ></v-text-field>
      
      <!-- Benutzer-Menu -->
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn 
            variant="text" 
            v-bind="props" 
            size="small"
            class="px-1"
          >
            <v-avatar size="32" color="white" class="mr-1">
              <span class="text-primary text-subtitle-2">{{ getUserInitials() }}</span>
            </v-avatar>
            <span class="text-caption d-none d-md-inline">{{ currentUser?.username }}</span>
            <v-icon size="small" class="ml-1">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list density="compact">
          <v-list-item @click="openUserProfile">
            <template v-slot:prepend>
              <v-icon size="small">mdi-account-cog</v-icon>
            </template>
            <v-list-item-title class="text-caption">Benutzerprofil</v-list-item-title>
          </v-list-item>
          <v-list-item @click="openMPDGDocumentation">
            <template v-slot:prepend>
              <v-icon size="small">mdi-file-document</v-icon>
            </template>
            <v-list-item-title class="text-caption">MPDG-Dokumentation</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="toggleTheme" class="mb-1">
            <template v-slot:prepend>
              <v-icon size="small">{{ isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
            </template>
            <v-list-item-title class="text-caption">
              {{ isDarkTheme ? 'Hell' : 'Dunkel' }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="handleLogout" color="error" density="compact">
            <template v-slot:prepend>
              <v-icon size="small">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="text-caption">Abmelden</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer (links) -->
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
          prepend-icon="mdi-medical-bag"
          title="eMPA System"
          class="px-0"
          :title-class="rail ? 'd-none' : ''"
        >
          <template v-slot:append v-if="!rail">
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              @click.stop="rail = !rail"
              size="small"
            ></v-btn>
          </template>
        </v-list-item>
        
        <v-divider class="my-2"></v-divider>
        
        <!-- Schnelle Navigation -->
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          value="dashboard"
          :active="activeTab === 'dashboard'"
          @click="activeTab = 'dashboard'"
          class="px-0"
          :title-class="rail ? 'd-none' : ''"
        >
          <template v-slot:append v-if="rail">
            <v-icon size="small">mdi-view-dashboard</v-icon>
          </template>
        </v-list-item>
        
        <!-- Datenbank Section -->
        <v-list-group value="datenbank" class="px-0" :prepend-icon="rail ? 'mdi-database' : null">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="!rail ? 'mdi-database' : null"
              title="Datenbank"
              class="px-0"
              :title-class="rail ? 'd-none' : ''"
            >
              <template v-slot:append v-if="rail">
                <v-icon size="small">mdi-database</v-icon>
              </template>
            </v-list-item>
          </template>
          
          <!-- Katalog -->
          <v-list-group value="katalog" sub-group class="px-0">
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props" 
                title="Katalog"
                prepend-icon="mdi-folder"
                class="px-0"
              ></v-list-item>
            </template>
            <v-list-item
              prepend-icon="mdi-factory"
              title="Hersteller"
              value="hersteller"
              :active="activeTab === 'hersteller'"
              @click="activeTab = 'hersteller'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-medical-bag"
              title="Geräteart"
              value="geraeteart"
              :active="activeTab === 'geraeteart'"
              @click="activeTab = 'geraeteart'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-devices"
              title="Gerätetyp"
              value="geraetetyp"
              :active="activeTab === 'geraetetyp'"
              @click="activeTab = 'geraetetyp'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-clipboard-list"
              title="Prüfarten"
              value="pruefarten"
              :active="activeTab === 'pruefarten'"
              @click="activeTab = 'pruefarten'"
              class="px-0"
            ></v-list-item>
          </v-list-group>
          
          <!-- Inventar -->
          <v-list-group value="inventar" sub-group class="px-0">
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props" 
                title="Inventar"
                prepend-icon="mdi-warehouse"
                class="px-0"
              ></v-list-item>
            </template>
            <v-list-item
              prepend-icon="mdi-format-list-bulleted"
              title="Bestandsliste"
              value="bestandsliste"
              :active="activeTab === 'bestandsliste'"
              @click="activeTab = 'bestandsliste'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-archive"
              title="Archiv"
              value="archiv"
              :active="activeTab === 'archiv'"
              @click="activeTab = 'archiv'"
              class="px-0"
            ></v-list-item>
          </v-list-group>
          
          <!-- Kunden -->
          <v-list-group value="kunden" sub-group class="px-0">
            <template v-slot:activator="{ props }">
              <v-list-item 
                v-bind="props" 
                title="Kunden"
                prepend-icon="mdi-account-group"
                class="px-0"
              ></v-list-item>
            </template>
            <v-list-item
              prepend-icon="mdi-account-group"
              title="Kundengruppen"
              value="kundengruppen"
              :active="activeTab === 'kundengruppen'"
              @click="activeTab = 'kundengruppen'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-map-marker-multiple"
              title="Kundenstandorte"
              value="kundenstandorte"
              :active="activeTab === 'kundenstandorte'"
              @click="activeTab = 'kundenstandorte'"
              class="px-0"
            ></v-list-item>
            <v-list-item
              prepend-icon="mdi-account-box-multiple"
              title="Alle Kunden"
              value="kundenliste"
              :active="activeTab === 'kundenliste'"
              @click="activeTab = 'kundenliste'"
              class="px-0"
            ></v-list-item>
          </v-list-group>
        </v-list-group>
        
        <!-- Prüfungen Section -->
        <v-list-item
          prepend-icon="mdi-clipboard-check"
          title="Prüfungen"
          value="pruefungen"
          :active="activeTab === 'pruefungen'"
          @click="activeTab = 'pruefungen'"
          class="px-0"
          :title-class="rail ? 'd-none' : ''"
        >
          <template v-slot:append v-if="rail">
            <v-icon size="small">mdi-clipboard-check</v-icon>
          </template>
        </v-list-item>
        
        <!-- Dokumente Section -->
        <v-list-group value="dokumente" class="px-0" :prepend-icon="rail ? 'mdi-file-document-multiple' : null">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="!rail ? 'mdi-file-document-multiple' : null"
              title="Dokumente"
              class="px-0"
              :title-class="rail ? 'd-none' : ''"
            >
              <template v-slot:append v-if="rail">
                <v-icon size="small">mdi-file-document-multiple</v-icon>
              </template>
            </v-list-item>
          </template>
          
          <v-list-item
            prepend-icon="mdi-file-document"
            title="Prüfprotokolle"
            value="pruefprotokolle"
            :active="activeTab === 'pruefprotokolle'"
            @click="activeTab = 'pruefprotokolle'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-book-open-variant"
            title="Bedienungsanleitungen"
            value="bedienungsanleitungen"
            :active="activeTab === 'bedienungsanleitungen'"
            @click="activeTab = 'bedienungsanleitungen'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-book-multiple"
            title="Medizinproduktebuch"
            value="medizinproduktebuch"
            :active="activeTab === 'medizinproduktebuch'"
            @click="activeTab = 'medizinproduktebuch'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-certificate"
            title="Zertifikate"
            value="zertifikate"
            :active="activeTab === 'zertifikate'"
            @click="activeTab = 'zertifikate'"
            class="px-0"
          ></v-list-item>
        </v-list-group>
        
        <!-- Aufträge Section -->
        <v-list-group value="auftraege" class="px-0" :prepend-icon="rail ? 'mdi-clipboard-list' : null">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="!rail ? 'mdi-clipboard-list' : null"
              title="Aufträge"
              class="px-0"
              :title-class="rail ? 'd-none' : ''"
            >
              <template v-slot:append v-if="rail">
                <v-icon size="small">mdi-clipboard-list</v-icon>
              </template>
            </v-list-item>
          </template>
          
          <v-list-item
            prepend-icon="mdi-clipboard-list"
            title="Auftragsliste"
            value="auftragsliste"
            :active="activeTab === 'auftragsliste'"
            @click="activeTab = 'auftragsliste'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-plus-box"
            title="Neuer Auftrag"
            value="neuer-auftrag"
            :active="activeTab === 'neuer-auftrag'"
            @click="activeTab = 'neuer-auftrag'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-calendar-clock"
            title="Auftragsplanung"
            value="auftragsplanung"
            :active="activeTab === 'auftragsplanung'"
            @click="activeTab = 'auftragsplanung'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-progress-wrench"
            title="Auftragsabwicklung"
            value="auftragsabwicklung"
            :active="activeTab === 'auftragsabwicklung'"
            @click="activeTab = 'auftragsabwicklung'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-archive-outline"
            title="Auftragsarchiv"
            value="auftragsarchiv"
            :active="activeTab === 'auftragsarchiv'"
            @click="activeTab = 'auftragsarchiv'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-wrench"
            title="Wartungsaufträge"
            value="wartungsauftraege"
            :active="activeTab === 'wartungsauftraege'"
            @click="activeTab = 'wartungsauftraege'"
            class="px-0"
            ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-hammer-wrench"
            title="Reparaturaufträge"
            value="reparaturauftraege"
            :active="activeTab === 'reparaturauftraege'"
            @click="activeTab = 'reparaturauftraege'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-ruler-square-compass"
            title="Kalibrieraufträge"
            value="kalibrierauftraege"
            :active="activeTab === 'kalibrierauftraege'"
            @click="activeTab = 'kalibrierauftraege'"
            class="px-0"
          ></v-list-item>
        </v-list-group>
        
        <!-- Verwaltung -->
        <v-list-group value="verwaltung" class="px-0" v-if="currentUser?.isAdmin" :prepend-icon="rail ? 'mdi-cog' : null">
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :prepend-icon="!rail ? 'mdi-cog' : null"
              title="Verwaltung"
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
            title="Benutzerverwaltung"
            value="benutzerverwaltung"
            :active="activeTab === 'benutzerverwaltung'"
            @click="activeTab = 'benutzerverwaltung'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-cog"
            title="Systemeinstellungen"
            value="systemeinstellungen"
            :active="activeTab === 'systemeinstellungen'"
            @click="activeTab = 'systemeinstellungen'"
            class="px-0"
          ></v-list-item>
          
          <v-list-item
            prepend-icon="mdi-shield-check"
            title="MPDG-Konformität"
            value="mpdg-konformitaet"
            :active="activeTab === 'mpdg-konformitaet'"
            @click="activeTab = 'mpdg-konformitaet'"
            class="px-0"
          ></v-list-item>
        </v-list-group>
        
        <!-- Hilfe -->
        <v-divider class="my-2"></v-divider>
        
        <v-list-item
          prepend-icon="mdi-help-circle"
          title="Hilfe & Support"
          value="hilfe"
          :active="activeTab === 'hilfe'"
          @click="activeTab = 'hilfe'"
          class="px-0"
          :title-class="rail ? 'd-none' : ''"
        >
          <template v-slot:append v-if="rail">
            <v-icon size="small">mdi-help-circle</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Hauptinhalt -->
    <v-main style="background-color: #f8f9fa;">
      <v-container fluid class="pa-4">
        <!-- Optimierter Dashboard Header -->
        <v-row class="mb-4">
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center flex-wrap">
              <div class="mb-2">
                <div class="d-flex align-center">
                  <v-icon :icon="getPageIcon()" class="mr-2" size="small"></v-icon>
                  <h1 class="text-h5 font-weight-bold text-grey-darken-3">
                    {{ getPageTitle() }}
                  </h1>
                </div>
                <p class="text-caption text-grey-darken-1 mt-1">
                  {{ getPageSubtitle() }}
                </p>
              </div>
              
              <!-- Compact Quick Actions -->
              <div class="d-flex align-center gap-1 flex-wrap">
                <v-btn
                  color="primary"
                  @click="printReport"
                  size="small"
                  variant="tonal"
                  class="mr-1 header-action-btn"
                >
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-printer</v-icon>
                  </template>
                  <span class="d-none d-sm-inline">Drucken</span>
                </v-btn>
                <v-btn
                  variant="outlined"
                  @click="exportData"
                  size="small"
                  class="mr-1 header-action-btn"
                >
                  <template v-slot:prepend>
                    <v-icon size="small">mdi-export</v-icon>
                  </template>
                  <span class="d-none d-sm-inline">Export</span>
                </v-btn>
                <v-btn
                  variant="tonal"
                  @click="refreshData"
                  size="small"
                  class="header-action-btn"
                >
                  <v-icon size="small">mdi-refresh</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Wichtige Hinweise - Compact -->
        <v-row class="mb-3" v-if="showImportantNotes">
          <v-col cols="12">
            <v-alert type="warning" variant="tonal" density="compact" class="mb-1">
              <div class="d-flex align-center">
                <v-icon class="mr-2" size="small">mdi-alert</v-icon>
                <div class="text-caption">
                  <strong>MPDG-Konformität:</strong> Bitte stellen Sie sicher, dass alle Prüfungen gemäß MPBetreibV durchgeführt werden.
                </div>
              </div>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Modernisierte Statistik Karten mit Footer Design -->
        <v-row class="mb-4">
          <v-col cols="12" sm="6" md="3" v-for="(stat, index) in modernStats" :key="index">
            <v-card 
              class="modern-stat-card-footer"
              elevation="2"
              @click="stat.action"
              density="compact"
              :style="{ backgroundColor: stat.cardColor }"
            >
              <!-- Card Content -->
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
                      <div class="text-caption ml-2" 
                           :style="{ color: stat.subtitleColor }" 
                           v-if="stat.subtitle">
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

        <!-- Hauptbereich: Fällige Prüfungen und Aktivitäten -->
        <v-row class="mb-4">
          <!-- Fällige Prüfungen -->
          <v-col cols="12" md="8">
            <v-card elevation="1" class="pa-3">
              <div class="d-flex justify-space-between align-center mb-3">
                <h2 class="text-subtitle-1 font-weight-bold">Fällige Prüfungen</h2>
                <div class="d-flex align-center">
                  <span class="text-caption text-grey mr-2">Alle anzeigen</span>
                  <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                </div>
              </div>
              
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-caption">Gerät</th>
                    <th class="text-caption">Kunde</th>
                    <th class="text-caption">Fällig</th>
                    <th class="text-caption">Status</th>
                    <th class="text-caption"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="inspection in dueInspections.slice(0, 5)" :key="inspection.id">
                    <td class="py-2">
                      <div class="d-flex align-center">
                        <v-icon class="mr-1" color="grey" size="small">mdi-medical-bag</v-icon>
                        <span class="text-caption">{{ inspection.deviceName }}</span>
                      </div>
                    </td>
                    <td class="py-2">
                      <div class="text-caption text-truncate" style="max-width: 150px;">
                        {{ inspection.customer }}
                      </div>
                    </td>
                    <td class="py-2">
                      <div :class="inspection.isOverdue ? 'text-error font-weight-bold' : 'text-caption'">
                        {{ inspection.dueDate }}
                      </div>
                    </td>
                    <td class="py-2">
                      <v-chip
                        :color="getInspectionStatusColor(inspection.status)"
                        size="x-small"
                        label
                        density="compact"
                      >
                        {{ inspection.status }}
                      </v-chip>
                    </td>
                    <td class="py-2">
                      <v-btn
                        size="x-small"
                        variant="tonal"
                        @click="startInspection(inspection.id)"
                        icon="mdi-play"
                        density="compact"
                      >
                        <v-icon size="small">mdi-play</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              
              <v-alert v-if="dueInspections.length === 0" type="info" variant="tonal" density="compact" class="mt-2">
                Keine fälligen Prüfungen vorhanden.
              </v-alert>
            </v-card>
          </v-col>

          <!-- Letzte Aktivitäten -->
          <v-col cols="12" md="4">
            <v-card elevation="1" class="pa-3">
              <div class="d-flex justify-space-between align-center mb-3">
                <h2 class="text-subtitle-1 font-weight-bold">Letzte Aktivitäten</h2>
                <div class="d-flex align-center">
                  <span class="text-caption text-grey mr-2">Protokoll</span>
                  <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                </div>
              </div>
              <v-list lines="two" density="compact">
                <v-list-item
                  v-for="(activity, index) in recentActivities.slice(0, 4)"
                  :key="index"
                  :prepend-icon="activity.icon"
                  :title="activity.title"
                  :subtitle="activity.time"
                  class="py-1"
                >
                  <template v-slot:prepend>
                    <v-icon :color="activity.color" size="small">{{ activity.icon }}</v-icon>
                  </template>
                  <template v-slot:title>
                    <span class="text-caption">{{ activity.title }}</span>
                  </template>
                  <template v-slot:subtitle>
                    <span class="text-caption text-grey">{{ activity.time }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>

        <!-- Modernisierte Auftragsübersicht - Geteilt in zwei Teile -->
        <v-row class="mb-4">
          <!-- Linke Seite: Auftragsstatistiken -->
          <v-col cols="12" md="8">
            <v-card elevation="1" class="pa-3 h-100 modern-card">
              <div class="d-flex justify-space-between align-center mb-3">
                <h2 class="text-subtitle-1 font-weight-bold">Auftragsübersicht</h2>
                <div class="d-flex align-center">
                  <span class="text-caption text-grey mr-2">Alle Aufträge</span>
                  <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                </div>
              </div>
              
              <!-- Modernisierte Auftragsstatistiken mit Icons -->
              <v-row class="mb-4">
                <v-col cols="6" md="3" v-for="(orderStat, index) in modernOrderStats" :key="index">
                  <v-card 
                    class="pa-3 text-center modern-order-card" 
                    :class="orderStat.class"
                    elevation="0"
                    density="compact"
                    @click="orderStat.action"
                  >
                    <div class="d-flex flex-column align-center">
                      <!-- Icon au centre -->
                      <div class="stat-icon-container mb-3" :style="{ backgroundColor: orderStat.iconBgColor }">
                        <v-icon :color="orderStat.iconColor" size="24">{{ orderStat.icon }}</v-icon>
                      </div>
                      
                      <!-- Zahlen -->
                      <div class="text-h4 font-weight-bold mb-1">{{ orderStat.value }}</div>
                      <div class="text-caption text-white mb-2">{{ orderStat.label }}</div>
                      
                      <!-- Pfeil rechts -->
                      <div class="d-flex justify-end w-100">
                        <v-icon color="white" size="small" class="arrow-icon">mdi-chevron-right</v-icon>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <!-- Auftragsstatus-Verteilung -->
              <div class="mt-4">
                <h3 class="text-subtitle-2 font-weight-bold mb-3">Auftragsstatus Verteilung</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <div class="status-distribution">
                      <div 
                        v-for="status in orderStatusDistribution" 
                        :key="status.label"
                        class="status-item mb-2"
                      >
                        <div class="d-flex justify-space-between align-center">
                          <div class="d-flex align-center">
                            <div class="status-color-indicator mr-2" :style="{ backgroundColor: status.color }"></div>
                            <span class="text-caption">{{ status.label }}</span>
                          </div>
                          <div class="d-flex align-center">
                            <span class="text-caption font-weight-bold mr-2">{{ status.count }}</span>
                            <span class="text-caption text-grey">({{ status.percentage }}%)</span>
                          </div>
                        </div>
                        <v-progress-linear
                          :model-value="status.percentage"
                          :color="status.color"
                          height="6"
                          rounded
                          class="mt-1"
                        ></v-progress-linear>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6">
                    <div class="order-timeline">
                      <h4 class="text-subtitle-2 font-weight-bold mb-3">Letzte Aufträge</h4>
                      <v-list density="compact" class="py-0">
                        <v-list-item
                          v-for="order in recentOrders"
                          :key="order.id"
                          class="px-0 py-1"
                        >
                          <template v-slot:prepend>
                            <v-icon :color="order.color" size="small">{{ order.icon }}</v-icon>
                          </template>
                          <v-list-item-title class="text-caption">{{ order.title }}</v-list-item-title>
                          <v-list-item-subtitle class="text-caption">{{ order.subtitle }}</v-list-item-subtitle>
                          <template v-slot:append>
                            <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>

          <!-- Rechte Seite: Schnellaktionen und Auftragserfassung -->
          <v-col cols="12" md="4">
            <v-card elevation="1" class="pa-3 h-100 modern-card">
              <div class="d-flex justify-space-between align-center mb-3">
                <h2 class="text-subtitle-1 font-weight-bold">Schnellaktionen</h2>
                <v-icon color="primary" size="small">mdi-lightning-bolt</v-icon>
              </div>

              <!-- Neue Aufträge Erfassung -->
              <div class="quick-actions-section mb-4">
                <h3 class="text-subtitle-2 font-weight-bold mb-2">Neuer Auftrag</h3>
                <div class="d-grid grid-cols-2 gap-2 mb-3">
                  <v-btn
                    color="primary"
                    @click="createMaintenanceOrder"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-wrench"
                    density="compact"
                    class="quick-action-btn"
                  >
                    Wartung
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="createRepairOrder"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-hammer-wrench"
                    density="compact"
                    class="quick-action-btn"
                  >
                    Reparatur
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="createCalibrationOrder"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-ruler-square-compass"
                    density="compact"
                    class="quick-action-btn"
                  >
                    Kalibrierung
                  </v-btn>
                  <v-btn
                    color="primary"
                    @click="createGeneralOrder"
                    variant="tonal"
                    size="small"
                    prepend-icon="mdi-plus"
                    density="compact"
                    class="quick-action-btn"
                  >
                    Allgemein
                  </v-btn>
                </div>
              </div>

              <!-- Auftragsfortschritt -->
              <div class="order-progress-section mb-4">
                <h3 class="text-subtitle-2 font-weight-bold mb-3">Auftragsfortschritt</h3>
                <div class="progress-container">
                  <div class="d-flex justify-space-between mb-1">
                    <span class="text-caption">Abgeschlossen</span>
                    <span class="text-caption font-weight-bold">{{ completionRate }}%</span>
                  </div>
                  <v-progress-linear
                    :model-value="completionRate"
                    color="success"
                    height="10"
                    rounded
                    class="mb-2"
                  ></v-progress-linear>
                  <div class="d-flex justify-space-between">
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ pendingOrders }}</div>
                      <div class="text-caption text-grey">Ausstehend</div>
                    </div>
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ stats.activeOrders }}</div>
                      <div class="text-caption text-grey">In Arbeit</div>
                    </div>
                    <div class="text-center">
                      <div class="text-h6 font-weight-bold">{{ completedOrders }}</div>
                      <div class="text-caption text-grey">Fertig</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Dringende Aufträge -->
              <div class="urgent-orders-section">
                <div class="d-flex justify-space-between align-center mb-2">
                  <h3 class="text-subtitle-2 font-weight-bold">Dringende Aufträge</h3>
                  <div class="d-flex align-center">
                    <span class="text-caption text-error mr-1">{{ urgentOrders.length }} dringend</span>
                    <v-icon size="small" color="error">mdi-chevron-right</v-icon>
                  </div>
                </div>
                <v-list density="compact" class="py-0">
                  <v-list-item
                    v-for="order in urgentOrders"
                    :key="order.id"
                    class="px-0 py-1 urgent-order-item"
                  >
                    <template v-slot:prepend>
                      <v-icon color="error" size="small">mdi-alert-circle</v-icon>
                    </template>
                    <v-list-item-title class="text-caption">{{ order.title }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ order.deadline }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-icon size="small" color="primary">mdi-chevron-right</v-icon>
                    </template>
                  </v-list-item>
                </v-list>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Footer mit Systemstatus -->
        <v-row class="mt-4">
          <v-col cols="12">
            <v-card variant="outlined" density="compact" class="pa-3">
              <div class="d-flex justify-space-between align-center flex-wrap gap-2">
                <div class="d-flex align-center gap-2">
                  <v-icon icon="mdi-shield-check" color="primary" size="small"></v-icon>
                  <div>
                    <div class="text-body-2">MPDG/MPBetreibV konform</div>
                    <div class="text-caption text-grey">
                      Letzte Sicherung: {{ lastBackup }}
                    </div>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <v-btn
                    variant="tonal"
                    size="small"
                    @click="openComplianceReport"
                    density="compact"
                    prepend-icon="mdi-file-document"
                  >
                    Konformitätsbericht
                  </v-btn>
                  <v-btn
                    variant="tonal"
                    size="small"
                    @click="exportComplianceData"
                    density="compact"
                    prepend-icon="mdi-download"
                  >
                    MPDG-Export
                  </v-btn>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Footer mit Quick-Access-Buttons -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-card variant="flat" class="pa-2" color="grey-lighten-4">
              <div class="d-flex justify-center flex-wrap gap-2">
                <v-btn
                  variant="tonal"
                  size="small"
                  @click="activeTab = 'bestandsliste'"
                  density="compact"
                  prepend-icon="mdi-medical-bag"
                >
                  Bestandsliste
                </v-btn>
                <v-btn
                  variant="tonal"
                  size="small"
                  @click="activeTab = 'pruefprotokolle'"
                  density="compact"
                  prepend-icon="mdi-file-document"
                >
                  Prüfprotokolle
                </v-btn>
                <v-btn
                  variant="tonal"
                  size="small"
                  @click="activeTab = 'kundenliste'"
                  density="compact"
                  prepend-icon="mdi-account-group"
                >
                  Kundenliste
                </v-btn>
                <v-btn
                  variant="tonal"
                  size="small"
                  @click="activeTab = 'auftragsliste'"
                  density="compact"
                  prepend-icon="mdi-clipboard-list"
                >
                  Auftragsliste
                </v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Notifications Panel -->
    <v-navigation-drawer
      v-model="showNotifications"
      location="right"
      temporary
      width="320"
    >
      <v-toolbar density="compact" flat>
        <v-toolbar-title class="text-subtitle-1">Benachrichtigungen</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="showNotifications = false" size="small"></v-btn>
      </v-toolbar>
      <v-list density="compact">
        <v-list-item
          v-for="notification in notifications"
          :key="notification.id"
          :prepend-icon="notification.icon"
          :title="notification.title"
          :subtitle="notification.message"
        >
          <template v-slot:prepend>
            <v-icon :color="notification.color" size="small">{{ notification.icon }}</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawer = ref(true)
const rail = ref(false)
const activeTab = ref('dashboard')
const currentUser = ref(null)
const showQuickActionsMenu = ref(false)
const showNotifications = ref(false)
const isDarkTheme = ref(false)
const searchQuery = ref('')

// Statistische Daten
const dueInspectionsCount = ref(5)
const notificationCount = ref(3)

// Aufträge Statistik
const pendingOrders = ref(8)
const completedOrders = ref(9)
const maintenanceOrders = ref(3)
const repairOrders = ref(2)
const calibrationOrders = ref(4)

// Systeminformationen
const lastBackup = ref('Heute, 02:00 Uhr')

// Schnellerfassungs-Aktionen
const quickActions = ref([
  { id: 1, icon: 'mdi-medical-bag-plus', title: 'Medizinprodukt erfassen', subtitle: 'Neues Gerät anlegen', action: 'device', color: 'primary' },
  { id: 2, icon: 'mdi-clipboard-plus', title: 'Prüfung durchführen', subtitle: 'Sicherheitstechnische Kontrolle', action: 'inspection', color: 'orange' },
  { id: 3, icon: 'mdi-account-plus', title: 'Kunden anlegen', subtitle: 'Neuen Kunden erfassen', action: 'customer', color: 'green' },
  { id: 4, icon: 'mdi-factory', title: 'Hersteller erfassen', subtitle: 'Neuen Hersteller hinzufügen', action: 'manufacturer', color: 'blue' },
  { id: 5, icon: 'mdi-devices', title: 'Gerätetyp erfassen', subtitle: 'Neuen Gerätetyp definieren', action: 'deviceType', color: 'purple' },
  { id: 6, icon: 'mdi-clipboard-list', title: 'Prüfart erfassen', subtitle: 'Neue Prüfart anlegen', action: 'inspectionType', color: 'teal' }
])

// Statistiken
const stats = ref({
  totalDevices: 156,
  activeDevices: 142,
  dueInspections: 5,
  overdueInspections: 2,
  totalCustomers: 68,
  activeCustomers: 65,
  totalInspections: 1248,
  lastMonthInspections: 42,
  totalOrders: 24,
  activeOrders: 17
})

// Modernisierte Statistiken avec footer design
const modernStats = computed(() => [
  {
    title: 'Medizinprodukte',
    value: stats.value.totalDevices,
    subtitle: `${stats.value.activeDevices} aktiv`,
    description: 'Insgesamt',
    icon: 'mdi-medical-bag',
    // Couleurs pour la carte "Medizinprodukte" - Vert
    cardColor: '#E8F5E9', // Vert très clair
    footerColor: '#4CAF50', // Vert
    textColor: '#1B5E20', // Vert foncé
    subtitleColor: '#388E3C', // Vert moyen
    footerTextColor: '#FFFFFF', // Blanc pour le footer
    iconColor: '#4CAF50', // Vert
    iconBgColor: 'rgba(76, 175, 80, 0.1)', // Vert très transparent
    action: () => activeTab.value = 'bestandsliste'
  },
  {
    title: 'Fällige Prüfungen',
    value: stats.value.dueInspections,
    subtitle: stats.value.overdueInspections > 0 ? `${stats.value.overdueInspections} überfällig` : '',
    description: 'Diese Woche',
    icon: 'mdi-calendar-alert',
    // Couleurs pour la carte "Fällige Prüfungen" - Orange
    cardColor: '#FFF3E0', // Orange très clair
    footerColor: '#FF9800', // Orange
    textColor: '#E65100', // Orange foncé
    subtitleColor: '#FF5722', // Rouge-orange (pour les éléments urgents)
    footerTextColor: '#FFFFFF', // Blanc pour le footer
    iconColor: '#FF9800', // Orange
    iconBgColor: 'rgba(255, 152, 0, 0.1)', // Orange très transparent
    action: () => showDueInspections()
  },
  {
    title: 'Kunden',
    value: stats.value.totalCustomers,
    subtitle: `${stats.value.activeCustomers} aktiv`,
    description: 'Aktive Kunden',
    icon: 'mdi-account-group',
    // Couleurs pour la carte "Kunden" - Bleu
    cardColor: '#E3F2FD', // Bleu très clair
    footerColor: '#2196F3', // Bleu
    textColor: '#0D47A1', // Bleu foncé
    subtitleColor: '#1976D2', // Bleu moyen
    footerTextColor: '#FFFFFF', // Blanc pour le footer
    iconColor: '#2196F3', // Bleu
    iconBgColor: 'rgba(33, 150, 243, 0.1)', // Bleu très transparent
    action: () => activeTab.value = 'kundenliste'
  },
  {
    title: 'Prüfprotokolle',
    value: stats.value.lastMonthInspections,
    subtitle: `${stats.value.totalInspections} gesamt`,
    description: 'Diesen Monat',
    icon: 'mdi-clipboard-check',
    // Couleurs pour la carte "Prüfprotokolle" - Violet
    cardColor: '#F3E5F5', // Violet très clair
    footerColor: '#9C27B0', // Violet
    textColor: '#4A148C', // Violet foncé
    subtitleColor: '#7B1FA2', // Violet moyen
    footerTextColor: '#FFFFFF', // Blanc pour le footer
    iconColor: '#9C27B0', // Violet
    iconBgColor: 'rgba(156, 39, 176, 0.1)', // Violet très transparent
    action: () => activeTab.value = 'pruefprotokolle'
  }
])

// Modernisierte Auftragsstatistiken mit Pfeilen
const modernOrderStats = computed(() => [
  { 
    label: 'Gesamt', 
    value: stats.value.totalOrders, 
    color: 'primary',
    class: 'primary-gradient',
    action: () => activeTab.value = 'auftragsliste',
    icon: 'mdi-clipboard-list',
    iconColor: 'white',
    iconBgColor: 'rgba(255, 255, 255, 0.2)'
  },
  { 
    label: 'Ausstehend', 
    value: pendingOrders.value, 
    color: 'warning',
    class: 'warning-gradient',
    action: () => activeTab.value = 'auftragsliste',
    icon: 'mdi-clock-outline',
    iconColor: 'white',
    iconBgColor: 'rgba(255, 255, 255, 0.2)'
  },
  { 
    label: 'In Bearbeitung', 
    value: stats.value.activeOrders, 
    color: 'info',
    class: 'info-gradient',
    action: () => activeTab.value = 'auftragsabwicklung',
    icon: 'mdi-progress-wrench',
    iconColor: 'white',
    iconBgColor: 'rgba(255, 255, 255, 0.2)'
  },
  { 
    label: 'Abgeschlossen', 
    value: completedOrders.value, 
    color: 'success',
    class: 'success-gradient',
    action: () => activeTab.value = 'auftragsarchiv',
    icon: 'mdi-check-circle-outline',
    iconColor: 'white',
    iconBgColor: 'rgba(255, 255, 255, 0.2)'
  }
])

// Auftragsstatus-Verteilung
const orderStatusDistribution = computed(() => [
  { label: 'Ausstehend', count: pendingOrders.value, percentage: Math.round((pendingOrders.value / stats.value.totalOrders) * 100), color: '#ff9800' },
  { label: 'In Bearbeitung', count: stats.value.activeOrders, percentage: Math.round((stats.value.activeOrders / stats.value.totalOrders) * 100), color: '#2196f3' },
  { label: 'Abgeschlossen', count: completedOrders.value, percentage: Math.round((completedOrders.value / stats.value.totalOrders) * 100), color: '#4caf50' },
  { label: 'Storniert', count: 2, percentage: Math.round((2 / stats.value.totalOrders) * 100), color: '#f44336' }
])

// Letzte Aufträge
const recentOrders = ref([
  { id: 1, title: 'Wartung Beatmungsgerät', subtitle: 'Krankenhaus Berlin', status: 'In Bearbeitung', icon: 'mdi-wrench', color: 'info', statusColor: 'info' },
  { id: 2, title: 'Kalibrierung Patientemonitor', subtitle: 'Praxis Dr. Schmidt', status: 'Abgeschlossen', icon: 'mdi-ruler-square-compass', color: 'success', statusColor: 'success' },
  { id: 3, title: 'Reparatur Defibrillator', subtitle: 'Rotes Kreuz Dortmund', status: 'Ausstehend', icon: 'mdi-hammer-wrench', color: 'warning', statusColor: 'warning' },
  { id: 4, title: 'Sicherheitsprüfung Infusionspumpe', subtitle: 'Klinikum Hamburg', status: 'In Bearbeitung', icon: 'mdi-clipboard-check', color: 'info', statusColor: 'info' }
])

// Dringende Aufträge
const urgentOrders = ref([
  { id: 1, title: 'Dringende Wartung CT-Gerät', deadline: 'Heute, 16:00', priority: 'hoch' },
  { id: 2, title: 'Notfall-Reparatur Monitor', deadline: 'Morgen, 09:00', priority: 'hoch' },
  { id: 3, title: 'Sicherheitsprüfung OP-Lampe', deadline: 'Übermorgen', priority: 'mittel' }
])

// Abschlussrate berechnen
const completionRate = computed(() => {
  return Math.round((completedOrders.value / stats.value.totalOrders) * 100)
})

// Benachrichtigungen
const notifications = ref([
  { id: 1, icon: 'mdi-alert', title: 'Prüfung überfällig', message: 'Defibrillator LifeLine', color: 'error' },
  { id: 2, icon: 'mdi-bell', title: 'Neuer Auftrag', message: 'Wartung Beatmungsgerät', color: 'info' },
  { id: 3, icon: 'mdi-file-document', title: 'Dokument bereit', message: 'Prüfprotokoll #1234', color: 'success' }
])

// Fällige Prüfungen
const dueInspections = ref([
  { 
    id: 1, 
    deviceName: 'Beatmunfsgerät XYZ-2000', 
    customer: 'Krankenhaus Berlin-Mitte', 
    inspectionType: 'Sicherheitstechnische Kontrolle', 
    dueDate: '15.12.2023', 
    status: 'Fällig',
    isOverdue: false
  },
  { 
    id: 2, 
    deviceName: 'Defibrillator LifeLine', 
    customer: 'Rotes Kreuz Dortmund', 
    inspectionType: 'Funktionsprüfung', 
    dueDate: '10.12.2023', 
    status: 'Überfällig',
    isOverdue: true
  },
  { 
    id: 3, 
    deviceName: 'Patientenmonitor V8', 
    customer: 'Praxis Dr. Schmidt', 
    inspectionType: 'Messtechnische Kontrolle', 
    dueDate: '20.12.2023', 
    status: 'Bald fällig',
    isOverdue: false
  }
])

// Aktivitäten
const recentActivities = ref([
  { icon: 'mdi-clipboard-check', title: 'Prüfung abgeschlossen: Defibrillator', time: 'Vor 30 Minuten', color: 'success' },
  { icon: 'mdi-file-upload', title: 'Bedienungsanleitung hochgeladen', time: 'Vor 2 Stunden', color: 'info' },
  { icon: 'mdi-account-plus', title: 'Neuer Kunde angelegt', time: 'Heute, 09:15', color: 'primary' },
  { icon: 'mdi-alert-circle', title: 'Prüfung überfällig: Beatmungsgerät', time: 'Gestern, 16:30', color: 'error' },
  { icon: 'mdi-update', title: 'System-Update durchgeführt', time: 'Gestern, 22:00', color: 'warning' }
])

onMounted(() => {
  console.log('eMPA Dashboard geladen')
  
  // Benutzerdaten laden
  const userData = localStorage.getItem('currentUser')
  
  if (userData) {
    try {
      currentUser.value = JSON.parse(userData)
      console.log('Aktueller Benutzer:', currentUser.value)
      
      fetchDashboardData()
    } catch (error) {
      console.error('Fehler beim Parsen der Benutzerdaten:', error)
      router.push({ name: 'login' })
    }
  } else {
    console.log('Keine Benutzerdaten gefunden, Weiterleitung zum Login')
    router.push({ name: 'login' })
  }
})

const fetchDashboardData = async () => {
  console.log('Lade Dashboard-Daten...')
}

const getPageTitle = () => {
  const titles = {
    'dashboard': 'Dashboard',
    'hersteller': 'Hersteller',
    'geraeteart': 'Gerätearten',
    'geraetetyp': 'Gerätetypen',
    'pruefarten': 'Prüfarten',
    'bestandsliste': 'Bestandsliste',
    'archiv': 'Archiv',
    'kundengruppen': 'Kundengruppen',
    'kundenstandorte': 'Standorte',
    'kundenliste': 'Kunden',
    'pruefungen': 'Prüfungen',
    'pruefprotokolle': 'Prüfprotokolle',
    'bedienungsanleitungen': 'Anleitungen',
    'medizinproduktebuch': 'MP-Buch',
    'zertifikate': 'Zertifikate',
    'auftragsliste': 'Aufträge',
    'neuer-auftrag': 'Neuer Auftrag',
    'auftragsplanung': 'Planung',
    'auftragsabwicklung': 'Abwicklung',
    'auftragsarchiv': 'Archiv',
    'wartungsauftraege': 'Wartung',
    'reparaturauftraege': 'Reparatur',
    'kalibrierauftraege': 'Kalibrierung',
    'benutzerverwaltung': 'Benutzer',
    'systemeinstellungen': 'Einstellungen',
    'mpdg-konformitaet': 'MPDG',
    'disposition': 'Disposition',
    'hilfe': 'Hilfe'
  }
  return titles[activeTab.value] || 'Dashboard'
}

const getPageSubtitle = () => {
  const subtitles = {
    'dashboard': 'Überblick über Medizinprodukte, Prüfungen und Kunden',
    'hersteller': 'Hersteller von Medizinprodukten',
    'geraeteart': 'Klassifizierung von Gerätearten',
    'geraetetyp': 'Spezifische Gerätetypen',
    'pruefarten': 'Prüfarten und -intervalle',
    'bestandsliste': 'Aktueller Bestand',
    'archiv': 'Archivierte Geräte',
    'kundengruppen': 'Gruppierung von Kunden',
    'kundenstandorte': 'Standortverwaltung',
    'kundenliste': 'Alle Kunden',
    'pruefungen': 'Geplante und durchgeführte Prüfungen',
    'pruefprotokolle': 'Prüfprotokolle und Berichte',
    'bedienungsanleitungen': 'IFU und Bedienungsanleitungen',
    'medizinproduktebuch': 'Dokumentation gemäß MPBetreibV',
    'zertifikate': 'Konformitätserklärungen',
    'auftragsliste': 'Alle Aufträge',
    'neuer-auftrag': 'Neuen Auftrag erfassen',
    'auftragsplanung': 'Planung und Terminierung',
    'auftragsabwicklung': 'Bearbeitung und Abwicklung',
    'auftragsarchiv': 'Archivierte Aufträge',
    'wartungsauftraege': 'Wartungsaufträge',
    'reparaturauftraege': 'Reparaturaufträge',
    'kalibrierauftraege': 'Kalibrieraufträge',
    'benutzerverwaltung': 'Benutzer und Berechtigungen',
    'systemeinstellungen': 'Systemkonfiguration',
    'mpdg-konformitaet': 'MPDG- und MPBetreibV-Konformität',
    'disposition': 'Einsatzplanung',
    'hilfe': 'Hilfedokumentation'
  }
  return subtitles[activeTab.value] || 'Elektronische Medizinproduktakte'
}

const getPageIcon = () => {
  const icons = {
    'dashboard': 'mdi-view-dashboard',
    'hersteller': 'mdi-factory',
    'geraeteart': 'mdi-medical-bag',
    'geraetetyp': 'mdi-devices',
    'pruefarten': 'mdi-clipboard-list',
    'bestandsliste': 'mdi-format-list-bulleted',
    'archiv': 'mdi-archive',
    'kundengruppen': 'mdi-account-group',
    'kundenstandorte': 'mdi-map-marker-multiple',
    'kundenliste': 'mdi-account-box-multiple',
    'pruefungen': 'mdi-clipboard-check',
    'pruefprotokolle': 'mdi-file-document',
    'bedienungsanleitungen': 'mdi-book-open-variant',
    'medizinproduktebuch': 'mdi-book-multiple',
    'zertifikate': 'mdi-certificate',
    'auftragsliste': 'mdi-clipboard-list',
    'neuer-auftrag': 'mdi-plus-box',
    'auftragsplanung': 'mdi-calendar-clock',
    'auftragsabwicklung': 'mdi-progress-wrench',
    'auftragsarchiv': 'mdi-archive-outline',
    'wartungsauftraege': 'mdi-wrench',
    'reparaturauftraege': 'mdi-hammer-wrench',
    'kalibrierauftraege': 'mdi-ruler-square-compass',
    'benutzerverwaltung': 'mdi-account-cog',
    'systemeinstellungen': 'mdi-cog',
    'mpdg-konformitaet': 'mdi-shield-check',
    'disposition': 'mdi-calendar-clock',
    'hilfe': 'mdi-help-circle'
  }
  return icons[activeTab.value] || 'mdi-medical-bag'
}

const handleLogout = () => {
  console.log('Abmelden')
  localStorage.removeItem('currentUser')
  currentUser.value = null
  router.push({ name: 'login' })
}

const getUserInitials = () => {
  if (!currentUser.value || !currentUser.value.username) return '?'
  return currentUser.value.username.charAt(0).toUpperCase()
}

const toggleQuickActions = () => {
  showQuickActionsMenu.value = !showQuickActionsMenu.value
}

const quickAction = (action) => {
  showQuickActionsMenu.value = false
  switch(action) {
    case 'device':
      addNewDevice()
      break
    case 'inspection':
      addNewInspection()
      break
    case 'customer':
      addNewCustomer()
      break
    case 'manufacturer':
      addNewManufacturer()
      break
    case 'deviceType':
      addNewDeviceType()
      break
    case 'inspectionType':
      addNewInspectionType()
      break
  }
}

const getInspectionStatusColor = (status) => {
  const colors = {
    'Fällig': 'warning',
    'Überfällig': 'error',
    'Bald fällig': 'info',
    'Geplant': 'primary',
    'Abgeschlossen': 'success'
  }
  return colors[status] || 'grey'
}

const showDueInspections = () => {
  activeTab.value = 'pruefungen'
}

const startInspection = (inspectionId) => {
  console.log('Starte Prüfung:', inspectionId)
}

const printReport = () => {
  console.log('Drucke Bericht')
}

const exportData = () => {
  console.log('Exportiere Daten')
}

const refreshData = () => {
  console.log('Aktualisiere Daten')
  fetchDashboardData()
}

const openUserProfile = () => {
  console.log('Öffne Benutzerprofil')
}

const openMPDGDocumentation = () => {
  console.log('Öffne MPDG-Dokumentation')
  activeTab.value = 'mpdg-konformitaet'
}

const addNewDevice = () => {
  console.log('Neues Gerät hinzufügen')
  activeTab.value = 'bestandsliste'
}

const addNewInspection = () => {
  console.log('Neue Prüfung hinzufügen')
  activeTab.value = 'pruefungen'
}

const addNewCustomer = () => {
  console.log('Neuen Kunden hinzufügen')
  activeTab.value = 'kundenliste'
}

const addNewManufacturer = () => {
  console.log('Neuen Hersteller hinzufügen')
  activeTab.value = 'hersteller'
}

const addNewDeviceType = () => {
  console.log('Neuen Gerätetyp hinzufügen')
  activeTab.value = 'geraetetyp'
}

const addNewInspectionType = () => {
  console.log('Neue Prüfart hinzufügen')
  activeTab.value = 'pruefarten'
}

const showActivityLog = () => {
  console.log('Zeige Aktivitätsprotokoll')
}

const openComplianceReport = () => {
  console.log('Öffne Konformitätsbericht')
  activeTab.value = 'mpdg-konformitaet'
}

const exportComplianceData = () => {
  console.log('Exportiere MPDG-Daten')
}

const openOrder = (orderId) => {
  console.log('Öffne Auftrag:', orderId)
  activeTab.value = 'auftragsliste'
}

// Neue Methoden für Aufträge
const createMaintenanceOrder = () => {
  console.log('Erstelle Wartungsauftrag')
  activeTab.value = 'neuer-auftrag'
}

const createRepairOrder = () => {
  console.log('Erstelle Reparaturauftrag')
  activeTab.value = 'neuer-auftrag'
}

const createCalibrationOrder = () => {
  console.log('Erstelle Kalibrierauftrag')
  activeTab.value = 'neuer-auftrag'
}

const createGeneralOrder = () => {
  console.log('Erstelle allgemeinen Auftrag')
  activeTab.value = 'neuer-auftrag'
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.body.classList.toggle('theme--dark', isDarkTheme.value)
}

const clearSearch = () => {
  searchQuery.value = ''
}

const showImportantNotes = computed(() => {
  return stats.value.overdueInspections > 0 || stats.value.dueInspections > 0
})
</script>

<style scoped>
/* Modern Statistic Cards with Footer Design */
.modern-stat-card-footer {
  border-radius: 12px !important;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  border: none !important;
}

.modern-stat-card-footer:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.modern-stat-card-footer .card-content {
  flex: 1;
}

.modern-stat-card-footer .card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.modern-stat-card-footer:hover .card-footer {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

/* Stat Icon Design */
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

.modern-stat-card-footer:hover .stat-icon-circle {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Text styling for better contrast */
.text-uppercase {
  letter-spacing: 0.5px;
  font-size: 0.7rem !important;
}

.text-h4 {
  font-size: 2.5rem !important;
  line-height: 1;
}

.text-caption {
  font-size: 0.75rem !important;
}

/* Animation for the chevron */
.modern-stat-card-footer:hover .card-footer .v-icon {
  transform: translateX(3px);
}

.modern-stat-card-footer .card-footer .v-icon {
  transition: transform 0.2s ease;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .modern-stat-card-footer {
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

/* Alternative Design avec Gradient */
.gradient-card {
  background: linear-gradient(135deg, var(--card-color-light) 0%, var(--card-color) 100%) !important;
}

/* Pour les cartes avec plus d'urgence (Fällige Prüfungen) */
.urgent-card .card-footer {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%) !important;
}

/* Pour les cartes avec succès (Medizinprodukte) */
.success-card .card-footer {
  background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%) !important;
}

/* Pour les cartes d'information (Kunden) */
.info-card .card-footer {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%) !important;
}

/* Pour les cartes spéciales (Prüfprotokolle) */
.special-card .card-footer {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%) !important;
}

/* Shadow effect on hover */
.modern-stat-card-footer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.modern-stat-card-footer:hover::after {
  opacity: 1;
}

/* Compact design for small screens */
@media (max-width: 600px) {
  .modern-stat-card-footer {
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

.modern-stat-card-footer {
  animation: fadeInUp 0.4s ease forwards;
  animation-delay: calc(var(--card-index, 0) * 0.1s);
  opacity: 0;
}

/* Style pour le sous-titre quand il y a des éléments urgents */
.subtitle-urgent {
  font-weight: 600 !important;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
  }
}

/* Amélioration de la lisibilité */
.card-content .text-uppercase {
  opacity: 0.9;
}

.card-footer .text-caption {
  letter-spacing: 0.3px;
}

/* Optimierte Stile für kompaktes Design */

/* App Bar Optimierung */
:deep(.v-toolbar) {
  min-height: 48px !important;
}

/* Suchfeld */
.search-field :deep(.v-field) {
  font-size: 0.875rem !important;
}

.search-field :deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

/* Navigation Drawer Optimierungen */
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

.v-navigation-drawer .v-list-group__items .v-list-group__items .v-list-item {
  padding-left: 48px !important;
}

.v-list-group__items {
  padding: 0 !important;
}

.v-list-group__header {
  padding: 0 !important;
}

/* Style pour les icônes des statistiques d'ordre */
.stat-icon-container {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 12px;
}

/* Style pour les cartes d'ordre modernes */
.modern-order-card {
  border-radius: 12px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white !important;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.modern-order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2) !important;
}

.modern-order-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* Gradient-Klassen für die Auftrags-Karten */
.primary-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.warning-gradient {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.info-gradient {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.success-gradient {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
}

/* Pfeil-Icon Styling */
.arrow-icon {
  transition: transform 0.2s ease;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 4px;
  margin-top: 8px;
}

/* AGGRANDISSEMENT DES BOUTONS D'ACTION DANS LE HEADER */
.header-action-btn {
  min-width: 100px !important;
  height: 36px !important;
  padding: 0 16px !important;
}

.header-action-btn .v-icon {
  margin-right: 6px;
}

@media (max-width: 600px) {
  .header-action-btn {
    min-width: 80px !important;
    padding: 0 12px !important;
  }
  
  .header-action-btn:last-child {
    min-width: 36px !important;
    padding: 0 8px !important;
  }
  
  .modern-order-card {
    min-height: 160px;
    margin-bottom: 16px;
  }
  
  .stat-icon-container {
    width: 48px;
    height: 48px;
  }
}

/* Schnellerfassung Menu */
:deep(.v-menu__content) {
  margin-top: 8px !important;
}

/* Responsive Optimierungen */
@media (max-width: 600px) {
  .v-toolbar-title {
    font-size: 1rem !important;
  }
  
  .v-navigation-drawer {
    width: 56px !important;
  }
  
  .v-navigation-drawer:not(.v-navigation-drawer--rail) {
    width: 280px !important;
  }
  
  .search-field {
    max-width: 120px !important;
  }
}

/* Modernisierte Auftragsübersicht */
.modern-card {
  border-radius: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.modern-order-card {
  border-radius: 10px !important;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  color: white !important;
}

.modern-order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
}

/* Status-Verteilung */
.status-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.status-item {
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

/* Progress-Bar Styling */
:deep(.v-progress-linear__determinate) {
  border-radius: 3px;
}

/* Quick Actions Grid */
.d-grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.gap-2 {
  gap: 8px;
}

.quick-action-btn {
  height: 40px !important;
  border-radius: 8px !important;
  font-weight: 500 !important;
}

/* Dringende Aufträge */
.urgent-order-item {
  border-left: 3px solid #f44336;
  background: #fff5f5;
  border-radius: 6px;
  margin-bottom: 4px;
}

.urgent-order-item:hover {
  background: #ffeaea;
}

/* Farbanpassung */
:deep(.v-app-bar) {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* Compact Table */
:deep(.v-table) {
  font-size: 0.75rem;
}

:deep(.v-table th) {
  font-size: 0.75rem;
  font-weight: 600;
  background: #f8f9fa;
}

/* Chip Optimierung */
:deep(.v-chip) {
  font-size: 0.75rem;
  height: 20px;
}

/* Button Optimierung */
:deep(.v-btn) {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Verbesserte Abstände */
.gap-1 {
  gap: 4px;
}

.gap-2 {
  gap: 8px;
}

/* Verbesserte Text-Truncation */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Progress Container */
.progress-container {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 10px;
}

/* Höhenanpassung für Karten */
.h-100 {
  height: 100%;
  min-height: 450px;
}

/* Tooltip Verbesserungen */
:deep(.v-tooltip__content) {
  font-size: 0.75rem !important;
  padding: 4px 8px !important;
}

/* Farbige Badges für Auftragsstatus */
.status-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-in-progress {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-overdue {
  background-color: #f8d7da;
  color: #721c24;
}

/* Scrollbar Optimierung */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Mobile Optimierungen */
@media (max-width: 960px) {
  .modern-order-card {
    margin-bottom: 16px;
  }
  
  .h-100 {
    min-height: auto;
    margin-bottom: 16px;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}

/* Design-Anpassungen für bessere Lesbarkeit */
.text-uppercase {
  letter-spacing: 0.5px;
}

.font-weight-medium {
  font-weight: 500;
}

/* Pfeil-Icon Styling */
.arrow-icon {
  transition: transform 0.2s ease;
}

.modern-order-card:hover .arrow-icon {
  transform: translateX(4px);
}

/* Pour les petits écrans */
@media (max-width: 600px) {
  .modern-order-card {
    min-height: 160px;
  }
  
  .stat-icon-container {
    width: 40px;
    height: 40px;
  }
}
</style>