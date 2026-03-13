import api from './api';

/**
 * GET /events
 * @returns {{ events: Array }}
 */
export async function listEvents() {
  const response = await api.get('/events');
  return response.data;
}

/**
 * POST /events (multipart/form-data)
 * @param {FormData} formData
 * @returns {{ event: object }}
 */
export async function createEvent(formData) {
  const response = await api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * GET /events/mine (autenticado)
 * @returns {{ events: Array }}
 */
export async function listMyEvents() {
  const response = await api.get('/events/mine');
  return response.data;
}

/**
 * PUT /events/:id (multipart/form-data)
 * @param {string} id
 * @param {FormData} formData
 * @returns {{ event: object }}
 */
export async function updateEvent(id, formData) {
  const response = await api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

/**
 * DELETE /events/:id
 * @param {string} id
 */
export async function deleteEvent(id) {
  await api.delete(`/events/${id}`);
}
