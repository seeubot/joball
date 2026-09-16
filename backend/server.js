const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const cron = require('node-cron');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Job = require('./models/Job');
const Resource = require('./models/Resource');
const PushToken = require('./models/PushToken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory
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
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB error:', err));

// API Key for write operations
const API_KEY = process.env.API_KEY || 'fresher-Bro@1660440';

// Rate limiting configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
  cleanupIntervalMs: 30 * 60 * 1000
};

const requestLog = {};

function getClientIp(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress || 
         'unknown';
}

function simpleRateLimit(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();

  if (!requestLog[ip]) {
    requestLog[ip] = { count: 1, firstRequest: now, blocked: false };
  } else {
    if (now - requestLog[ip].firstRequest > rateLimitConfig.windowMs) {
      requestLog[ip] = { count: 1, firstRequest: now, blocked: false };
    } else {
      requestLog[ip].count++;
    }
  }

  if (requestLog[ip].count > rateLimitConfig.maxRequests) {
    return res.status(429).json({ 
      success: false, 
      error: 'Too many requests. Please try again later.' 
    });
  }

  next();
}

setInterval(() => {
  const now = Date.now();
  for (const ip in requestLog) {
    if (now - requestLog[ip].firstRequest > rateLimitConfig.cleanupIntervalMs) {
      delete requestLog[ip];
    }
  }
}, rateLimitConfig.cleanupIntervalMs);

function validateApiKey(req, res, next) {
  if (req.method === 'GET') {
    return next();
  }

  const apiKey = req.headers['x-api-key'];
  const expectedKey = API_KEY;

  if (apiKey && apiKey.length === expectedKey.length) {
    const apiKeyBuffer = Buffer.from(apiKey);
    const expectedBuffer = Buffer.from(expectedKey);
    
    if (crypto.timingSafeEqual(apiKeyBuffer, expectedBuffer)) {
      return next();
    }
  }

  res.status(401).json({ success: false, error: 'Unauthorized' });
}

app.use('/api', validateApiKey);
app.use('/api', (req, res, next) => {
  if (req.method === 'POST' || req.method === 'DELETE') {
    simpleRateLimit(req, res, next);
  } else {
    next();
  }
});

// Configure Multer
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
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// ==================== HELPERS ====================

const TFI_DIALOGUES = [
  'Job kosam wait cheyyaku… opportunity ni chase cheyyi!',
  'Oka chance kosam wait chestunnava? Ikkade start cheyyi!',
  'Nee first job… nee career ki first big step!',
  'Experience ledu ani aagipoku… first chance evaraina ivvali!',
  'Oka referral… oka interview… oka life-changing chance!',
  'Nee skills ki match ayye opportunity ikkada undochu!',
  'Resume ready aa? Mari opportunity kosam enduku wait?',
  'Oka application tho nee career story start avvachu!',
  'Referral dorikithe share cheyyi… oka fresher future marchochu!',
  'Nee friend ki job kavala? Ee opportunity ni share cheyyi!',
  'Dream job kosam first step… APPLY!',
  'Opportunity chusava? Save cheyyaku… APPLY cheyyi!',
  'Scroll chestu time waste cheyyaku… nee next opportunity ni find cheyyi!',
  'Nee career nee chethullo undi… first step ivvale veyyi!',
  'Freshers ki chance ledani anukuntunnava? Once try cheyyi!',
  'Job hunt lo single ga kaadu… opportunities ni kalisi discover cheddam!',
  'Today apply chesina oka job… repu nee career ni marchochu!',
  'Nee next interview ekkada untundo… ee roju decide avvachu!',
  'Oka opportunity ni share cheyyadam… oka fresher life ni marchochu!',
  'Freshers, mee career ki START button ikkade!'
];

