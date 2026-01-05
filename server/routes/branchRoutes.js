import express from 'express';

import { getBranchesPublic } from '../controllers/branchController.js';

const router = express.Router();

router.get('/', getBranchesPublic);

export default router;
