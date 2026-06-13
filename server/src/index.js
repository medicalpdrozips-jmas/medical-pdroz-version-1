import { createApp } from './app.js'
import { getEnvironmentWarnings } from './config/env.js'

console.log('Starting CRH Health Intelligence API...')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('USE_DATABASE:', process.env.USE_DATABASE)
console.log('PORT:', process.env.PORT)

const app = createApp()
const PORT = process.env.PORT || 8080

for (const warning of getEnvironmentWarnings()) {
  console.warn(`CRH config warning: ${warning}`)
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CRH Health Intelligence API running on port ${PORT}`)
})
