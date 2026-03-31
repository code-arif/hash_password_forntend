import { createApp } from 'vue'
import App from './App.vue'

// Bootstrap 5
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Axios global default
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'https://hash_password_api.test'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

createApp(App).mount('#app')