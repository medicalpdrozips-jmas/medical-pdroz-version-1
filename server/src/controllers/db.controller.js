import { checkDatabaseConnection } from '../db/pool.js'

export async function getDatabaseStatus(req, res, next) {
  try {
    const status = await checkDatabaseConnection()
    res.json(status)
  } catch (error) {
    next(error)
  }
}
