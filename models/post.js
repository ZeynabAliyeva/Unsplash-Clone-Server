const { default: mongoose } = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const postModel = mongoose.model('post', postSchema);

module.exports = {
	postModel,
};
