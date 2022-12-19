import { Kafka } from 'kafkajs'
import { randomUUID } from 'node:crypto'
import dotenv from 'dotenv'

dotenv.config()

async function boostrap() {
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [`${process.env.KAFKA_BROKER_1}`],
    sasl: {
      mechanism: 'scram-sha-256',
      username:
        `${process.env.KAFKA_USERNAME}`,
      password:
        `${process.env.KAFKA_PASSWORD}`,
    },
    ssl: true,
  })

  const producer = kafka.producer()

  await producer.connect()
  
  const uuid = randomUUID()
  console.log(uuid)

  await producer.send({
    topic: 'notifications.send-notification',
    messages: [
      {
        value: JSON.stringify({
          content: 'Nova solicitação de amizade!',
          category: 'social',
          recipientId: uuid,
        })
      }
    ],
  })

  await producer.disconnect()
}

boostrap()
