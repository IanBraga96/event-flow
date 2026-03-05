import { inject } from '@adonisjs/core'
import Event from '#models/event'
import EventRepository from '#repositories/event_repository'

@inject()
export default class ListEventsUseCase {
  constructor(private eventRepository: EventRepository) {}

  async execute(): Promise<Event[]> {
    return this.eventRepository.findAll()
  }
}
