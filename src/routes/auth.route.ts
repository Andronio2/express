import { Router } from 'express'

export const router = Router()

router.post('/register', (req, res) => {
  try {
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
    console.error('/register', e)
  }
})
router.post('/login', (req, res) => {})
