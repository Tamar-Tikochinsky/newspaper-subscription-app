import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import connectDB from './config/db.js'
import corsOptions from './config/corsOptions.js'
import authRoutes from './routes/AuthRoute.js'
import subscriptionRoutes from "./routes/SubscriptionRoute.js";

const app = express()
const PORT = process.env.PORT || 1234

connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use("/api/subscriptions", subscriptionRoutes);

app.get('/', (req, res) => {
  res.send('app is running')
})

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB')
  app.listen(PORT, () => {
    console.log(`server run on ${PORT}`)
  })
})

mongoose.connection.on('error', err => {
  console.log(err)
})
