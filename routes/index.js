const express = require('express');
const router = express.Router();
const { ITNinthClass, ITEleventhClass } = require('./IT');
const { SecurityNinthClass } = require('./security');
const nodemailer = require('nodemailer');

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codingheroes2908@gmail.com', // Your email
    pass: 'vvwibatjhbesners' // Your app password or email password
  },
  tls: {
    rejectUnauthorized: false // For development purpose, avoid in production
  },
  logger: true,  // Log the transport actions
  debug: true    // Log debug messages
});

// Utility function to send notification emails
const sendNotificationEmails = (selectedStudents) => {
  selectedStudents.forEach(student => {
    const mailOptions = {
      from: 'codingheroes2908@gmail.com',
      to: student.email,
      subject: `Selection Notification for Class ${student.class}`,
      text: `Dear ${student.fullname},\n\nCongratulations! You have been selected for Class ${student.class} in Trade ${student.trade}. Please join as per the given instructions.\n\nBest Regards,\nVocational Portal Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
        return res.status(500).send('Error occurred while sending email');
      }
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    });

  });
};


// Routes

// Home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

// Portals
router.get('/9th-portal', (req, res) => {
  res.render('9th-portal', { title: 'Express' });
});

router.get('/11th-portal', (req, res) => {
  res.render('11th-portal', { title: 'Express' });
});

// Admin page
router.get('/admin', async (req, res, next) => {
  try {
    // Fetch users from both databases
    const ITUsers = await ITNinthClass.find();
    const SecurityUsers = await SecurityNinthClass.find();
    const users = [...ITUsers, ...SecurityUsers];
    res.render('Admin', { title: 'Express', users });
  } catch (err) {
    next(err);
  }
});

// Fetch Class 9th shortlisted data
router.get('/admin/class-9th', async (req, res, next) => {
  const { stream } = req.query;
  try {
    let users;
    if (stream === 'IT') {
      const ITBoys = await ITNinthClass.find({ gender: 'Male' }).sort({ marks: -1 }).limit(25);
      const ITGirls = await ITNinthClass.find({ gender: 'Female' }).sort({ marks: -1 }).limit(25);
      users = [...ITBoys, ...ITGirls];
    } else if (stream === 'security') {
      const SecurityBoys = await SecurityNinthClass.find({ gender: 'Male' }).sort({ marks: -1 }).limit(25);
      const SecurityGirls = await SecurityNinthClass.find({ gender: 'Female' }).sort({ marks: -1 }).limit(25);
      users = [...SecurityBoys, ...SecurityGirls];
    } else {
      return res.status(400).send("Invalid stream");
    }
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Fetch Class 11th shortlisted data
router.get('/admin/class-11th', async (req, res, next) => {
  try {
    const ITBoys = await ITEleventhClass.find({ gender: 'Male' }).sort({ marks: -1 }).limit(25);
    const ITGirls = await ITEleventhClass.find({ gender: 'Female' }).sort({ marks: -1 }).limit(25);
    const users = [...ITBoys, ...ITGirls];
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// to get csv print
router.get('/download-csv', async (req, res) => {
  const { gender, classType, streamType } = req.query;

  try {
    let users;

    // Check class and stream to fetch appropriate data
    if (classType === '9th' && streamType === 'IT') {
      users = await ITNinthClass.find({ gender });
    } else if (classType === '9th' && streamType === 'Security') {
      users = await SecurityNinthClass.find({ gender });
    } else if (classType === '11th' && streamType === 'IT') {
      users = await ITEleventhClass.find({ gender });
    } else {
      return res.status(400).send("Invalid class or stream type.");
    }

    // Send the user data as JSON to the frontend
    res.json(users);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});

// Send notifications
router.post('/send-notifications', async (req, res) => {
  try {
    const { classType, stream } = req.body;
    let Students;

    // Determine which class and stream to fetch from
    if (classType === '9th' && stream === 'IT') {
      Students = ITNinthClass;
    } else if (classType === '11th' && stream === 'IT') {
      Students = ITEleventhClass;
    } else if (classType === '9th' && stream === 'Security') {
      Students = SecurityNinthClass;
    } else {
      return res.status(400).send("Invalid class type or stream");
    }

    // Fetch students based on class and stream
    const students = await Students.find({ class: classType, stream });
    const boys = students.filter(student => student.gender === 'Male').sort((a, b) => b.marks - a.marks);
    const girls = students.filter(student => student.gender === 'Female').sort((a, b) => b.marks - a.marks);

    // Select top 25 boys and girls
    const selectedStudents = [...boys.slice(0, 25), ...girls.slice(0, 25)];

    // Send notification emails
    sendNotificationEmails(selectedStudents);
    res.status(200).json({ message: 'Notifications sent successfully!' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Applications routes
router.get('/all-applications', (req, res) => {
  res.render('Applications', { title: 'Express' });
});

// Fetch Class 9th all data
router.get('/all-applications/class-9th', async (req, res, next) => {
  const { stream } = req.query;
  try {
    let users;
    if (stream === 'IT') {
      const ITBoys = await ITNinthClass.find({ gender: 'Male' });
      const ITGirls = await ITNinthClass.find({ gender: 'Female' });
      users = [...ITBoys, ...ITGirls];
    } else if (stream === 'security') {
      const SecurityBoys = await SecurityNinthClass.find({ gender: 'Male' });
      const SecurityGirls = await SecurityNinthClass.find({ gender: 'Female' });
      users = [...SecurityBoys, ...SecurityGirls];
    } else {
      return res.status(400).send("Invalid stream");
    }
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Fetch Class 11th all data
router.get('/all-applications/class-11th', async (req, res, next) => {
  try {
    const ITBoys = await ITEleventhClass.find({ gender: 'Male' });
    const ITGirls = await ITEleventhClass.find({ gender: 'Female' });
    const users = [...ITBoys, ...ITGirls];
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Thank you page
router.get('/thanks', (req, res) => {
  res.render('form-submitted', { title: 'Express' });
});

// Normal and instructor pages
router.get('/normal', (req, res) => {
  res.render('layout', { title: 'Express' });
});

router.get('/instructor', (req, res) => {
  res.render('instructor', { title: 'Express' });
});

// Handle form submission for 9th class
router.post('/9th-portal', async (req, res) => {
  const { fullname, fathername, rollNumber, marks, stream, gender, email, phone } = req.body;

  try {
    if (stream === 'IT') {
      const createdUser = await ITNinthClass.create({
        fullname,
        fathername,
        rollNumber,
        marks,
        stream,
        gender,
        email,
        phone
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });
    } else if (stream === 'security') {
      const createdUser = await SecurityNinthClass.create({
        fullname,
        fathername,
        marks,
        stream,
        gender,
        email,
        phone
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });

    } else {
      res.status(400).send("Invalid stream");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// Handle form submission for 11th class
router.post('/11th-portal', async (req, res) => {
  const { fullname, fathername,  marks, stream, gender, email, phone } = req.body;

  try {
    if (stream === 'IT') {
      const createdUser = await ITEleventhClass.create({
        fullname,
        fathername,
        rollNumber,
        marks,
        stream,
        gender,
        email,
        phone
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });

    } else {
      res.status(400).send("Invalid stream or class");
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
