const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post('/subscribe', async (req, res) => {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
        return res.status(400).json({ msg: 'Please provide a first name and email.' });
    }

    try {
        let subscriber = await Subscriber.findOne({ email });
        if (subscriber) {
            return res.status(400).json({ msg: 'This email is already subscribed.' });
        }

        subscriber = new Subscriber({ firstName, email });
        await subscriber.save();

        const mailOptions = {
            from: `"Team LaunchMate" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🚀 Your Startup Journey Just Got Easier – LaunchMate Updates Inside!',
            html: `
                <p>Hi ${firstName},</p>
                <p>Welcome to the very first edition of the LaunchMate Startup Bulletin – your go-to source for startup updates, compliance reminders, and exclusive insights to launch and grow your business in Delhi.</p>
                <h3>🌟 What’s New This Week:</h3>
                <ul>
                    <li><b>LaunchMate Newsletter Goes Live:</b> Now stay updated with the latest tools, tips, and timelines that simplify your startup journey.</li>
                    <li><b>Feature Spotlight: Compliance Calendar:</b> Never miss another deadline! Our new Smart Compliance Calendar sends reminders for GST filings, pollution renewals, and more.</li>
                    <li><b>Know Your Schemes:</b> Did you know you might be eligible for up to ₹25L in support via PMEGP or Stand-Up India?</li>
                    <li><b>DIY Score – Are You Consultant-Free Ready?:</b> Our confidence meter tells you how much of the launch process you can handle yourself.</li>
                </ul>
                <h3>🚀 Featured Use Case: Priya from Narela</h3>
                <p>Priya used LaunchMate to set up her garment unit and completed 92% of the process without any consultant. From DPCC clearance to Fire NOC – it was all guided, simplified, and centralized.</p>
                <p>Thanks for being a part of the LaunchMate community.</p>
                <p>Until next time,<br>– Team LaunchMate<br>Unify. Simplify. Launch.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ msg: 'Subscription successful! A welcome email has been sent.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;