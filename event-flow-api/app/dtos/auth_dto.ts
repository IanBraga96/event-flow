import { UserTypes } from '../utils/enums.js'

export interface RegisterUserDto {
  type: UserTypes
  name: string
  email: string
  password: string
  cpf?: string
}

export interface RegisterUserResponse {
  token: {
    token?: string
    type: string
  }
  user: any
}
