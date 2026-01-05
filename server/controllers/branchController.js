import { asyncHandler } from '../utils/asyncHandler.js';
import Branch from '../models/branchModel.js';

export const getBranchesPublic = asyncHandler(async (_req, res) => {
  const branches = await Branch.find().sort({ createdAt: -1 });
  res.json({ branches });
});
