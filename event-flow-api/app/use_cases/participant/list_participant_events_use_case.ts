import Registration from '#models/registration'
import UserRepository from '#repositories/user_repository'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
export default class ListParticipantEventsUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(participantId: string, authenticatedUserId: string) {
    if (participantId !== authenticatedUserId) {
      throw new Exception('Acesso negado', { status: 403, code: 'E_FORBIDDEN' })
    }

    const user = await this.userRepository.findById(participantId)

    if (!user) {
      throw new Exception('Participante não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (user.type !== 'participant') {
      throw new Exception('Usuário não é um participante', { status: 403, code: 'E_FORBIDDEN' })
    }

    const registrations = await Registration.query()
      .where('userId', participantId)
      .preload('event')
      .orderBy('createdAt', 'desc')

    return registrations.map((registration) => ({
      registrationId: registration.id,
      registeredAt: registration.createdAt,
      event: {
        id: registration.event.id,
        name: registration.event.name,
        description: registration.event.description,
        dateTime: registration.event.dateTime,
        location: registration.event.location,
        capacity: registration.event.capacity,
      },
    }))
  }
}
