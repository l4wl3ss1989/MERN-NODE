const { Router } = require('express');
const { check } = require('express-validator');

const inputsValidate = require('../util/inputs-validate');
const {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/places.controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = Router();

const createValidator = [
  check('title')
    .not()
    .isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address')
    .not()
    .isEmpty()
];
const patchValidator = createValidator.filter((el, index) => index !== createValidator.length - 1);

router.get('/:pid', getPlaceById);
router.get('/user/:uid', getPlacesByUserId);

router.post(
  '/',
  checkAuth,
  fileUpload.single('image'),
  createValidator,
  inputsValidate,
  createPlace
);
router.patch('/:pid', checkAuth, patchValidator, inputsValidate, updatePlace);
router.delete('/:pid', checkAuth, deletePlace);

module.exports = router;
