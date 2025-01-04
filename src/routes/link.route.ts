import { Request, Response, Router } from 'express'
import { nanoid } from 'nanoid'
import { authMiddleware } from '../middleware/auth.middleware.js'
import Link from '../models/Link.js'

export const router = Router()

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL
    const { from } = req.body
    const id = nanoid()
    const existing = await Link.findOne({ from })
    if (existing) {
      res.json({ link: existing })
      return
    }
    const to = `${baseUrl}/t/${id}`
    const link = new Link({ id, to, from, owner: req.user.id })
    await link.save()
    res.status(201).json({ link })
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
    console.error('/generate', e)
  }
})

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const links = await Link.find({ owner: req.user.id })
    res.json(links)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
    console.error('get /', e)
  }
})

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id)
  } catch (e) {
    res.status(500).json({ message: 'Something went wrong' })
    console.error('get id = ', req.params.id, e)
  }
})
