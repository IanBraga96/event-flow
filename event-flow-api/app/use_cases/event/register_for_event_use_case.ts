import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import EventRepository from '#repositories/event_repository'
import UserRepository from '#repositories/user_repository'
import Registration from '#models/registration'

@inject()
export default class RegisterForEventUseCase {
  constructor(
    private userRepository: UserRepository,
    private eventRepository: EventRepository
  ) {}

  async execute(eventId: string, userId: string): Promise<Registration> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new Exception('Usuário não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (user.type !== 'participant') {
      throw new Exception('Apenas participantes podem se inscrever em eventos', {
        status: 403,
        code: 'E_FORBIDDEN',
      })
    }

    const event = await this.eventRepository.findById(eventId)
    if (!event) {
      throw new Exception('Evento não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    const existing = await Registration.query()
      .where('userId', userId)
      .where('eventId', eventId)
      .first()
    if (existing) {
      throw new Exception('Participante já está inscrito neste evento', {
        status: 409,
        code: 'E_ALREADY_REGISTERED',
      })
    }

    const registrationsCount = await Registration.query()
      .where('eventId', eventId)
      .count('* as total')
    const total = Number(registrationsCount[0].$extras.total)
    if (total >= event.capacity) {
      throw new Exception('Evento lotado', { status: 409, code: 'E_EVENT_FULL' })
    }

    const conflict = await Registration.query()
      .where('userId', userId)
      .whereHas('event', (eventQuery) => {
        eventQuery.where('dateTime', event.dateTime.toJSDate()).whereNot('id', eventId)
      })
      .first()

    if (conflict) {
      throw new Exception('Participante já possui inscrição em outro evento no mesmo horário', {
        status: 409,
        code: 'E_SCHEDULE_CONFLICT',
      })
    }

    return Registration.create({ userId, eventId })
  }
}
