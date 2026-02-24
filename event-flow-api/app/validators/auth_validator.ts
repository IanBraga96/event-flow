import vine from '@vinejs/vine'
import { UserTypes } from '../utils/enums.js'

export const registerUserValidator = vine.compile(
  vine.object({
    type: vine.enum(Object.values(UserTypes)),
    name: vine.string().trim().minLength(2).maxLength(255),
    email: vine.string().email().normalizeEmail().maxLength(254),
    password: vine.string().minLength(8).maxLength(255),
    cpf: vine.string().fixedLength(11).optional(),
  })
)
