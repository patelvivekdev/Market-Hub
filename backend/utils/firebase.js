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
		if (
			imageName ===
			'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/default.jpg?alt=media&token=9ddd7635-4413-4594-b8d4-530aec97b7ac'
		) {
			return;
		}
		const imageRef = ref(storage, imageName);
		await deleteObject(imageRef);
	} catch (error) {
		console.error('Error deleting image:', error.message);
	}
};

export { uploadImage, deleteImage };
