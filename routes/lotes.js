import express from 'express';

import { getLotes } from '../controllers/lotes.js'

const router = express.Router();

router.get('/', getLotes);

export default router;