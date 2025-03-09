const router = require('express').Router();
const users = require('../controllers/users');

router.get('/', users.search);
router.get('/:id', users.getUser);
router.post('/', users.createUser);
router.put('/:id',users.editUser);
router.delete('/:id',users.deletUser);
module.exports = router;