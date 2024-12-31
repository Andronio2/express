import bcrypt from 'bcrypt'
import { Request, Response, Router } from 'express'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const router = Router()

router.post(
  '/register',
  [
    check('email', 'Enter a valid email').isEmail(),
    check('password', 'Enter a valid password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    console.log('register', req.body)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: 'Invalid registration data',
        })
      }
      const { email, password } = req.body
      const cand = await User.findOne({ email })
      console.log('candidate', cand)
      if (cand) {
        res.status(400).json({ message: 'User already exists' })
        return
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ email, password: hashedPassword })
      await user.save()
      res.status(201).json({ message: 'User created' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
      console.error('/register', e)
    }
  },
)
router.post(
  '/login',
  [
    check('email', 'Enter a valid email').normalizeEmail().isEmail(),
    check('password', 'Enter a valid password').exists(),
  ],
  async (req: Request, res: Response) => {
    console.log('login', req.body)
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        res.status(400).json({
          errors: errors.array(),
          message: 'Invalid login data',
        })
        return
      }
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        res.status(400).json({ message: 'User not exists' })
        return
      }

      const isMatch = await bcrypt.compare(password, user.password as string)
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid password' })
        return
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      })
      res.json({ token, userId: user.id, message: 'User created' })
    } catch (e) {
      res.status(500).json({ message: 'Something went wrong' })
      console.error('/register', e)
    }
  },
)
