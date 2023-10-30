import AsyncHandler from 'express-async-handler';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
});

const uploader = upload.single('image');

export { uploader };
