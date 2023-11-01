// create client model

import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
	profilePic: {
		type: String,
		default: 'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/profile.jpg?alt=media&token=4222dffe-31c0-47de-9c1d-37b2e290dd7c',
	},
	clientName: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
	},
	address: {
		type: String,
	},
});

const Client = mongoose.model('Client', clientSchema);

export default Client;
