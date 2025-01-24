import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {Pharmacy} from '../db';

const router = express.Router();

router.get('/pharmacies', async (req: Request, res: Response) => {
  try {
      const medicineId = req.query.medicineId as string;

      // Validate if medicineId is provided
      if (!medicineId) {
        res.status(400).json({ message: "medicineId is required" });
        return;
      }

      // Ensure `medicineId` is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(medicineId)) {
          res.status(400).json({ message: "Invalid medicineId format" });
          return;
      }

      // Convert the string `medicineId` to ObjectId
      const objectId = new mongoose.Types.ObjectId(medicineId);

      // Query to find pharmacies where the medicine exists
      const pharmacies = await Pharmacy.aggregate([
        { $match: { "medicines.medicineId": objectId } },
        { $unwind: "$medicines" },
        { $match: { "medicines.medicineId": objectId } },
        {
            $project: {
                name: 1,
                location: 1,
                contact: 1,
                price: "$medicines.price"
            }
        }
      ]);

      // Return response
      if (pharmacies.length === 0) {
        res.status(200).json({ message: "No pharmacies found with the given medicineId" });
        return;
      }

      //return the found pharamcies that match the requirements
      res.status(200).json(pharmacies);
  } catch (error) {
      console.error("Error fetching pharmacies:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
