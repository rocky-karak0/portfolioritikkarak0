export function notFound(req, res) {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({
    ok: false,
    message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
}
