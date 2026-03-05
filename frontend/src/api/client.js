import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || ''

export const api = axios.create({
  baseURL: baseURL ? `${baseURL.replace(/\/$/, '')}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const departments = {
  list: (params) => api.get('/departments/', { params }),
  get: (id) => api.get(`/departments/${id}/`),
}

export const doctors = {
  list: (params) => api.get('/doctors/', { params }),
  get: (id) => api.get(`/doctors/${id}/`),
  create: (data) => api.post('/doctors/', data),
  update: (id, data) => api.patch(`/doctors/${id}/`, data),
  remove: (id) => api.delete(`/doctors/${id}/`),
}

export const patients = {
  list: (params) => api.get('/patients/', { params }),
  get: (id) => api.get(`/patients/${id}/`),
  create: (data) => api.post('/patients/', data),
  update: (id, data) => api.patch(`/patients/${id}/`, data),
  remove: (id) => api.delete(`/patients/${id}/`),
}

export const appointments = {
  list: (params) => api.get('/appointments/', { params }),
  get: (id) => api.get(`/appointments/${id}/`),
  create: (data) => api.post('/appointments/', data),
  update: (id, data) => api.patch(`/appointments/${id}/`, data),
  remove: (id) => api.delete(`/appointments/${id}/`),
}
