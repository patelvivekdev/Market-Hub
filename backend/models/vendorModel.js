// create vendor model schema
import mongoose from 'mongoose';

const vendorSchema = mongoose.Schema({
	profilePic: {
		type: String,
		default: 'https://firebasestorage.googleapis.com/v0/b/market-hub-1937e.appspot.com/o/profile.jpg?alt=media&token=4222dffe-31c0-47de-9c1d-37b2e290dd7c',
	},
	vendorName: {
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
	website: {
		type: String,
	},
	description: {
		type: String,
	},
});

const Vendor = mongoose.model('Vendor', vendorSchema);

export default Vendor;
