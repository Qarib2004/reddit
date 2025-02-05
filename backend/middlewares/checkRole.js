const checkRole = (requiredRole) => (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No access, please log in" });
    }
  
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: You don't have permission" });
    }
  
    next();
  };
  
  export default checkRole;
  