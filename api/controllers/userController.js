import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const saltRounds = 10;


const generateToken = (userData) => {
  return jwt.sign({ id: userData._id },  process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ name: req.body.name });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      name: req.body.name,
      password: hashedPassword,
      address: req.body.address,
    });

    if (req.file) {
      newUser.image = req.file.path;
    }

    await newUser.save();

    const token = generateToken(newUser);

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const viewProfile = async (req, res) => {
  try {
    const user = req.user;
    const { password, ...userData } = user._doc;
    res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;

    const updates = {
      name: req.body.name || user.name,
      address: req.body.address || user.address,
    };

    if (req.body.password) {
      updates.password = await bcrypt.hash(req.body.password, saltRounds);
    }

    if (req.file) {
      updates.image = req.file.path;
    }

    await User.findByIdAndUpdate(user._id, updates);

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const user = req.user;

    await User.findByIdAndDelete(user._id);

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
