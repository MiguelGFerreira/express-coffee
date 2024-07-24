import express from 'express';

import { getLoteById, getLotes } from '../controllers/lotes.js'

const router = express.Router();

router.get('/', getLotes);
router.get('/:idlote', getLoteById);

export default router;