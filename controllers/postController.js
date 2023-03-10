const { postModel } = require('../models/post');
const postController = {
	getAll: async (req, res) => {
		try {
			const posts = await postModel.find().populate('user').exec();
			res.json(posts);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to find posts',
			});
		}
	},

	getOne: async (req, res) => {
		try {
			const postId = req.params.id;
			postModel.findByIdAndUpdate(
				{
					_id: postId,
				},
				{
					returnDocument: 'after',
				},
				(err, doc) => {
					if (err) {
						console.log(err);

						return res.status(500).json({
							message: 'Failed to find posts',
						});
					}

					if (!doc) {
						return res.status(404).json({
							message: 'Failed to find posts',
						});
					}
					res.json(doc);
				}
			);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to find posts',
			});
		}
	},

	create: async (req, res) => {
		try {
			const doc = new postModel({
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				user: req.userId,
			});

			const post = await doc.save();
			console.log(req);
			res.json(post);
		} catch (err) {
			console.log(err);

			res.status(500).json({
				message: 'Failed to create post',
			});
		}
	},
};

module.exports = {
	postController,
};
