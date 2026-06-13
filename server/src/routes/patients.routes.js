import { Router } from 'express'
import {
  getPatientById,
  getPatientClinicalContext,
  getPatients,
} from '../controllers/patients.controller.js'

export const patientsRouter = Router()

patientsRouter.get('/', getPatients)
patientsRouter.get('/:id', getPatientById)
patientsRouter.get('/:id/clinical-context', getPatientClinicalContext)
