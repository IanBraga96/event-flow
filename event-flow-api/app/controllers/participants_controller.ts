import ListParticipantEventsUseCase from '#use_cases/participant/list_participant_events_use_case'
import UpdateParticipantUseCase from '#use_cases/participant/update_participant_use_case'
import { updateParticipantValidator } from '#validators/participant_validator'
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ParticipantsController {
  constructor(
    private updateParticipantUseCase: UpdateParticipantUseCase,
    private listParticipantEventsUseCase: ListParticipantEventsUseCase
  ) {}

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id

    if (userId !== params.id) {
      throw new Exception('Acesso negado', { status: 403, code: 'E_FORBIDDEN' })
    }

    const data = await request.validateUsing(updateParticipantValidator)
    const user = await this.updateParticipantUseCase.execute({ userId, ...data })

    return response.ok({ user })
  }

  async events({ auth, params, response }: HttpContext) {
    const userId = auth.user!.id
    const events = await this.listParticipantEventsUseCase.execute(params.id, userId)
    return response.ok({ events })
  }
}
