import { DateTime } from 'luxon'
import Event from '#models/event'
import type { CreateEventDto } from '#dtos/event_dto'

export default class EventRepository {
  async create(dto: CreateEventDto): Promise<Event> {
    return Event.create({
      userId: dto.userId,
      name: dto.name,
      description: dto.description ?? null,
      dateTime: DateTime.fromJSDate(dto.dateTime),
      location: dto.location,
      capacity: dto.capacity,
    })
  }
}
