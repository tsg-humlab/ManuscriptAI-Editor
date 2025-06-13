/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VFileUpload, VFileUploadItem } from 'vuetify/labs/VFileUpload'
import { md3 } from 'vuetify/blueprints'



// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes:{
      light:{
        dark:false,
        colors:{
          primary: '#6750A4',
          secondary: '#546E7A',
          teal:'#009688',
          success: '#006a5c',
          error: '#a94442',
          info: '#1A3C87',
          mainBg: '#23263C'
        }
      }
    }
  },
  blueprint: md3,
  components:{
    VFileUpload, VFileUploadItem
  }
})
