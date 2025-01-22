import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function userMiddleware(req: Request, res:Response, next: NextFunction) {
    // Implement user auth logic
    let authHeader: any
    authHeader = req.headers.authorization;

    if (!authHeader) {
        res.json({
            message: "access denied, please login or signup"
        })
        return;
    }

    const tokenParts = authHeader.split(" ");
    const jwtToken = tokenParts[1];

    try {
        // Verify the token
        const decoded = jwt.verify(jwtToken, SECRET_KEY) as JwtPayload;

        // Ensure the token contains the required `username` field
        if (decoded && decoded.username) {
            (req as any).user = decoded;
            next(); // Proceed to the next middleware
        } else {
             res.status(403).json({
                message: "Token verification failed: Missing required data",
            
            });
        }
        return;
    }
     catch (error) {
        // Handle invalid or expired tokens
         res.status(403).json({ error: "Invalid or expired token, please Login again" });
        return;
      }
}

export default userMiddleware;