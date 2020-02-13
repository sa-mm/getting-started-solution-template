import axios from '@/api/axios'
import auth from '@/api/auth'
import router from '@/router'

function forceLogout(currentPath) {
  auth.logout()
  router.replace({ name: 'LoginPage', query: { redirect: currentPath } })
}

async function apiWrapper(apiCall, requiresData = false) {
  const result = { error: false, data: null }
  try {
    const { data } = await apiCall()
    if (data && data.error) {
      throw new Error(data.error.response)
    }
    if (requiresData && (!data && data !== 0)) {
      throw new Error('No data received')
    }
    result.data = data
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    const unauthorized = err.response.status === 401
    const requiresAuth = router.history.current.meta.requiresAuth
    if (unauthorized && requiresAuth) {
      forceLogout(router.history.current.path)
    }

    result.status = err.response.status
    result.error = err
  }

  return result
}

function get(endpoint, params = {}) {
  const apiCall = () => axios.get(endpoint, { params })
  return apiWrapper(apiCall, true)
}

function del(endpoint) {
  const apiCall = () => axios.delete(endpoint)
  return apiWrapper(apiCall)
}

function post(endpoint, payload) {
  const apiCall = () => axios.post(endpoint, payload)
  return apiWrapper(apiCall)
}

function put(endpoint, payload) {
  const apiCall = () => axios.put(endpoint, payload)
  return apiWrapper(apiCall)
}

export default {
  del,
  get,
  post,
  put
}
