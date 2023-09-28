// Admin model schema
import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
	adminName: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		unique: true,
	},
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
