const express = require('express');
const router = express.Router();
const { ITNinthClass, ITEleventhClass } = require('./IT');
const { SecurityNinthClass } = require('./security');
const nodemailer = require('nodemailer');

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

//Nodemailer-Notifiation setup

// route to send emails to 25 boys + 25 girls
router.post('/send-selected-mails', async (req, res) => {
    const IT9 = await ITNinthClass.find();
    const IT11 = await ITEleventhClass.find();
    const Security9 = await SecurityNinthClass.find();
    const allApplicants = [...IT9, ...IT11, ...Security9];


    const boys = allApplicants.filter(app => app.gender === 'Male').sort((a, b) => b.marks - a.marks).slice(0, 25);
    const girls = allApplicants.filter(app => app.gender === 'Female').sort((a, b) => b.marks - a.marks).slice(0, 25);

    const selected = [...boys, ...girls];

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astacodeindiabusiness@gmail.com',
            pass: 'srzbhwlzfzipmxcy'
        }
    });

    for (let student of selected) {
        await transporter.sendMail({
            from: 'your_email@gmail.com',
            to: student.email,
            subject: '🎉 You are Selected!',
            text: `Dear ${student.fullname},\n\nCongratulations! You have been selected based on your application.\n\nRegards,\nVocational Team`
        });
    }

    // res.send('Selected students notified successfully.');
    res.json({ message: "Selected students notified successfully!👍" });

});

// route to send emails to all applicaticants
router.post('/send-all-mails', async (req, res) => {
    const IT9 = await ITNinthClass.find();
    const IT11 = await ITEleventhClass.find();
    const Security9 = await SecurityNinthClass.find();
    const allApplicants = [...IT9, ...IT11, ...Security9];

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'astacodeindiabusiness@gmail.com',
            pass: 'srzbhwlzfzipmxcy'
        }
    });

    for (let student of allApplicants) {
        await transporter.sendMail({
            from: 'your_email@gmail.com',
            to: student.email,
            subject: '📝 Thanks for Applying!',
            text: `Dear ${student.fullname},\n\nThank you for submitting your application. We appreciate your interest.\n\nRegards,\nVocational Team`
        });
    }

    // res.send('All applicants notified successfully.');
     res.json({ message: "All applicants notified successfully.✅" });
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
  const { fullname, fathername, mothername, gender, category, adhaar, sssmID, dob, rollNumber, marks, stream, email, phone, address } = req.body;

  try {

    // Aadhaar duplicate check
    let existing;
    if (stream === 'IT') {
      existing = await ITNinthClass.findOne({ adhaar });
    } else if (stream === 'security') {
      existing = await SecurityNinthClass.findOne({ adhaar });
    }

    if (existing) {
      return res.redirect('/9th-portal?error=duplicate');
    }

    if (stream === 'IT') {
      const createdUser = await ITNinthClass.create({
        fullname,
        fathername,
        mothername,
        gender,
        category,
        adhaar,
        sssmID,
        dob,
        rollNumber,
        marks,
        stream,
        email,
        phone,
        address
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });
    } else if (stream === 'security') {
      const createdUser = await SecurityNinthClass.create({
        fullname,
        fathername,
        mothername,
        gender,
        category,
        adhaar,
        sssmID,
        dob,
        rollNumber,
        marks,
        stream,
        email,
        phone,
        address
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });

    } else {
      res.status(400).send("Invalid stream");
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("❌ Duplicate Aadhaar entry.");
    } else {
      res.status(500).send("❌ Server Error");
    }
  }
});

// Handle form submission for 11th class
router.post('/11th-portal', async (req, res) => {
  const { fullname, fathername, mothername, gender, category, adhaar, sssmID, dob, rollNumber, marks, stream, email, phone, address } = req.body;

  try {

 // Aadhaar duplicate check
    let existing;
    if (stream === 'IT') {
      existing = await ITEleventhClass.findOne({ adhaar });
    } 

    if (existing) {
      return res.redirect('/11th-portal?error=duplicate');
    }


    if (stream === 'IT') {
      const createdUser = await ITEleventhClass.create({
        fullname,
        fathername,
        mothername,
        gender,
        category,
        adhaar,
        sssmID,
        dob,
        rollNumber,
        marks,
        stream,
        email,
        phone,
        address
      });
      // After form submission, render success page
      res.render('form-submitted', { fullname });

    } else {
      res.status(400).send("Invalid stream or class");
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("❌ Duplicate Aadhaar entry.");
    } else {
      res.status(500).send("❌ Server Error");
    }
  }
});

module.exports = router;
