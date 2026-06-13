import * as crhAssistService from '../services/crhAssist.service.js'

export async function getRuleCatalog(req, res, next) {
  try {
    res.json({ data: await crhAssistService.getRuleCatalog(req.query) })
  } catch (error) {
    next(error)
  }
}

export async function evaluatePatient(req, res, next) {
  try {
    const evaluation = await crhAssistService.evaluatePatient(req.params.id)

    if (!evaluation) {
      next({ status: 404, code: 'PATIENT_NOT_FOUND', message: 'Patient not found' })
      return
    }

    res.json({ data: evaluation })
  } catch (error) {
    next(error)
  }
}

export async function evaluateContract(req, res, next) {
  try {
    const evaluation = await crhAssistService.evaluateContract(req.params.id)

    if (!evaluation) {
      next({ status: 404, code: 'CONTRACT_NOT_FOUND', message: 'Contract not found' })
      return
    }

    res.json({ data: evaluation })
  } catch (error) {
    next(error)
  }
}

export async function evaluate(req, res, next) {
  try {
    const evaluation = await crhAssistService.evaluate(req.body ?? {})

    if (!evaluation) {
      next({
        status: 400,
        code: 'INVALID_EVALUATION_SCOPE',
        message: 'Provide patientId or contractId to evaluate CRH Assist.',
      })
      return
    }

    res.status(201).json({ data: evaluation })
  } catch (error) {
    next(error)
  }
}

export async function updateRuleStatus(req, res, next) {
  try {
    const rule = await crhAssistService.updateRuleStatus(req.params.id, req.body?.enabled)

    if (!rule) {
      next({ status: 404, code: 'RULE_NOT_FOUND', message: 'Rule not found' })
      return
    }

    res.json({ data: rule })
  } catch (error) {
    next(error)
  }
}
