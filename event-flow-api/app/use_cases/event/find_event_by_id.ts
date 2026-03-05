import { inject } from '@adonisjs/core'
import EventRepository from '#repositories/event_repository'
import Event from '#models/event'

@inject()
export default class FindEventByIdUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string): Promise<Event | null> {
    return this.eventRepository.findById(id)
  }
}
