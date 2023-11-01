import mongoose from 'mongoose';

const CategoryModelSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	description: {
		type: String,
		required: false,
	},
});

const CategoryModel = mongoose.model('CategoryModel', CategoryModelSchema);

export default CategoryModel;
