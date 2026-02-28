import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import CreateEventUseCase from '#use_cases/event/create_event_use_case'
import { createEventValidator } from '#validators/event_validator'

@inject()
export default class EventsController {
  constructor(private createEventUseCase: CreateEventUseCase) {}

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(createEventValidator)
    const event = await this.createEventUseCase.execute({ userId, ...data })
    return response.created({ event })
  }
}
