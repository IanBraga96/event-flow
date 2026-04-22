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
 * GET /events — busca um evento pelo id
 * @param {string} id
 * @returns {{ event: object }}
 */
export async function getEvent(id) {
  const response = await api.get('/events');
  const event = response.data.events.find(ev => String(ev.id) === String(id));
  if (!event) throw new Error('Evento não encontrado');
  return { event };
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

/**
 * GET /participants/:id/events (authenticated)
 * @param {string} userId
 * @returns {{ events: Array }}
 */
export async function listMyRegistrations(userId) {
  const response = await api.get(`/participants/${userId}/events`);
  return response.data;
}

/**
 * DELETE /registrations/:id (authenticated)
 * @param {string} id
 */
export async function cancelRegistration(id) {
  await api.delete(`/registrations/${id}`);
}

/**
 * POST /events/:id/register (authenticated)
 * @param {string} eventId
 * @returns {{ registration: object }}
 */
export async function registerForEvent(eventId) {
  const response = await api.post(`/events/${eventId}/register`);
  return response.data;
}