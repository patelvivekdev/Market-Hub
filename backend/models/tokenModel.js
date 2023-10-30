import mongoose from 'mongoose';

const TokenModelSchema = new mongoose.Schema({
	email: String,
	token: String,
});

const TokenModel = mongoose.model('TokenModel', TokenModelSchema);

export default TokenModel;
