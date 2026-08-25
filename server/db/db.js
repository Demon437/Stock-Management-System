import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'node:dns'

dotenv.config()

const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(',').map(server => server.trim()).filter(Boolean)
if (dnsServers?.length) dns.setServers(dnsServers)

const connectToDatabase = async () => {

  try {

    await mongoose.connect(process.env.MONGODB_URL)

    console.log('Database Connected')

  } catch (error) {

    console.log(error)
  }
}

export default connectToDatabase