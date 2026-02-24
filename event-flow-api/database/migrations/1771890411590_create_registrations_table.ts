import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'registrations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table
        .uuid('user_id')
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .uuid('event_id')
        .notNullable()
        .references('id')
        .inTable('events')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
    })

    this.schema.table(this.tableName, (table) => {
      table.index('user_id')
      table.index('event_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
