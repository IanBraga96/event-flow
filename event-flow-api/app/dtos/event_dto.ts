export interface CreateEventDto {
  userId: string
  name: string
  description?: string
  dateTime: Date
  location: string
  capacity: number
}

export interface UpdateEventDto {
  eventId: string
  userId: string
  name?: string
  description?: string
  dateTime?: Date
  location?: string
  capacity?: number
}
