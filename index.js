require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');



const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error.message);
  } else {
    console.log('Email transporter is ready');
  }
});

const app = express();

app.use(cors({
  origin: 'https://lost-and-found-ouff.onrender.com',
  methods: ['POST'],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Mail Service is running');
});

app.post('/send-email', async (req, res) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email credentials are missing. Please set EMAIL_USER and EMAIL_PASSWORD in the .env file.');
  }
  const { from, to, subject, html } = req.body;
  try {
    const mailOptions = {
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send(`Email sent successfully to ${to} with subject ${subject}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).send('Failed to send email: ' + error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});