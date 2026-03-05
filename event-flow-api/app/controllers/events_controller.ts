import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import CreateEventUseCase from '#use_cases/event/create_event_use_case'
import UpdateEventUseCase from '#use_cases/event/update_event_use_case'
import DeleteEventUseCase from '#use_cases/event/delete_event_use_case'
import ListEventsUseCase from '#use_cases/event/list_events_use_case'
import ListEventParticipantsUseCase from '#use_cases/event/list_event_participants_use_case'
import { createEventValidator, updateEventValidator } from '#validators/event_validator'

@inject()
export default class EventsController {
  constructor(
    private createEventUseCase: CreateEventUseCase,
    private updateEventUseCase: UpdateEventUseCase,
    private deleteEventUseCase: DeleteEventUseCase,
    private listEventsUseCase: ListEventsUseCase,
    private listEventParticipantsUseCase: ListEventParticipantsUseCase
  ) {}

  async index({ response }: HttpContext) {
    const events = await this.listEventsUseCase.execute()
    return response.ok({ events })
  }

  async store({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const data = await request.validateUsing(createEventValidator)
    const event = await this.createEventUseCase.execute({ userId, ...data })
    return response.created({ event })
  }

  async update({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const eventId = request.param('id')
    const data = await request.validateUsing(updateEventValidator)
    const event = await this.updateEventUseCase.execute({ userId, eventId, ...data })
    return response.ok({ event })
  }

  async destroy({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const eventId = request.param('id')
    await this.deleteEventUseCase.execute(eventId, userId)
    return response.noContent()
  }

  async participants({ auth, request, response }: HttpContext) {
    const userId = auth.user!.id
    const eventId = request.param('id')
    const participants = await this.listEventParticipantsUseCase.execute(eventId, userId)
    return response.ok({ participants })
  }
}
