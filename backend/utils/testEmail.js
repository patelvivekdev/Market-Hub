import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
	to: [
		{
			email: 'webdev0000010@gmail.com',
			name: 'Web Dev',
		},
	],
	from: {
		email: process.env.SENDGRID_EMAIL,
		name: process.env.SENDGRID_NAME,
	},
	subject: 'Your Example Order Confirmation',
	content: [
		{
			type: 'text/html',
			value: `
				<p>Hello from Twilio SendGrid!</p>
				<p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p>
				<button>
					<a href="http://localhost:5000/reset-password/2f2835df0e3d4c1fadbb70accdb6438f84ab80a8d537835081efd642d33be9ff">Reset Password</a>
				</button>
			`,
		},
	],
};
const sendEmail = async () => {
	try {
		await sgMail.send(message);
	} catch (error) {
		throw new Error(error);
	}
};

sendEmail();
