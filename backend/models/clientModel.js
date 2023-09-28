// create client model

import mongoose from 'mongoose';

const clientSchema = mongoose.Schema({
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
