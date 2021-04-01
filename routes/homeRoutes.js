const router = require('express').Router();
const homeController = require('../controllers/homeController');

router.get('/chat', homeController.chat);
router.get('/', homeController.index);
router.get('/contact', homeController.contact);

module.exports = router;