function getRandomDialogue() {
  return TFI_DIALOGUES[Math.floor(Math.random() * TFI_DIALOGUES.length)];
}

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function sendPushNotification(title, body, data = {}) {
  console.log('--- sendPushNotification called ---');
  console.log('Title:', title);
  console.log('Body:', body);

  try {
    const tokens = await PushToken.find({ isActive: true });
    console.log('Found active tokens:', tokens.length);

    if (tokens.length === 0) {
      console.log('No push tokens registered');
      return;
    }

    console.log('Registered tokens:', tokens.map(t => ({
      token: t.token.substring(0, 40) + '...',
      platform: t.platform,
      lastUsed: t.lastUsed,
    })));

    const messages = tokens.map(t => ({
      to: t.token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    }));

    const chunks = [];
    for (let i = 0; i < messages.length; i += 100) {
      chunks.push(messages.slice(i, i + 100));
    }

    for (const chunk of chunks) {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();

      console.log('========== EXPO PUSH RESPONSE ==========');
      console.log(JSON.stringify(result, null, 2));
      console.log('========================================');

      if (result.data) {
        result.data.forEach((ticket, i) => {
          if (ticket.status === 'error') {
            console.error(`Ticket ${i + 1} ERROR:`, ticket.message);
            console.error(`  Details:`, JSON.stringify(ticket.details));
          } else {
            console.log(`Ticket ${i + 1} OK - ID: ${ticket.id}`);
          }
        });
      } else if (result.errors) {
        console.error('Expo errors:', JSON.stringify(result.errors, null, 2));
      }
    }
  } catch (error) {
    console.error('Push notification error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Fresher-Bro API is running',
    timestamp: new Date()
  });
});

// ==================== DEBUG: LIST TOKENS ====================

