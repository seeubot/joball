const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const Job = require('./models/Job');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://movie:movie@movie.tylkv.mongodb.net/joball?retryWrites=true&w=majority&appName=movie';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'JobAll API is running',
    timestamp: new Date()
  });
});

// Get all active jobs with filters
app.get('/api/jobs', async (req, res) => {
  try {
    const { city, type, skill, batch, search } = req.query;
    const filter = { 
      isActive: true, 
      expiryDate: { $gt: new Date() } 
    };
    
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (skill) filter.skills = { $in: [skill] };
    if (batch) filter.batchEligible = batch;
    if (search) {
      filter.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    
    const jobs = await Job.find(filter).sort({ postedAt: -1 });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job || !job.isActive) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found or expired' 
      });
    }
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Post a new job
app.post('/api/jobs', async (req, res) => {
  try {
    const {
      type,
      jobTitle,
      company,
      city,
      skills,
      applyLink,
      expiryDate,
      batchEligible,
      experience,
      eventDate,
      lastDate,
      venue,
      timing
    } = req.body;

    // Validation
    if (!type || !jobTitle || !company || !city || !expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    if (!['job', 'walkin'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid job type'
      });
    }

    if (!['Hyderabad', 'Bengaluru'].includes(city)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid city. Only Hyderabad and Bengaluru are allowed'
      });
    }

    const jobData = {
      type,
      jobTitle,
      company,
      city,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()),
      applyLink,
      expiryDate: new Date(expiryDate),
      batchEligible: Array.isArray(batchEligible) ? batchEligible : [batchEligible],
      experience: experience || 'Fresher',
      isActive: true,
      postedAt: new Date()
    };

    // Add walk-in specific fields
    if (type === 'walkin') {
      if (!eventDate || !venue || !lastDate) {
        return res.status(400).json({
          success: false,
          error: 'Walk-in drives require event date, venue, and last date'
        });
      }
      jobData.eventDate = new Date(eventDate);
      jobData.lastDate = new Date(lastDate);
      jobData.venue = venue;
      jobData.timing = timing;
    }

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      data: job
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get expiring soon jobs
app.get('/api/jobs/expiring-soon', async (req, res) => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    
    const jobs = await Job.find({
      isActive: true,
      expiryDate: { 
        $gt: new Date(), 
        $lt: threeDaysFromNow 
      }
    }).sort({ expiryDate: 1 });
    
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Cron job to deactivate expired jobs (runs every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  try {
    const result = await Job.updateMany(
      { expiryDate: { $lt: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔄 Deactivated ${result.modifiedCount} expired jobs`);
    }
  } catch (error) {
    console.error('❌ Cron job error:', error);
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 JobAll API running on port ${PORT}`);
});
