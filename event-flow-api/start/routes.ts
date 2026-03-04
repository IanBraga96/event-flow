/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const AuthController = () => import('#controllers/auth_controller')
const ParticipantsController = () => import('#controllers/participants_controller')
const OrganizersController = () => import('#controllers/organizers_controller')
const EventsController = () => import('#controllers/events_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router.post('/register', [AuthController, 'register'])
    router.post('/login', [AuthController, 'login'])
  })
  .prefix('/auth')

router
  .group(() => {
    router.put('/:id', [ParticipantsController, 'update'])
    router.get('/:id/events', [ParticipantsController, 'events'])
  })
  .prefix('/participants')
  .use(middleware.auth())

router
  .group(() => {
    router.put('/:id', [OrganizersController, 'update'])
  })
  .prefix('/organizers')
  .use(middleware.auth())

router.get('/events', [EventsController, 'index'])

router
  .group(() => {
    router.post('/', [EventsController, 'store'])
    router.put('/:id', [EventsController, 'update'])
    router.delete('/:id', [EventsController, 'destroy'])
    router.get('/:id/participants', [EventsController, 'participants'])
  })
  .prefix('/events')
  .use(middleware.auth())
