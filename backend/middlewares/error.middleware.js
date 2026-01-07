export function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status ?? 500;
  const message =
    status === 500
      ? 'Internal Server Error'
      : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}