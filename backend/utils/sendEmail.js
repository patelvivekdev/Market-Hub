// // For sending email

// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// const sendEmail = async (options) => {
// 	const transporter = nodemailer.createTransport({
// 		service: 'gmail',
// 		auth: {
// 			user: process.env.EMAIL_USERNAME,
// 			pass: process.env.EMAIL_PASSWORD,
// 		},
// 	});

// 	const mailOptions = {
// 		from: process.env.EMAIL_FROM,
// 		to: options.to,
// 		subject: options.subject,
// 		text: options.text,
// 	};

// 	await transporter.sendMail(mailOptions);
// };

// export default sendEmail;
