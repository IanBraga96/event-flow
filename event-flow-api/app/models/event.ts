import { DateTime } from 'luxon'
import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Registration from '#models/registration'
import UuidBase from './base/uuid_base.js'

export default class Event extends UuidBase {
  @column()
  declare userId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column.dateTime()
  declare dateTime: DateTime

  @column()
  declare location: string

  @column()
  declare capacity: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Registration)
  declare registrations: HasMany<typeof Registration>
}
