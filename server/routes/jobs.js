import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
});

// Get available jobs (optionally filtered by max weight)
router.get('/available', async (req, res) => {
  try {
    const { maxWeight } = req.query;
    
    let query = { status: 'available' };
    
    // Filter by weight if provided
    if (maxWeight) {
      query.cargoWeight = { $lte: parseFloat(maxWeight) };
    }
    
    const jobs = await Job.find(query).sort({ priority: -1, createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available jobs', error });
  }
});

// Get jobs by driver ID
router.get('/driver/:driverId', async (req, res) => {
  try {
    const jobs = await Job.find({
      assignedDriverId: req.params.driverId,
      status: { $in: ['assigned', 'in-progress'] }
    }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching driver jobs', error });
  }
});

// Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const jobData = req.body;
    
    const job = new Job({
      ...jobData,
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await job.save();
    
    // Emit to all drivers
    const io = req.app.get('io');
    io.to('driver').emit('job:created', job);
    
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
});

// Assign job to driver
router.patch('/:id/assign', async (req, res) => {
  try {
    const { driverId, driverName } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'assigned',
        assignedDriverId: driverId,
        assignedDriverName: driverName,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Emit to all admins and the specific driver
    const io = req.app.get('io');
    io.to('admin').emit('job:assigned', job);
    io.to(driverId).emit('job:assigned', job);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error assigning job', error });
  }
});

// Start job
router.patch('/:id/start', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'in-progress',
        startedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Emit to all admins
    const io = req.app.get('io');
    io.to('admin').emit('job:started', job);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error starting job', error });
  }
});

// Complete job
router.patch('/:id/complete', async (req, res) => {
  try {
    const { rating } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'completed',
        completedAt: new Date(),
        rating: rating || 5,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Emit to all admins and drivers
    const io = req.app.get('io');
    io.to('admin').emit('job:completed', job);
    io.to('driver').emit('job:completed', job);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error completing job', error });
  }
});

// Cancel job
router.patch('/:id/cancel', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'cancelled',
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling job', error });
  }
});

// Abort job - make it available again
router.patch('/:id/abort', async (req, res) => {
  try {
    const { reason } = req.body;
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'available',
        assignedDriverId: null,
        assignedDriverName: null,
        startedAt: null,
        abortReason: reason,
        abortedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Emit to all admins and drivers
    const io = req.app.get('io');
    io.to('admin').emit('job:aborted', job);
    io.to('driver').emit('job:available', job);

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error aborting job', error });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
});

export default router;
