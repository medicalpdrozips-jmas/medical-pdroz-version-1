import * as patientsService from '../services/patients.service.js'

export async function getPatients(req, res, next) {
  try {
    res.json({ data: await patientsService.getPatients(req.query) })
  } catch (error) {
    next(error)
  }
}

export async function getPatientById(req, res, next) {
  try {
    const patient = await patientsService.getPatientById(req.params.id)

    if (!patient) {
      next({ status: 404, code: 'PATIENT_NOT_FOUND', message: 'Patient not found' })
      return
    }

    res.json({ data: patient })
  } catch (error) {
    next(error)
  }
}

export async function getPatientClinicalContext(req, res, next) {
  try {
    const context = await patientsService.getPatientClinicalContext(req.params.id)

    if (!context) {
      next({ status: 404, code: 'PATIENT_NOT_FOUND', message: 'Patient not found' })
      return
    }

    res.json({ data: context })
  } catch (error) {
    next(error)
  }
}
