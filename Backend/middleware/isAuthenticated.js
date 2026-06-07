import jwt from "jsonwebtoken";

// Middleware function to authenticate user token
const authenticateToken = (req, res, next) => {
  try {

    // Get token from cookies
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", success: false });
    }

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Invalid token", success: false });
    }

    // Store userId from token into request object
    req.id = decoded.userId;

    // Move to next middleware/controller
    next();

  } catch (error) {

    // Handle token verification errors
    return res.status(401).json({
      message: "Invalid token",
      success: false
    });
  }
};

// Export middleware
export default authenticateToken;