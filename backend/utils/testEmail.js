import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
	to: 'webdev0000010+1@gmail.com', // Change to your recipient
	from: 'webdev0111+admin@proton.me', // Change to your verified sender
	subject: 'Sending with SendGrid is Fun',
	text: 'and easy to do anywhere, even with Node.js',
	html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
const sendEmail = async () => {
	try {
		await sgMail.send(msg);
		console.log('Email sent successfully');
	} catch (error) {
		throw new Error(error);
	}
};

sendEmail();
