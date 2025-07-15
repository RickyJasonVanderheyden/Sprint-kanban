import { NextApiRequest, NextApiResponse } from 'next';
import { createJwtToken, setJwtCookie } from '../../lib/auth';
import dbConnect from '../../lib/db/db';
import User from '../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password // WARNING: This stores plain text password - use bcryptjs in production!
      });

      // Create JWT token with user's MongoDB _id
      const token = createJwtToken(newUser._id.toString());
      setJwtCookie(res, token);
      
      return res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}