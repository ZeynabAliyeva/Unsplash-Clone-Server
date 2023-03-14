const { postModel } = require("../models/post");
const postController = {
  getAll: (req, res) => {
    postModel
      .find()
      .populate("user")
      .exec()
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "Failed to find posts",
        });
      });
  },
  getPost: async (req, res) => {
    try {
      const post = await postModel.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  create: async (req, res) => {
    try {
      const doc = new postModel({
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.body.user,
      });

      const post = await doc.save();

      res.json(post);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Failed to create post",
      });
    }
  },
  remove: (req, res) => {
    const postId = req.params.id;
    postModel
      .findOneAndDelete({ _id: postId })
      .exec()
      .then((deletedPost) => {
        if (!deletedPost) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        res.json(deletedPost);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({
          message: "Failed to delete post",
        });
      });
  },
};

module.exports = {
  postController,
};
