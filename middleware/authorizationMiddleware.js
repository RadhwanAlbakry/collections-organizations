

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Forbidden", message: "Admin access required" });
  }
};

module.exports = isAdmin;
