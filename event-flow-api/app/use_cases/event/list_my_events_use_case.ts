import { inject } from '@adonisjs/core'
import Event from '#models/event'
import EventRepository from '#repositories/event_repository'

@inject()
export default class ListMyEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(userId: string): Promise<Event[]> {
    return this.eventRepository.findByUserId(userId)
  }
}
