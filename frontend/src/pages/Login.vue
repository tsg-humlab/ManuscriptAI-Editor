<template>
  <div class="login">
    <v-card variant="outlined" width="400">
      <v-card-title>Login</v-card-title>
      <v-card-text>
         <v-alert
           v-if="error"
           type="error"
           class="mb-4"
           density="compact"
           border="start"
           variant="outlined"
           icon="mdi-alert-circle-outline"
         >
           {{ error }}
         </v-alert>
        <v-form v-model="form" @submit.prevent="login" lazy-validation>
        <div>
          <label for="username">Username: </label>
          <v-text-field
            v-model="username"
            id="username"
            type="username"
            placeholder="johndoe"
            :readonly="loading"
            :rules="usernameRules"
            @input="resetError"
            required
            clearable>
          </v-text-field>
        </div>
        <div>
          <label for="password">Password:</label>
          <v-text-field
            v-model="password"
            id="password"
            type="password"
            :readonly="loading"
            :rules="passwordRules"
            placeholder="Enter your password"
            @input="resetError"
            required
            clearable>
          </v-text-field>
        </div>
        <v-btn class="mt-2 primary-btn" :loading="authStore.isLoading" :disabled="!form || authStore.isLoading" type="submit" color="mainBg" block>Login</v-btn>
      </v-form>
      </v-card-text>
    </v-card>

    </div>
</template>
<script>
import { useAuthStore  } from '../stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  data() {
    return {
      username: "",
      password: "",
      error: "",
      loading: false,
      form: false,
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => !/^\s|\s$/.test(v) || 'No leading or trailing spaces',
      ],
    }
  },
  methods: {
    async login() {
      if (!this.form) return
      // this.loading = true
      const resp = await this.authStore.login(this.username, this.password, this.$router)
      console.log("resp:", resp)
      if (!this.authStore.isAuthenticated) {
        this.error = 'Invalid username or password. Please check your credentials.'
        this.form = false
      }
      // this.loading = false
    },
    resetError() {
      this.error = ""
    }
  }
}
</script>
