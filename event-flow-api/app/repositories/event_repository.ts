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

  async findAll(): Promise<Event[]> {
    return Event.query().preload('user')
  }

  async findById(id: string): Promise<Event | null> {
    return Event.find(id)
  }

  async findByUserId(userId: string): Promise<Event[]> {
    return Event.query().where('userId', userId)
  }

  async update(
    event: Event,
    data: {
      name?: string
      description?: string
      dateTime?: Date
      location?: string
      capacity?: number
    }
  ): Promise<Event> {
    const merged: Record<string, any> = {}
    if (data.name !== undefined) merged.name = data.name
    if (data.description !== undefined) merged.description = data.description
    if (data.dateTime !== undefined) merged.dateTime = DateTime.fromJSDate(data.dateTime)
    if (data.location !== undefined) merged.location = data.location
    if (data.capacity !== undefined) merged.capacity = data.capacity

    event.merge(merged)
    await event.save()
    return event
  }

  async delete(id: string): Promise<void> {
    const event = await Event.find(id)
    if (event) {
      await event.delete()
    }
  }
}
