import { createApp } from './app.js'
import { env, getEnvironmentWarnings } from './config/env.js'

const app = createApp()

for (const warning of getEnvironmentWarnings()) {
  console.warn(`CRH config warning: ${warning}`)
}

app.listen(env.PORT, () => {
  console.log(`CRH Health Intelligence API listening on http://localhost:${env.PORT}`)
})
