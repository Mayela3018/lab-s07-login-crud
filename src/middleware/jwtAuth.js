const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1] || req.query.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Acceso denegado. No se proporcionó token.' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ 
      success: false, 
      message: 'Token inválido o expirado.' 
    });
  }
};

module.exports = verifyToken;