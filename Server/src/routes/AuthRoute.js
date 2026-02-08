import express from 'express'
import { login, register, getCurrentUser } from '../controllers/AuthController.js'
import verifyJWT from '../middlewares/verifyJWT.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('/me', verifyJWT, getCurrentUser)

export default router
