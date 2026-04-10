import { createApp } from 'vue'
import '../style.css'
import App from '../App.vue'
import { router } from './router'
import { useSessionStore } from '../stores/sessionStore'
import { pinia } from './pinia'

const app = createApp(App)
app.use(pinia)

const sessionStore = useSessionStore(pinia)
sessionStore.restoreSession()

app.use(router).mount('#app')
