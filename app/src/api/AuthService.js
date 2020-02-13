import EventEmitter from 'eventemitter3'
import axios from '@/api/axios'
import api from '@/api/apiService'

export default class AuthService {
  authenticated = this.isAuthenticated()
  authNotifier = new EventEmitter()

  constructor() {
    this.login = this.login.bind(this)
    this.setSession = this.setSession.bind(this)
    this.logout = this.logout.bind(this)
    this.signup = this.signup.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.authNotifier.emit('authChange', {
      authenticated: this.isAuthenticated()
    })
  }

  async login(credentials) {
    let { error, data } = await api.post('/api/users/login', credentials)

    if (!error && !data && data.split('.')[1]) {
      error = `Couldn't login`
    }

    if (!error) {
      this.setSession(data)
      this.setProfile()
    }

    return { data, error }
  }

  signup(email) {
    return api.post('/api/users/create', email)
  }

  async activateAccount(credentials) {
    const { data, error } = await api.post('/api/users/activate', credentials)

    if (!error) {
      this.setSession(data)
      this.setProfile()
    }

    return { data, error }
  }

  async setProfile() {
    const { error, data } = await api.get('/api/users/currentUser')
    if (error) return
    localStorage.setItem('profile', JSON.stringify(data))
  }

  setSession(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token
      localStorage.setItem('token', token)
      this.authNotifier.emit('authChange', { authenticated: true })
    }
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('profile')
    this.userProfile = null

    if (this.authNotifier) {
      this.authNotifier.emit('authChange', false)
    }
  }

  isAuthenticated() {
    const token = localStorage.getItem('token')
    if (token) {
      // check token format
      if (!token.split('.')[1]) {
        this.logout()
        return false
      }

      // check if JWT expired
      const expiryTime = JSON.parse(atob(token.split('.')[1])).exp
      const hasExpired = new Date() - expiryTime * 1000 > 0
      if (hasExpired) {
        // eslint-disable-next-line no-console
        this.logout()
        return false
      }

      axios.defaults.headers.common['Authorization'] = token
    }

    return !!token
  }

  token() {
    return localStorage.getItem('token')
  }

  profile() {
    const profile = localStorage.getItem('profile')
    try {
      return JSON.parse(profile)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      return {}
    }
  }
}
