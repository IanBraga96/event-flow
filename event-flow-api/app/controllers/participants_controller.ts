import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import UpdateParticipantUseCase from '#use_cases/participant/update_participant_use_case'
import { updateParticipantValidator } from '#validators/participant_validator'

@inject()
export default class ParticipantsController {
  constructor(private updateParticipantUseCase: UpdateParticipantUseCase) {}

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id

    if (userId !== params.id) {
      throw new Exception('Acesso negado', { status: 403, code: 'E_FORBIDDEN' })
    }

    const data = await request.validateUsing(updateParticipantValidator)
    const user = await this.updateParticipantUseCase.execute({ userId, ...data })

    return response.ok({ user })
  }
}
