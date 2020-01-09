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
router.post('/', createValidator, inputsValidate, createPlace);
router.patch('/:pid', patchValidator, inputsValidate, updatePlace);
router.delete('/:pid', deletePlace);

module.exports = router;
