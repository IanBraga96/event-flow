import vine from '@vinejs/vine'

export const updateParticipantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(255).optional(),
    email: vine.string().email().normalizeEmail().maxLength(254).optional(),
  })
)
