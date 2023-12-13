import { storage } from '../firebase/firebaseConfig.js';
import sharp from 'sharp';
import {
	ref,
	uploadBytes,
	listAll,
	deleteObject,
	getDownloadURL,
} from 'firebase/storage';

// resize image to 500px width, keep aspect ratio
const resizeImage = async (file) => {
	try {
		const image = sharp(file.buffer);
		const metadata = await image.metadata();
		const { width, height } = metadata;
		const ratio = width / height;
		const resizedImage = await image
			.resize(500, Math.round(500 / ratio))
			.toBuffer();
		return resizedImage;
	} catch (error) {
		console.error(error.message);
		throw error;
	}
};

const uploadImage = async (file) => {
	try {
		console.log(file);
		const resizedImage = await resizeImage(file);
		console.log(resizedImage);
		const imageRef = ref(storage, file.originalname);
		const metatype = {
			contentType: file.mimetype,
			name: file.originalname,
		};
		const snapshot = await uploadBytes(
			imageRef,
			resizedImage.buffer,
			metatype
		);
		const downloadURL = await getDownloadURL(imageRef);
		return downloadURL;
		// create public url
	} catch (error) {
		console.error(error.message);
		throw error;
	}
};

const deleteImage = async (imageName) => {
	try {
		// don't delete image if it contains 'default' in the name
		if (imageName.includes('default')) return;

		// don't delete image if it is the only image in the folder
		if (imageName.includes('profile')) return;

		const imageRef = ref(storage, imageName);
		await deleteObject(imageRef);
	} catch (error) {
		console.error('Error deleting image:', error.message);
		throw error;
	}
};

export { uploadImage, deleteImage };
