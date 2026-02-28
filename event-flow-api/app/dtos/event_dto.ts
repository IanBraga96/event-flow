export interface CreateEventDto {
  userId: string
  name: string
  description?: string
  dateTime: Date
  location: string
  capacity: number
}
