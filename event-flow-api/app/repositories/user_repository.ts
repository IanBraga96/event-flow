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
    return User.create({
      type: dto.type,
      name: dto.name,
      email: dto.email,
      passwordHash: dto.password,
      cpf: dto.cpf ?? null,
    })
  }

  async findById(id: string): Promise<User | null> {
    return User.find(id)
  }

  async update(user: User, data: { name?: string; email?: string }): Promise<User> {
    user.merge(data)
    await user.save()
    return user
  }

  async verifyCredentials(email: string, password: string): Promise<User> {
    return User.verifyCredentials(email, password)
  }

  async createToken(user: User): Promise<{ value: string }> {
    const token = await User.accessTokens.create(user)
    return { value: token.value!.release() }
  }
}
