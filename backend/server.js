const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Job = require('./models/Job');
const Resource = require('./models/Resource');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://movie:movie@movie.tylkv.mongodb.net/joball?retryWrites=true&w=majority&appName=movie';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'resource-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'JobAll API is running',
    timestamp: new Date()
  });
});

// ==================== JOB ROUTES ====================

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

// ==================== RESOURCE ROUTES ====================

// Get all resources
app.get('/api/resources', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    
    if (category && ['resume', 'interview'].includes(category)) {
      filter.category = category;
    }
    
    const resources = await Resource.find(filter).sort({ uploadedAt: -1 });
    res.json({
      success: true,
      count: resources.length,
      data: resources
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get single resource
app.get('/api/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resource not found' 
      });
    }
    res.json({
      success: true,
      data: resource
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Upload new resource
app.post('/api/resources', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a file'
      });
    }

    const { title, description, category, uploadedBy } = req.body;

    if (!title || !category) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Title and category are required'
      });
    }

    if (!['resume', 'interview'].includes(category)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }

    // Determine file type
    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileTypeMap = {
      '.pdf': 'pdf',
      '.doc': 'doc',
      '.docx': 'docx'
    };

    const resource = new Resource({
      title,
      description: description || '',
      category,
      fileUrl: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: fileTypeMap[ext] || 'pdf',
      fileSize: req.file.size,
      uploadedBy: uploadedBy || 'Anonymous',
      isActive: true,
      uploadedAt: new Date()
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully!',
      data: resource
    });
  } catch (error) {
    // Delete uploaded file if database save fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size must be less than 2MB'
      });
    }
    
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Download resource (increments download count)
app.get('/api/resources/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resource not found' 
      });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    // Send file
    const filePath = path.join(__dirname, resource.fileUrl);
    if (fs.existsSync(filePath)) {
      res.download(filePath, resource.fileName);
    } else {
      res.status(404).json({
        success: false,
        error: 'File not found on server'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete resource (admin only - no auth for now)
app.delete('/api/resources/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resource not found' 
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, resource.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Resource.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ==================== CRON JOBS ====================

// Cron job to deactivate expired jobs (runs every 30 minutes)
cron.schedule('*/30 * * * *', async () => {
  try {
    const result = await Job.updateMany(
      { expiryDate: { $lt: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Deactivated ${result.modifiedCount} expired jobs`);
    }
  } catch (error) {
    console.error('Cron job error:', error);
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`JobAll API running on port ${PORT}`);
});
