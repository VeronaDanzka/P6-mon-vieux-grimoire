const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const uploadImage = require('../middleware/upload-images');
const processImage = require('../middleware/process-images');
const auth = require('../middleware/auth');

router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);
router.post('/', auth, uploadImage, processImage, booksCtrl.createBook);
// router.put('/:id', booksCtrl.modifyBook);
// router.delete('/:id', booksCtrl.deleteBook);
// router.post('/:id/rating', booksCtrl.ratingBook);

module.exports = router;