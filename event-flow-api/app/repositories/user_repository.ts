import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import type { RegisterUserDto } from '#dtos/auth_dto'

export default class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return User.findBy('email', email)
  }

  async findByCpf(cpf: string): Promise<User | null> {
    return User.findBy('cpf', cpf)
  }

  async create(dto: RegisterUserDto): Promise<User> {
    const passwordHash = await hash.make(dto.password)

    return User.create({
      type: dto.type,
      name: dto.name,
      email: dto.email,
      passwordHash,
      cpf: dto.cpf ?? null,
    })
  }
}
