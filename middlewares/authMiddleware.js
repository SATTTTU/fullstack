import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";

export const requireSignIn = (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"
      if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }
  
      const decoded = JWT.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET matches token
      req.user = decoded; // Attach user to request object
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  };
//admin access

export const isAdmin = async (req, res, next) => {
    try {
        // Ensure the user ID exists in the request (from requireSignIn middleware)
        if (!req.user || !req.user._id) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized access: User ID not found in request',
            });
        }

        // Find the user by their ID
        const user = await userModel.findById(req.user._id);

        // Check if the user exists
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        
        if (user.role !== 1) {
            return res.status(403).send({
                success: false,
                message: 'Unauthorized access: Admins only',
            });
        }

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        res.status(500).send({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
