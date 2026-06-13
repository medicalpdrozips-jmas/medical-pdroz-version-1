export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err)
    return
  }

  const status = err.status ?? 500

  res.status(status).json({
    error: {
      code: err.code ?? 'INTERNAL_SERVER_ERROR',
      message: err.message ?? 'Unexpected server error',
      details: err.details ?? {},
    },
  })
}
