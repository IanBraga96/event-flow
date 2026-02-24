import User from '#models/user'
import { RegisterUserResponse } from '#dtos/auth_dto'

export default async function getAccessTokenAndId(user: User): Promise<RegisterUserResponse> {
  const fullToken = await User.accessTokens.create(user)
  const { token, type } = fullToken.toJSON()
  return { token: { token, type }, user: user }
}
