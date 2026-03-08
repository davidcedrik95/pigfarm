import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#4CAF50', // Vert agricole
          secondary: '#FF9800', // Orange pour la reproduction
          accent: '#795548', // Marron porcin
          error: '#F44336',
          warning: '#FFC107',
          info: '#2196F3',
          success: '#4CAF50',
          background: '#F5F5F5'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#66BB6A',
          secondary: '#FFB74D',
          accent: '#8D6E63',
          error: '#EF5350',
          warning: '#FFEE58',
          info: '#42A5F5',
          success: '#66BB6A'
        }
      }
    }
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
      elevation: 1
    },
    VCard: {
      rounded: 'lg',
      elevation: 2
    },
    VTextField: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VSelect: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VTextarea: {
      variant: 'outlined',
      density: 'comfortable'
    },
    VAlert: {
      variant: 'tonal'
    }
  }
})