import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	limits: {
		fileSize: 1024 * 1024 * 10, // 5MB
	},
});

const uploader = upload.single('image');

export { uploader };
