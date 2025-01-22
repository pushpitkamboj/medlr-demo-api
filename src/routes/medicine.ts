import express, {Request, Response } from "express";
import mongoose from "mongoose"
import { Medicine } from "../db";

const router = express.Router();

router.get('/medicines', async (req: Request, res: Response) => {
    try {
      // Extract the search query parameter, the name of medicine
      const name  = req.query.name as string;
  
      // Check if the name parameter is provided
      if (!name || typeof name !== 'string') {
        res.status(400).json({ message: 'Please provide a valid search query for the medicine name' });
        return;
      }
  
      // Search for medicines where the name matches the query (case-insensitive)
      const medicines = await Medicine.find({
        name: { $regex: new RegExp(name, 'i') },
      });
  
      // If no medicines are found, return an empty array with a message
      if (medicines.length === 0) {
        res.status(200).json({
          message: 'No medicines found matching the search query',
          medicines: [],
        });
        return;
      }
  
      // Return the matching medicines
      res.status(200).json({
        message: 'searched medicine details retreived successfully',
        medicines,
      });
    } catch (error) {
      console.error('Error fetching medicines:', error);
      res.status(500).json({
        message: 'Failed to fetch medicines due to a server error',
        error: (error as Error).message,
      });
    }
  });
  

router.get('/medicines/:id', async (req: Request, res: Response) => {
    const {id} = req.params;
  
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: 'Invalid medicine ID format' });
        return;
      }
  
      const medicine = await Medicine.findById(id);
        if (!medicine) {
        res.status(404).json({ message: 'Medicine not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Medicine details retrieved successfully',
        medicine,
      });
    } catch (error) {
      console.error('Error fetching medicine details:', error);
      res.status(500).json({
        message: 'Failed to fetch medicine details due to a server error',
        error: (error as Error).message,
      });
    }
});
export default router;