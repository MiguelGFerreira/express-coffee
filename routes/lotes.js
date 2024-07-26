import express from 'express';

import { getLoteById, getLotes, postLote, patchLote } from '../controllers/lotes.js'

const router = express.Router();

router.get('/', getLotes);
router.get('/:idlote', getLoteById);
router.post('/:idlote', postLote);
router.patch('/:clas_id', patchLote);

export default router;