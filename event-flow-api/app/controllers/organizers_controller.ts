import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import UpdateOrganizerUseCase from '#use_cases/organizer/update_organizer_use_case'
import { updateOrganizerValidator } from '#validators/organizer_validator'

@inject()
export default class OrganizersController {
  constructor(private updateOrganizerUseCase: UpdateOrganizerUseCase) {}

  async update({ auth, params, request, response }: HttpContext) {
    const userId = auth.user!.id

    if (userId !== params.id) {
      throw new Exception('Acesso negado', { status: 403, code: 'E_FORBIDDEN' })
    }

    const data = await request.validateUsing(updateOrganizerValidator)
    const user = await this.updateOrganizerUseCase.execute({ userId, ...data })

    return response.ok({ user })
  }
}
