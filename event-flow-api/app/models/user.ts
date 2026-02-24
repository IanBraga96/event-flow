import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Event from '#models/event'
import Registration from '#models/registration'
import UuidBase from './base/uuid_base.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password_hash',
})

export default class User extends compose(UuidBase, AuthFinder) {
  @column()
  declare type: 'participant' | 'organizer'

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare passwordHash: string

  @column()
  declare name: string

  @column()
  declare cpf: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Event)
  declare events: HasMany<typeof Event>

  @hasMany(() => Registration)
  declare registrations: HasMany<typeof Registration>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}
