<template>
  <v-container class="login-container fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col
        class="text-center login-container__top"
        cols="10"
        sm="6"
        md="4"
        lg="4"
        xl="3"
      >
        <DynamicImage
          :image-sources="['vendor/brandlogo-dark.png', 'vendor/brandlogo.png']"
          image-class="login-logo mt-2 mb-6"
          image-alt="brandlogo"
        />
        <div
          v-if="needsAuth"
          class="text-center whitevar--text mb-6"
          style="font-size: 17px"
        >
          {{ needsAuth }}
        </div>
        <v-tabs
          v-if="display === 'default'"
          v-model="activeTab"
          slider-color="accent"
          style="overflow-x: hidden"
          fixed-tabs
          background-color="secondary"
          class="auth-tabs"
        >
          <v-tab
            key="login-tab"
            ripple
            data-qa="LoginTabButton"
            class="whitevar--text"
            background-color="secondary"
            >Login</v-tab
          >
          <v-tab
            key="signup-tabs"
            class="whitevar--text"
            ripple
            data-qa="SignupTabButton"
            background-color="secondary"
            >Signup</v-tab
          >
          <v-tab-item
            key="login"
            class="width-limit py-6 login-tab"
            style="height: 288px"
          >
            <v-form
              ref="loginForm"
              v-model="loginData.valid"
              data-qa="LoginForm"
              background-color="secondary"
              @submit.prevent="login"
            >
              <v-text-field
                v-model="loginData.email"
                :rules="emailRules"
                :dark="branding.themeType === 'dark'"
                required
                label="Email"
                validate-on-blur
              />
              <v-text-field
                v-model="loginData.password"
                :rules="passwordRules"
                :dark="branding.themeType === 'dark'"
                required
                type="password"
                label="Password"
                validate-on-blur
              />
              <div class="text-center mt-2">
                <v-btn
                  :loading="loginData.loading"
                  type="submit"
                  color="primary"
                  >Login</v-btn
                >
              </div>
            </v-form>
          </v-tab-item>

          <v-tab-item
            key="signup"
            class="width-limit py-6 login-tab"
            style="height: 288px"
          >
            <v-form
              ref="signupForm"
              v-model="signupData.valid"
              data-qa="SignupForm"
              @submit.prevent="signup"
            >
              <v-text-field
                v-model="signupData.email"
                :rules="emailRules"
                :dark="branding.themeType === 'dark'"
                label="Email"
                required
                validate-on-blur
              />
              <div class="text-center mt-2">
                <v-btn
                  :loading="signupData.loading"
                  type="submit"
                  color="primary"
                  class="text-none"
                  >Create Account</v-btn
                >
              </div>
              <p class="whitevar--text mt-6" style="font-size: 12px">
                By creating an account, you are agreeing to our
                <a :href="branding.links.terms">Terms of Service </a>.
              </p>
            </v-form>
          </v-tab-item>
        </v-tabs>

        <v-row
          v-if="display === 'emailVerification'"
          class="whitevar--text"
          style="height: 288px"
          justify="center"
          align="center"
        >
          <h3 class="my-4" :style="{ fontSize: '28px' }">
            Account created successfully!
          </h3>
          <p class="subtitle-1">
            Please go to your to your email
            <span class="font-weight-bold">{{ signupData.email }}</span> to
            verify and finish your registration.
          </p>
          <v-btn
            text
            class="mt-4 text-none mx-auto"
            color="primary"
            @click="backToLogin"
            >Back to Login</v-btn
          >
        </v-row>
        <v-row
          v-else-if="display === 'accountActivation'"
          class="whitevar--text"
          style="height: 288px; margin-top: -20px"
          justify="start"
          align="center"
        >
          <v-form
            ref="activateAccountForm"
            v-model="activateAccountData.valid"
            data-qa="ActivateAccountForm"
            @submit.prevent="activateAccount"
          >
            <h3 class="my-4" :style="{ fontSize: '28px' }">
              Create a password
            </h3>
            <p class="subtitle-1">
              Please set a password for you account to finish registration
            </p>
            <v-text-field
              v-model="activateAccountData.password"
              :rules="passwordRules"
              :dark="branding.themeType === 'dark'"
              class="mt-4 mx-auto"
              type="password"
              label="Password"
              style="max-width: 300px"
              required
              validate-on-blur
            />
            <v-text-field
              v-model="activateAccountData.passwordConfirm"
              :rules="confirmPasswordRules"
              :dark="branding.themeType === 'dark'"
              class="mb-4 mx-auto"
              type="password"
              label="Confirm password"
              style="max-width: 300px"
              required
              validate-on-blur
            />
            <v-btn
              :loading="activateAccountData.loading"
              type="submit"
              class="mt-4"
              color="primary"
              >Submit</v-btn
            >
          </v-form>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth from '@/api/auth'
