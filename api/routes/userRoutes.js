import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import {
  registerUser,
  loginUser,
  viewProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/userController.js';
import {
  validateRegistration,
  validateLogin,
  validateUpdate,
} from '../middleware/validationMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const customFilename = (req, file, cb) => {
  const uniqueFilename = uuidv4();
  const fileExtension = file.originalname.split('.').pop();
  cb(null, `${uniqueFilename}.${fileExtension}`);
};

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: customFilename,
  limits: { fileSize: 1024 * 1024 * 5 },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/register', upload.single('image'), validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/profile', authenticateToken, viewProfile);
router.put('/profile', upload.single('image'), authenticateToken, validateUpdate, updateProfile);
router.delete('/profile', authenticateToken, deleteProfile);

function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token verification failed' });
    }

    req.user = await User.findOne({id:user._id});
    next();
  });
}

export default router;
