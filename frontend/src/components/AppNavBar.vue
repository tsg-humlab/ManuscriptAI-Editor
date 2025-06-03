<script setup>
import { useAuthStore } from '../stores/auth.js'
import {onMounted} from "vue";
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const route = useRoute()

onMounted(async()=>{
  await authStore.fetchUser()
})
async function logout(){
  try {
    await authStore.logout(router)
  } catch (error) {
    console.error(error)
  }
}

function goToLogin(){
  router.push({name:'login'})
}

const showLogin = computed(() => (!(route.name === 'login' || route.name === 'register')))


</script>

<template>
  <v-app-bar
    app
    color="#23263C"
    title="Manuscript AI"
    density="comfortable"
  >
    <template #prepend>
      <router-link to="/">
        <v-img
          width="50"
          height="50"
          src="@/assets/Logo_plain.svg"
          class="ml-3 my-1 pa-2"
          to="/"
        />
      </router-link>
    </template>
    <template #append>
      <div v-if = "authStore.isAuthenticated" >
        <v-menu open-on-hover location="bottom" offset="10">
           <template v-slot:activator="{ props }">
             <v-btn
               color="white"
               v-bind="props"
             >
               {{ authStore.user?.username || 'user authenticated' }}
             </v-btn>
           </template>
           <v-list>
             <v-list-item key="1" value="1">
               <v-list-item-title @click="logout">Logout</v-list-item-title>
             </v-list-item>
           </v-list>
        </v-menu>
      </div>
      <div v-else>
        <v-btn v-if="showLogin" @click="goToLogin">Login</v-btn>
      </div>



    </template>
  </v-app-bar>
</template>

<style scoped lang="sass">

</style>
