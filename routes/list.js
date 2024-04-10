const { Router } = require('express');
const listController = require('../controllers/listControllers');
const router = Router();

router.get('/lists/user/:userId', listController.get_lists);
router.get('/lists/:id', listController.get_list);
router.post('/lists/:id', listController.post_list);
router.put('/lists/:id', listController.update_list);
router.delete('/lists/:id', listController.delete_list);

module.exports = router;