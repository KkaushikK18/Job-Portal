import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // 👇 No hashing here — let the pre-save hook do it
    const newUser = await User.create({
      name,
      email: email.trim(),
      password: password.trim(),
      role,
    });

    const token = generateToken(newUser);
    const { password: _, ...userData } = newUser.toObject();

    res.status(201).json({ token, user: userData });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  let { email, password } = req.body;
  email = email?.trim();
  password = password?.trim();

  console.log('Login attempt:', { email, password });

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    console.log('🔐 Password match:', isMatch);

    if (!isMatch) {
      console.log('❌ Password incorrect');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const { password: _, ...userData } = user.toObject();

    console.log('✅ Login successful:', userData.email);
    res.status(200).json({ token, user: userData });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