app.get('/api/push/tokens', async (req, res) => {
  try {
    const tokens = await PushToken.find({ isActive: true });
    res.json({
      success: true,
      count: tokens.length,
      tokens: tokens.map(t => ({
        token: t.token,
        platform: t.platform,
        deviceId: t.deviceId,
        registeredAt: t.registeredAt,
        lastUsed: t.lastUsed,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== JOBS ====================

app.get('/api/jobs', async (req, res) => {
  try {
    const { city, type, category, skill, batch, search } = req.query;
    const filter = { 
      isActive: true, 
      expiryDate: { $gt: new Date() } 
    };
    
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (category) filter.category = category;
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
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/jobs/cities', async (req, res) => {
  try {
    const cities = await Job.distinct('city', { 
      isActive: true, 
      expiryDate: { $gt: new Date() } 
    });
    res.json({ success: true, data: cities.sort() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/jobs', async (req, res) => {
  try {
    const {
      type,
      category,
      jobTitle,
      company,
      city,
      skills,
      applyLink,
      expiryDate,
      batchEligible,
      eventDate,
      lastDate,
      venue,
      timing,
      referrerName,
      referrerCompany,
    } = req.body;

    if (!type || !category || !jobTitle || !company || !city) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    if (!['job', 'walkin', 'referral'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid job type' });
    }

    if (!['IT', 'Non-IT'].includes(category)) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }

    let finalExpiryDate;
    if (type === 'walkin') {
      if (!eventDate) {
        return res.status(400).json({ success: false, error: 'Walk-in requires event date' });
      }
      finalExpiryDate = new Date(eventDate);
    } else {
      if (expiryDate) {
        finalExpiryDate = new Date(expiryDate);
      } else {
        finalExpiryDate = new Date();
        finalExpiryDate.setDate(finalExpiryDate.getDate() + 3);
      }
    }

    const jobData = {
      type,
      category,
      jobTitle,
      company,
      city: city.trim(),
      skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean),
      applyLink: applyLink || '',
      expiryDate: finalExpiryDate,
      batchEligible: Array.isArray(batchEligible) ? batchEligible : [batchEligible],
      isActive: true,
      postedAt: new Date()
    };

    if (type === 'walkin') {
      if (!venue) {
        return res.status(400).json({ success: false, error: 'Walk-in requires venue' });
      }
      jobData.eventDate = new Date(eventDate);
      jobData.lastDate = lastDate ? new Date(lastDate) : new Date(eventDate);
      jobData.venue = venue;
      jobData.timing = timing || '';
    }

    if (type === 'referral') {
      jobData.referrerName = referrerName || '';
      jobData.referrerCompany = referrerCompany || company;
    }

    const job = new Job(jobData);
    await job.save();

    // ============ SEND PUSH NOTIFICATION ============
    const tfiDialogue = getRandomDialogue();
    const expiryStr = formatDate(job.expiryDate);

    let notifTitle = '';
    let notifBody = '';

    if (type === 'walkin') {
      notifTitle = 'Walk-in: ' + jobTitle;
      notifBody = company + ' • ' + city + '\n📅 Event: ' + formatDate(job.eventDate) + '\n\n' + tfiDialogue;
    } else if (type === 'referral') {
      notifTitle = 'Referral: ' + jobTitle;
      notifBody = company + ' • ' + city + '\n⏳ Apply by: ' + expiryStr + '\n\n' + tfiDialogue;
    } else {
      notifTitle = 'New Job: ' + jobTitle;
      notifBody = company + ' • ' + city + '\n⏳ Apply by: ' + expiryStr + '\n\n' + tfiDialogue;
    }

    sendPushNotification(notifTitle, notifBody, {
      jobId: job._id.toString(),
      type: type,
      title: jobTitle,
      company: company,
      city: city,
      expiryDate: job.expiryDate ? new Date(job.expiryDate).toISOString() : '',
      screen: 'Home',
    });

    res.status(201).json({ success: true, message: 'Job posted successfully!', data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// ==================== RESOURCES ====================

app.get('/api/resources', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category && ['resume', 'interview'].includes(category)) {
      filter.category = category;
    }
    const resources = await Resource.find(filter).sort({ uploadedAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/resources', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const { title, description, category, uploadedBy } = req.body;

    if (!title || !category) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ success: false, error: 'Title and category are required' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const fileTypeMap = { '.pdf': 'pdf', '.doc': 'doc', '.docx': 'docx' };

    const resource = new Resource({
      title,
      description: description || '',
      category,
      fileUrl: '/uploads/' + req.file.filename,
      fileName: req.file.originalname,
      fileType: fileTypeMap[ext] || 'pdf',
      fileSize: req.file.size,
      uploadedBy: uploadedBy || 'Anonymous',
      isActive: true,
      uploadedAt: new Date()
    });

    await resource.save();

    // Push notification for new resource
    const tfiDialogue = getRandomDialogue();
    sendPushNotification(
      'New Resource: ' + title,
      (category === 'resume' ? 'Resume Template' : 'Interview Prep') + '\n\n' + tfiDialogue,
      { resourceId: resource._id.toString(), screen: 'Resources' }
    );

    res.status(201).json({ success: true, message: 'Resource uploaded!', data: resource });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(400).json({ success: false, error: error.message });
  }
});

app.get('/api/resources/:id/download', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ success: false, error: 'Resource not found' });
    }
    resource.downloads += 1;
    await resource.save();
    const filePath = path.join(__dirname, resource.fileUrl);
    if (fs.existsSync(filePath)) {
      res.download(filePath, resource.fileName);
    } else {
      res.status(404).json({ success: false, error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== PUSH NOTIFICATIONS ====================

app.post('/api/push/register', async (req, res) => {
  try {
    const { token, platform, deviceId } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: 'Token is required' });
    }

    await PushToken.findOneAndUpdate(
      { token },
      {
        token,
        platform: platform || 'unknown',
        deviceId: deviceId || '',
        isActive: true,
        lastUsed: new Date(),
        registeredAt: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log('Token registered:', token.substring(0, 40) + '...');

    res.json({ success: true, message: 'Token registered' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/push/unregister', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token required' });
    }
    await PushToken.updateOne({ token }, { isActive: false });
    res.json({ success: true, message: 'Token unregistered' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/push/test', async (req, res) => {
  try {
    const { title, body } = req.body;
    const tfiDialogue = getRandomDialogue();

    await sendPushNotification(
      title || 'Test Notification',
      (body || 'This is a test from Fresher-Bro') + '\n\n' + tfiDialogue,
      { screen: 'Home' }
    );
    res.json({ success: true, message: 'Test push sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CRON JOBS ====================

cron.schedule('*/30 * * * *', async () => {
  try {
    const result = await Job.updateMany(
      { expiryDate: { $lt: new Date() }, isActive: true },
      { $set: { isActive: false } }
    );
    if (result.modifiedCount > 0) {
      console.log('Deactivated ' + result.modifiedCount + ' expired jobs');
    }
  } catch (error) {
    console.error('Cron error:', error);
  }
});

cron.schedule('0 3 * * *', async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const result = await PushToken.deleteMany({
      isActive: false,
      lastUsed: { $lt: thirtyDaysAgo }
    });
    if (result.deletedCount > 0) {
      console.log('Cleaned up ' + result.deletedCount + ' old push tokens');
    }
  } catch (error) {
    console.error('Push cleanup error:', error);
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log('Fresher-Bro API running on port ' + PORT);
});
