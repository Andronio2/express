import express from 'express'
import mongoose from 'mongoose'
import * as path from 'node:path'
import { requestTime } from './middleware/middleware1.js'
import { router as authRoute } from './routes/auth.route.js'
import { router as linkRoute } from './routes/link.route.js'
import { router as redirectRoute } from './routes/redirect.route.js'

const __dirname = path.resolve()
const PORT = process.env.PORT || 3000

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI!)
    console.log('MongoDB connected')
  } catch (error) {
    console.log('MongoDB connection error', error)
    process.exit(1)
  }
}
connectDB()

const app = express()
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.json())
app.use(requestTime)

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'static/index.html'))
})

app.use('/api/auth', authRoute)
app.use('/api/link', linkRoute)
app.use('/t', redirectRoute)

app.get('/feature', (req, res) => {
  console.log('time', (req as any).requestTime)
  res.sendFile(path.resolve(__dirname, 'static/feature.html'))
})

app.listen(PORT, () => {
  console.log('Server started on port', PORT)
})
