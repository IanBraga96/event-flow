import api from './api';

/**
 * GET /events
 * @returns {{ events: Array }}
 */
export async function listEvents() {
  const response = await api.get('/events');
  return response.data;
}
