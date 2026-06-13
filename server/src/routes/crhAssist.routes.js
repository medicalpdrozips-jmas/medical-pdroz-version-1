import { Router } from 'express'
import {
  evaluate,
  evaluateContract,
  evaluatePatient,
  getRuleCatalog,
  updateRuleStatus,
} from '../controllers/crhAssist.controller.js'

export const crhAssistRouter = Router()

crhAssistRouter.get('/rules', getRuleCatalog)
crhAssistRouter.get('/patient/:id', evaluatePatient)
crhAssistRouter.get('/contract/:id', evaluateContract)
crhAssistRouter.post('/evaluate', evaluate)
crhAssistRouter.patch('/rules/:id/status', updateRuleStatus)
