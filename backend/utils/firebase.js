import { storage } from '../firebase/firebaseConfig.js';

import {
	ref,
	uploadBytes,
	listAll,
	deleteObject,
	getDownloadURL,
} from 'firebase/storage';

const uploadImage = async (file) => {
	try {
		const imageRef = ref(storage, file.originalname);
		const metatype = {
			contentType: file.mimetype,
			name: file.originalname,
		};
		const snapshot = await uploadBytes(imageRef, file.buffer, metatype);
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
		const imageRef = ref(storage, imageName);
		await deleteObject(imageRef);
		console.log('Image deleted successfully');
	} catch (error) {
		console.error('Error deleting image:', error.message);
		throw error;
	}
};

export { uploadImage, deleteImage };
