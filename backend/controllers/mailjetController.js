import dotenv from 'dotenv';
import Mailjet from 'node-mailjet';

dotenv.config();

const mailjet = Mailjet.apiConnect(
	process.env.MAILJET_API_KEY,
	process.env.MAILJET_SECRET_KEY
);

const sendMail = function (mail) {
	return mailjet.post('send', { version: 'v3.1' }).request({
		Messages: [
			{
				From: {
					Name: process.env.NAME,
					Email: process.env.EMAIL,
				},
				To: mail.Recipients,
				HTMLPart: mail.HTMLPart,
				Subject: mail.Subject,
			},
		],
	});
};

export default sendMail;
