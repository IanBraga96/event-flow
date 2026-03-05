import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255),
    description: vine.string().trim().maxLength(1000).optional(),
    dateTime: vine.date({ formats: ['iso8601'] }),
    location: vine.string().trim().minLength(2).maxLength(255),
    capacity: vine.number().positive().withoutDecimals(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    description: vine.string().trim().maxLength(1000).optional(),
    dateTime: vine.date({ formats: ['iso8601'] }).optional(),
    location: vine.string().trim().minLength(2).maxLength(255).optional(),
    capacity: vine.number().positive().withoutDecimals().optional(),
  })
)
