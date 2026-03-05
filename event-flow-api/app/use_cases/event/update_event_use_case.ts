import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import Event from '#models/event'
import EventRepository from '#repositories/event_repository'
import type { UpdateEventDto } from '#dtos/event_dto'

@inject()
export default class UpdateEventUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(dto: UpdateEventDto): Promise<Event> {
    const event = await this.eventRepository.findById(dto.eventId)

    if (!event) {
      throw new Exception('Evento não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (event.userId !== dto.userId) {
      throw new Exception('Apenas o criador do evento pode editá-lo', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    return this.eventRepository.update(event, {
      name: dto.name,
      description: dto.description,
      dateTime: dto.dateTime,
      location: dto.location,
      capacity: dto.capacity,
    })
  }
}
