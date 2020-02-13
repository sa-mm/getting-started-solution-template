import api from '@/api/apiService'

export class Application {
  config = {}
  constructor(data) {
    Object.assign(this, data)
  }

  remove() {
    const url = `/api/apps/${this.id}`
    return api.del(url)
  }

  edit(editedProps) {
    const url = `/api/apps/${this.id}`
    return api.put(url, { ...this, ...editedProps })
  }
}

export async function addApp(appData) {
  const result = { data: { apps: [] }, error: false }
  const { error, data } = await api.post(`/api/apps`, appData)
  if (error) {
    result.error = error || `Error: Couldn't add app`
    return result
  }
  result.data = data
  return result
}

export async function connectApp(id, appData) {
  const result = { data: { apps: [] }, error: false }
  const { error, data } = await api.post(`/api/apps/${id}`, appData)
  if (error) {
    result.error = error || `Error: Couldn't connect app`
    return result
  }
  result.data = data
  return result
}

export async function fetchApps() {
  const url = '/api/apps'
  const result = { data: { apps: [] }, error: false }
  const { error, data } = await api.get(url)
  if (error) {
    result.error = error || `Error: Couldn't get apps`
    return result
  }
  let apps = {}
  Object.keys(data).map(id => {
    let app = data[id]
    app.id = id
    apps[id] = new Application(app)
  })
  result.data.apps = apps

  return result
}

export default {
  fetchApps,
  connectApp,
  addApp
}
