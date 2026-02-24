import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import User from '#models/user'
import UserRepository from '#repositories/user_repository'
import type { UpdateOrganizerDto } from '#dtos/organizer_dto'

@inject()
export default class UpdateOrganizerUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: UpdateOrganizerDto): Promise<User> {
    const user = await this.userRepository.findById(dto.userId)

    if (!user) {
      throw new Exception('Usuário não encontrado', { status: 404, code: 'E_NOT_FOUND' })
    }

    if (user.type !== 'organizer') {
      throw new Exception('Acesso negado', { status: 403, code: 'E_FORBIDDEN' })
    }

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findByEmail(dto.email)
      if (existing) {
        throw new Exception('E-mail já está em uso', { status: 409, code: 'E_EMAIL_TAKEN' })
      }
    }

    return this.userRepository.update(user, { name: dto.name, email: dto.email })
  }
}
