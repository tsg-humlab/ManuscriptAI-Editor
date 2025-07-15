<template>
  <div class="register">
    <v-card variant="outlined" width="400">
      <v-card-title>Register</v-card-title>
      <v-card-text>
        <v-alert
           v-if="error || success"
           :type="error ? 'error' : 'success'"
           class="mb-4"
           density="compact"
           border="start"
           variant="tonal"
           :icon="error ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'"
         >
          <template v-slot:text>
           {{ error || success }}
            <router-link to="/login" v-if="success">Please login</router-link>
          </template>

         </v-alert>
        <v-form v-model="form" @submit.prevent="register" lazy-validation>
          <div>
            <v-text-field
              v-model="username"
              id="username"
              type="username"
              placeholder="johndoe@gmail.com"
              :readonly="loading"
              :rules="usernameRules"
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
              required
              clearable>
            </v-text-field>
          </div>
          <v-btn class="mt-2 primary-btn" color="mainBg" :loading="loading" :disabled="!form" type="submit" block>Register</v-btn>
        </v-form>

      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { getCSRFToken } from '../stores/auth'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: '',
      success: '',
      form: false,
      loading: false,
      usernameRules: [
        v => !!v || 'Username is required',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => !/^\s|\s$/.test(v) || 'No leading or trailing spaces',
      ]
    }
  },
  methods: {
    async register() {
      try {
        this.loading = true
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          }),
          credentials: 'include'
        })
        const data = await response.json()
        if (response.ok) {
          console.log("response ok!")
          this.error = ''
          this.success = `Registration successful!`

        } else {
          console.log("response not ok!")
          this.error = data.error || 'Registration failed'
          this.form = false
        }
        this.loading = false
      } catch (err) {
        console.log("error during registration:", err)
        this.error = 'An error occurred during registration: ' + err
        this.loading = false
        this.form = false
      }
    }
  }
}

</script>
