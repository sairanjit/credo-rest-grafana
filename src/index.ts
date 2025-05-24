import bodyParser from 'body-parser'
import express from 'express'

import { createRestAgent, setupApp } from '@credo-ts/rest'

const run = async () => {
  const agent = await createRestAgent({
    label: 'Credo Agent',
    inboundTransports: [
      {
        transport: 'http',
        port: 4001,
      },
    ],
    logLevel: 2, // LogLevel.debug,
    endpoints: ['http://localhost:4001'],
    walletConfig: {
      id: 'test-agent',
      key: 'test-agent',
    },
  })

  const app = express()
  const jsonParser = bodyParser.json()

  app.get('/greeting', jsonParser, (_, res) => {
    const config = agent.config

    res.send(`Hello, ${config.label}!`)
  })

  const { start } = await setupApp({
    baseApp: app,
    adminPort: 4000,
    enableCors: true,
    agent,
  })

  start()
}

run()