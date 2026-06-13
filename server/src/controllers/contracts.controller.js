import * as contractsService from '../services/contracts.service.js'

export async function getContracts(req, res, next) {
  try {
    res.json({ data: await contractsService.getContracts(req.query) })
  } catch (error) {
    next(error)
  }
}

export async function getContractById(req, res, next) {
  try {
    const contract = await contractsService.getContractById(req.params.id)

    if (!contract) {
      next({ status: 404, code: 'CONTRACT_NOT_FOUND', message: 'Contract not found' })
      return
    }

    res.json({ data: contract })
  } catch (error) {
    next(error)
  }
}

export async function getContractPatients(req, res, next) {
  try {
    const patients = await contractsService.getContractPatients(req.params.id)

    if (!patients) {
      next({ status: 404, code: 'CONTRACT_NOT_FOUND', message: 'Contract not found' })
      return
    }

    res.json({ data: patients })
  } catch (error) {
    next(error)
  }
}
