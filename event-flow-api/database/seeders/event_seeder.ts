import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Event from '#models/event'
import { DateTime } from 'luxon'

export default class EventSeeder extends BaseSeeder {
  async run() {
    // Cria um organizador para ser dono dos eventos
    const organizer = await User.firstOrCreate(
      { email: 'organizador@eventflow.com' },
      {
        type: 'organizer',
        name: 'EventFlow Org',
        email: 'organizador@eventflow.com',
        passwordHash: 'seed-only', // não será usado para login
      }
    )

    const events = [
      {
        userId: organizer.id,
        name: 'Summit de Inovação 2026',
        description: 'O maior evento de inovação e tecnologia do Brasil.',
        dateTime: DateTime.fromISO('2026-03-07T09:00:00'),
        location: 'São Paulo',
        capacity: 120,
        image: '/uploads/events/ev1.jpg',
      },
      {
        userId: organizer.id,
        name: 'Workshop de UX Design',
        description: 'Aprenda os fundamentos e práticas avançadas de UX.',
        dateTime: DateTime.fromISO('2026-03-22T14:00:00'),
        location: 'Remoto',
        capacity: 80,
        image: '/uploads/events/ev2.jpg',
      },
      {
        userId: organizer.id,
        name: 'Hackathon Dev Connect',
        description: 'Desafio de 48h para desenvolvedores criativos.',
        dateTime: DateTime.fromISO('2026-04-30T08:00:00'),
        location: 'Belo Horizonte',
        capacity: 70,
        image: '/uploads/events/ev3.jpg',
      },
      {
        userId: organizer.id,
        name: 'Conferência de IA 2026',
        description: 'Tendências e avanços em inteligência artificial.',
        dateTime: DateTime.fromISO('2026-02-10T10:00:00'),
        location: 'São Paulo',
        capacity: 200,
        image: '/uploads/events/ev4.jpg',
      },
      {
        userId: organizer.id,
        name: 'Meetup de Startups',
        description: 'Networking e pitch de startups emergentes.',
        dateTime: DateTime.fromISO('2026-04-05T18:00:00'),
        location: 'Rio de Janeiro',
        capacity: 150,
        image: '/uploads/events/ev5.jpg',
      },
      {
        userId: organizer.id,
        name: 'Festival de Engenharia',
        description: 'Palestras e oficinas sobre engenharia de software.',
        dateTime: DateTime.fromISO('2026-02-20T09:00:00'),
        location: 'Curitiba',
        capacity: 180,
        image: '/uploads/events/ev6.jpg',
      },
      {
        userId: organizer.id,
        name: 'Workshop de Liderança',
        description: 'Desenvolva habilidades de liderança e gestão.',
        dateTime: DateTime.fromISO('2026-04-18T14:00:00'),
        location: 'Remoto',
        capacity: 60,
        image: '/uploads/events/ev7.jpg',
      },
      {
        userId: organizer.id,
        name: 'Bootcamp de Python',
        description: 'Imersão completa em Python para todos os níveis.',
        dateTime: DateTime.fromISO('2026-04-25T09:00:00'),
        location: 'Remoto',
        capacity: 100,
        image: '/uploads/events/ev8.jpg',
      },
      {
        userId: organizer.id,
        name: 'Encontro de Product Managers',
        description: 'Troca de experiências entre PMs do Brasil.',
        dateTime: DateTime.fromISO('2026-02-01T10:00:00'),
        location: 'São Paulo',
        capacity: 90,
        image: '/uploads/events/ev9.jpg',
      },
      {
        userId: organizer.id,
        name: 'Semana de Acessibilidade Digital',
        description: 'Inclusão digital e acessibilidade na prática.',
        dateTime: DateTime.fromISO('2026-05-10T09:00:00'),
        location: 'Remoto',
        capacity: 240,
        image: '/uploads/events/ev10.jpg',
      },
      {
        userId: organizer.id,
        name: 'Maratona de Data Science',
        description: 'Competição e workshops de ciência de dados.',
        dateTime: DateTime.fromISO('2026-05-10T08:00:00'),
        location: 'Porto Alegre',
        capacity: 180,
        image: '/uploads/events/ev11.jpg',
      },
      {
        userId: organizer.id,
        name: 'Fórum de Cibersegurança',
        description: 'Debates sobre segurança da informação e privacidade.',
        dateTime: DateTime.fromISO('2026-05-30T10:00:00'),
        location: 'Brasília',
        capacity: 250,
        image: '/uploads/events/ev12.jpg',
      },
    ]

    for (const data of events) {
      await Event.updateOrCreate({ name: data.name }, data)
    }
  }
}
