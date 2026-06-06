function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: 'No autorizado' });
    if (!roles.includes(req.user.rol)) return res.status(403).json({ success: false, message: 'Permisos insuficientes' });
    return next();
  };
}

module.exports = { requireRoles };
