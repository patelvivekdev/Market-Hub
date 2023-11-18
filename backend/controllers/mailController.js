import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (mail) => {
	try {
		const msg = {
			to: mail.To,
			from: process.env.SENDGRID_EMAIL,
			subject: mail.Subject,
			text: mail.TextPart,
			content: [
				{
					type: 'text/html',
					value: mail.HTMLPart,
				},
			],
		};
		await sgMail.send(msg);
	} catch (error) {
		throw new Error(error);
	}
};

export default sendMail;
