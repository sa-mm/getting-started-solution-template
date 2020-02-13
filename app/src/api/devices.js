import api from '@/api/apiService'

export class Device {
  constructor(data) {
    Object.assign(this, data)
  }

  reset() {
    const url = `/api/devices/${this.identity}`
    return api.del(url)
  }
}

export async function fetchDevices(app_id, search, limit, offset) {
  const result = { data: {}, error: null }
  const params = { app: app_id, searchid: search, limit: limit, offset: offset }
  const url = `/api/devices`
  const { error, data } = await api.get(url, params)

  if (error) {
    result.error = error
    return result
  }

  const devices = data && Array.isArray(data) ? data : []

  result.data.devices = devices.map(device => {
    device.online = device.online || device.lastseen / 1000 > Date.now() - 30000
    return new Device(device)
  })

  return result
}

export async function countDevices(app_id, search) {
  const result = { counter: 0, error: null }
  const params = { app: app_id, searchid: search }
  const url = `/api/countdevices`
  const { error, data } = await api.get(url, params)

  if (error) {
    result.error = error
    return result
  }

  result.counter = data

  return result
}

export const claimDevice = async device => {
  const url = `/api/claim`
  const result = { message: '', error: false }
  const { error, data } = await api.post(url, device)

  if (error || Object.keys(data).length === 0) {
    result.message = `Error: Couldn't claim device(s)`
    result.error = error || true
    return result
  }

  let errors = 0
  let successes = 0

  Object.keys(data).forEach(deviceId => {
    if (data[deviceId].error) {
      errors += 1
    } else {
      successes += 1
    }
  })

  if (errors) {
    result.error = true
    result.message = `Error: Couldn't claim ${errors} device(s)`
  }

  if (successes) {
    let space = ''
    if (errors) space = ', '
    result.message += `${space}${successes} device(s) claimed successfully`
  }

  return result
}

export const edit = async (devices, add_apps, remove_apps) => {
  const url = '/api/devices'
  const req = {
    devices,
    add_apps,
    remove_apps
  }
  return api.post(url, req)
}

export default {
  claimDevice,
  fetchDevices,
  countDevices,
  edit
}
