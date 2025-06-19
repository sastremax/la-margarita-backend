import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { passportWithPolicy } from '../middlewares/authPolicy.middleware.js';

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:pid', productController.getProductById);
router.post('/', passportWithPolicy(['admin']), productController.createProduct);
router.put('/:pid', passportWithPolicy(['admin']), productController.updateProduct);
router.delete('/:pid', passportWithPolicy(['admin']), productController.deleteProduct);

export default router;
