import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import authRoutes from './routes/AuthRoute.js'
import subscriptionRoutes from "./routes/SubscriptionRoute.js";
import userRoute from "./routes/UserRoute.js"
import paymentRoute from "./routes/PaymentRoute.js";
import cors from 'cors';
import corsOptions from "./config/corsOptions.js";
import bcrypt from 'bcrypt';
import User from './models/User.js';

const app = express()
const PORT = process.env.PORT || 1234

// יצירת משתמש מנהל ראשי אם לא קיים
const createAdminUser = async () => {
  try {
    const adminEmail = 'T@A.C';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({
        fullName: 'מנהל מערכת',
        email: adminEmail,
        password: hashedPassword,
        isAdmin: true
      });
      console.log('✓ נוצר משתמש מנהל: T@A.C / 123456');
    } else {
      // עדכון isAdmin אם הוא לא מוגדר
      if (!existingAdmin.isAdmin) {
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('✓ עודכן משתמש קיים למנהל: T@A.C');
      }
    }
  } catch (error) {
    console.error('שגיאה ביצירת משתמש מנהל:', error);
  }
};

connectDB()

app.use(cors(corsOptions))
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoute)
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payment", paymentRoute);
// app.options('*', cors(corsOptions))
app.get('/', (req, res) => {
  res.send('app is running')
})

mongoose.connection.once('open', () => {
  console.log('connected to mongoDB')
  createAdminUser(); // יצירת משתמש מנהל
  app.listen(PORT, () => {
    console.log(`server run on ${PORT}`)
  })
})

mongoose.connection.on('error', err => {
  console.log(err)
})
