const express = require('express');
const { postController } = require('../controllers/postController');

const router = express.Router();

router.get('/', postController.getAll);
router.get('/:id', postController.getOne);
router.post('/', postController.create);

module.exports = router;
