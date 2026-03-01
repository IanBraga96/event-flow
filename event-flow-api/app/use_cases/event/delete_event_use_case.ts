import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import EventRepository from '#repositories/event_repository'

@inject()
export default class DeleteEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(eventId: string, userId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId)

    if (!event) {
      throw new Exception('Evento não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (event.userId !== userId) {
      throw new Exception('Apenas o criador do evento pode deletá-lo', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    const registrationsCount = await event.related('registrations').query().count('* as total')
    const total = Number(registrationsCount[0].$extras.total)

    if (total > 0) {
      throw new Exception('Não é possível deletar um evento com inscritos', {
        status: 409,
        code: 'E_HAS_REGISTRATIONS',
      })
    }

    await event.delete()
  }
}
