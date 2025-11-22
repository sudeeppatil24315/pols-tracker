import express, { Request, Response } from 'express';
import Driver from '../models/Driver';

const router = express.Router();

// Get all drivers
router.get('/', async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find().sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
});

// Get available drivers
router.get('/available', async (req: Request, res: Response) => {
  try {
    const drivers = await Driver.find({ status: 'available' });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available drivers', error });
  }
});

// Create new driver
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, licenseNumber } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licenseNumber }] 
    });

    if (existingDriver) {
      return res.status(400).json({ 
        message: 'Driver with this email or license number already exists' 
      });
    }

    const driver = new Driver({
      name,
      email,
      phone,
      licenseNumber,
      status: 'available'
    });

    await driver.save();
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error creating driver', error });
  }
});

// Update driver status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status, vehicleId } = req.body;
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status, vehicleId },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: 'Error updating driver status', error });
  }
});

// Delete driver
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting driver', error });
  }
});

export default router;
