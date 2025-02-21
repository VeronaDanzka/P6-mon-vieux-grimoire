const express = require('express');
const router = express.Router();
const booksCtrl = require('../controllers/books');
const uploadImage = require('../middleware/upload-images');
const processImage = require('../middleware/process-images');
const auth = require('../middleware/auth');

router.get('/bestrating', booksCtrl.bestRatingBooks);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);
router.post('/:id/rating', auth, booksCtrl.ratingBook);
router.post('/', auth, uploadImage, processImage, booksCtrl.createBook);
router.put('/:id', auth, uploadImage, processImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);


module.exports = router;