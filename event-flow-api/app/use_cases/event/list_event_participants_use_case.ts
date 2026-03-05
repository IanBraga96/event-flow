import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import EventRepository from '#repositories/event_repository'
import Registration from '#models/registration'

@inject()
export default class ListEventParticipantsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string) {
    const event = await this.eventRepository.findById(eventId)

    if (!event) {
      throw new Exception('Evento não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (event.userId !== userId) {
      throw new Exception('Apenas o criador do evento pode ver os participantes', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    const registrations = await Registration.query()
      .where('eventId', eventId)
      .preload('user')
      .orderBy('createdAt', 'asc')

    return registrations.map((registration) => ({
      id: registration.id,
      name: registration.user.name,
      email: registration.user.email,
      registeredAt: registration.createdAt,
    }))
  }
}
