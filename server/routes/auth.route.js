import express from 'express';
import { Router } from 'express';
import { checkAuth, logIn, logOut, signUp, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signUp',signUp)
router.post('/logIn',logIn)
router.post('/logOut',logOut)
router.put('/updateProfile',protectRoute,updateProfile)
router.get('/checkAuth',protectRoute,checkAuth)

export default router;