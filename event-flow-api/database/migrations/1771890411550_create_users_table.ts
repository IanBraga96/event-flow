import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.enum('type', ['participant', 'organizer']).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password_hash').notNullable()
      table.string('name').notNullable()
      table.string('cpf', 11).nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })

    this.schema.table(this.tableName, (table) => {
      table.index('cpf')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
