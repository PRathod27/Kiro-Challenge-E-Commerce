// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.userRole === 'admin') {
    return next();
  }
  res.redirect('/');
};

// Middleware to attach user info to response locals
const attachUser = (req, res, next) => {
  if (req.session && req.session.userId) {
    res.locals.user = {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      role: req.session.userRole
    };
    res.locals.isAuthenticated = true;
    res.locals.isAdmin = req.session.userRole === 'admin';
  } else {
    res.locals.user = null;
    res.locals.isAuthenticated = false;
    res.locals.isAdmin = false;
  }
  next();
};

module.exports = { requireAuth, requireAdmin, attachUser };
