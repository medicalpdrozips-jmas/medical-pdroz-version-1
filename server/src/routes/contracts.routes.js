import { Router } from 'express'
import {
  getContractById,
  getContractPatients,
  getContracts,
} from '../controllers/contracts.controller.js'

export const contractsRouter = Router()

contractsRouter.get('/', getContracts)
contractsRouter.get('/:id', getContractById)
contractsRouter.get('/:id/patients', getContractPatients)
