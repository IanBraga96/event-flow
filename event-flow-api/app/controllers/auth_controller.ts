import type { HttpContext } from '@adonisjs/core/http'
import RegisterUserUseCase from '#use_cases/auth/register_user_use_case'
import { registerUserValidator } from '#validators/auth_validator'
import { inject } from '@adonisjs/core'

@inject()
export default class AuthController {
  constructor(private registerUserUseCase: RegisterUserUseCase) {}
  async register({ request, response }: HttpContext) {
    const dto = await request.validateUsing(registerUserValidator)
    const { user, token } = await this.registerUserUseCase.execute(dto)
    return response.created({ user, token })
  }
}
