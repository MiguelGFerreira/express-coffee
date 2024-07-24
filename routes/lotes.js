import express from 'express';

import { getLoteById, getLotes, postLote } from '../controllers/lotes.js'

const router = express.Router();

router.get('/', getLotes);
router.get('/:idlote', getLoteById);
router.post('/:idlote', postLote)

export default router;