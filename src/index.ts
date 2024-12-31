import express from 'express'
import * as path from 'node:path'
import { requestTime } from './middleware/middleware1.js'
import mongoose from 'mongoose'
import { router } from './routes/auth.route.js'

const __dirname = path.resolve()
const PORT = process.env.PORT || 3000

const BASE_URI = process.env.BASE_URI
if (!BASE_URI) {
  throw new Error('BASE_URI is not defined')
}

async function connectDB() {
  try {
    await mongoose.connect(BASE_URI!)
    // await mongoose.connect('mongodb://localhost:27017/test');
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

app.use('/api/auth', router)

app.get('/feature', (req, res) => {
  console.log('time', (req as any).requestTime)
  res.sendFile(path.resolve(__dirname, 'static/feature.html'))
})

app.listen(PORT, () => {
  console.log('Server started on port', PORT)
})
