import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import Event from '#models/event'
import UserRepository from '#repositories/user_repository'
import EventRepository from '#repositories/event_repository'
import type { CreateEventDto } from '#dtos/event_dto'

@inject()
export default class CreateEventUseCase {
  constructor(
    private userRepository: UserRepository,
    private eventRepository: EventRepository
  ) {}

  async execute(dto: CreateEventDto): Promise<Event> {
    const user = await this.userRepository.findById(dto.userId)

    if (!user) {
      throw new Exception('Usuário não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (user.type !== 'organizer') {
      throw new Exception('Apenas organizadores podem criar eventos', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    return this.eventRepository.create(dto)
  }
}