import DynamicImage from '@/components/shared/DynamicImage'

const authDescription = {
  apptoken: `To complete linking your application with this product, please
                create an account or login with an existing account.`,
  claim: `Please create an account or login to an existing account to
                  claim your device(s)`,
  redirect: 'Please log in first to access this pages.'
}

export default {
  components: {
    DynamicImage
  },
  props: {
    branding: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      display: 'default',
      activeTab: 0,
      needsAuth: '',
      loginData: {
        email: '',
        password: '',
        valid: false,
        loading: false
      },
      signupData: {
        email: '',
        valid: false,
        loading: false
      },
      activateAccountData: {
        code: '',
        password: '',
        confirmPassword: '',
        valid: false,
        loading: false
      },
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length > 7 || 'Password too short'
      ],
      confirmPasswordRules: [
        v => !!v || 'Password is required',
        v => v.length > 7 || 'Password too short',
        v => this.activateAccountData.password === v || 'Passwords must match'
      ]
    }
  },
  mounted() {
    this.checkQueries()
  },
  methods: {
    checkQueries() {
      const queries = this.$route.query
      if (queries.activate) {
        this.activateAccountData.code = queries.activate
        this.display = 'accountActivation'
      } else if (queries.claim) {
        this.needsAuth = authDescription.claim
      } else if (queries.redirect) {
        this.needsAuth = authDescription.redirect
      }
    },
    backToLogin() {
      this.activeTab = 'login'
      this.display = 'default'
    },
    login() {
      const payload = {
        email: this.loginData.email,
        password: this.loginData.password
      }
      const callback = () => {
        if (this.$route.query.redirect) {
          this.$router.replace(this.$route.query.redirect)
        } else {
          this.$router.replace({
            name: 'DevicesPage',
            query: this.$route.query
          })
        }
      }
      this.authenticate('login', payload, callback)
    },
    signup() {
      const payload = {
        email: this.signupData.email
      }
      const callback = () => {
        this.display = 'emailVerification'
      }
      this.authenticate('signup', payload, callback)
    },
    activateAccount() {
      const payload = {
        code: this.activateAccountData.code,
        password: this.activateAccountData.password
      }
      const callback = () => {
        this.$router.replace({ name: 'DevicesPage' })
      }
      this.authenticate('activateAccount', payload, callback)
    },
    async authenticate(type, payload, callback) {
      if (!this.$refs[`${type}Form`].validate()) return
      const stateData = this[`${type}Data`]

      stateData.loading = true
      const result = await auth[type](payload)
      stateData.loading = false

      if (result.error) return this.$emit('openSnackbar', 'error', result.error)
      callback()
    }
  }
}
</script>

<style lang="scss">
.login-logo {
  width: 80%;
  max-width: 380px;
  @media only screen and (max-width: 600px) {
    width: 90%;
  }
}

.login-container {
  background-color: var(--v-secondary-base);
  height: 100%;
}

.login-tabs {
  height: 300px;
}

.auth-tabs > div {
  background-color: var(--v-secondary-base) !important;
}

.width-limit {
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.signup-email {
  color: var(--v-primary-base) !important;
}
// fixes autofill bg color of input
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  box-shadow: 0 0 0 30px var(--v-secondary-base) inset !important;
}

input:-webkit-autofill {
  -webkit-text-fill-color: var(--v-whitevar-base) !important;
}
</style>
