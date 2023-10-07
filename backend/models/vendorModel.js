// create vendor model schema
import mongoose from 'mongoose';

const vendorSchema = mongoose.Schema({
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
