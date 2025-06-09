import { Router } from 'express';
import { auth } from '../../middleware/api/auth.js';
import { patchProfileValidator } from '../../middleware/api/validators/user.validator.js';
import { deleteProfile, getProfile, patchProfile } from '../../controllers/api/user.controller.js';

const apiUserRouter = Router();

// GET /users/profile (only authorized users)
apiUserRouter.get('/profile', auth, getProfile);

// PATCH /users/profile/edit (only authorized users)
apiUserRouter.patch('/profile', auth, patchProfileValidator, patchProfile);

// DELETE /users/profile (only authorized users)
apiUserRouter.delete('/profile', auth, deleteProfile);

export default apiUserRouter;
