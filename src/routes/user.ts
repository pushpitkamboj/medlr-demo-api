import {Router, Request, Response } from "express";
import userMiddleware from "../middleware/user";
import {z} from "zod";
import dotenv from "dotenv";
import {User, Medicine} from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

dotenv.config();

const router = Router();

const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined in environment variables.");
}
  
//zod validation
const signupSchema = z.object({
    username: z.string().min(2, { message: "Name must have at least 2 characters" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password must not exceed 32 characters" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one digit" })
        .regex(/[@$!%*?&#]/, { message: "Password must contain at least one special character (@$!%*?&#)" })
});


router.post('/signup', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    //pass the inputs for zod validation
    const check = signupSchema.safeParse({
        username, 
        password
    })

    //if zod validation did not succeed 
    if (!check.success) {
        const errors = check.error.issues.map(issue => issue.message).join(", ");
        res.status(400).json({ message: errors });
        return;
    }

    //check the logic if the user already exists
    const existingUser = await User.findOne({username});
    if (existingUser)  {
        res.status(400).json({
            message: "username already exists",
        })
        return;
    }

    //save the user in the db
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        username: username,
        password: hashedPassword
    })
    res.status(201).json({message: "user signed in successfully"})
})


//login route
router.post('/login', async (req: Request, res: Response) => {
    const {username, password} = req.body;

    //check the user in DB
    const user = await User.findOne({ username });
    if (!user) {
        res.status(401).json({
            message: "the user does not exist, please signup"
        })
        return;
    }

    //Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid ) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }

    //return the jwt token 
    if (user) {
            const token = jwt.sign({
            username: user.username,
            userId: user._id
        }, SECRET_KEY, {expiresIn: '1h'})
        res.json({
            token
        })
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
})

router.post('/favorites/:medicineId', userMiddleware, async (req: Request, res: Response) => {
    const {medicineId} =  req.params;
    const username = (req as any).user.username;

    try {  
        // check if the medicine is already in favorites
        const user = await User.findOne({ username: username });

        // Check if the medicineId is valid
        if (!mongoose.Types.ObjectId.isValid(medicineId)) {
            res.status(400).json({ message: "Invalid medicineId format" });
            return;
        }

        // Check if the medicine is already in favorites
        const isFavorite = user.favorites.some((fav: mongoose.Types.ObjectId) => fav.equals(medicineId));
        if (isFavorite) {
            res.status(200).json({ message: "The medicine is already in favorites" });
            return;
        }

        // Add the medicine to favorites
        const medicineObjectId = new mongoose.Types.ObjectId(medicineId);
        user.favorites.push(medicineObjectId);
        await user.save();
    
        res.status(201).json({ message: "Medicine added to favorites" });
    } catch (error) {
            console.error('Error adding medicine to favorites:', error);
            res.status(500).json({ message: 'An error occurred', error });
        } 
});  


router.get('/favorites', userMiddleware, async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;

    try {
        const user = await User.findById(userId).populate('favorites');
        if (!user.favorites || user.favorites.length === 0) {
            res.status(200).json({ message: 'Your Favorites list is empty'});
            return;
          }

          //give the favourites list
          res.status(200).json({ favorites: user.favorites });
    } catch (error) {
            console.error('Error retrieving favorites:', error);
            res.status(500).json({ message: 'Failed to retrieve favorites', error: error.message });
        }
})

router.delete('/favorites/:medicineId', userMiddleware, async (req: Request, res: Response) => {
    const { medicineId } = req.params; // Extract medicineId from the URL
    const userId = (req as any).user.userId; // Extract userId from the middleware
  
    try {
      // Validate medicineId
      if (!mongoose.Types.ObjectId.isValid(medicineId)) {
        res.status(400).json({ message: 'Invalid medicineId format' });
      }
  
      //Find the user
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
      }
  
      //Check if the medicine exists in the user's favorites
      const favoriteIndex = user.favorites.findIndex((fav) =>
        fav.toString() === medicineId
      );
  
      if (favoriteIndex === -1) {
        res.status(404).json({ message: 'Medicine not found in favorites' });
      }
  
      //Remove the medicine from the favorites list
      if (user) {
        user.favorites.splice(favoriteIndex, 1);
        await user.save(); 
      }
      
      //respond with the updated favorites list
      res.status(200).json({
        message: 'Medicine removed from favorites'
      });
    } catch (error) {
      console.error('Error removing medicine from favorites:', error);
      res.status(500).json({
        message: 'Failed to remove medicine from favorites',
        error: error.message,
      });
    }
  });
  

  

export default router;