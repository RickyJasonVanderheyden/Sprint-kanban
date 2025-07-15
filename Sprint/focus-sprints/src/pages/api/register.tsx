import { NextApiRequest, NextApiResponse } from 'next';
import { createJwtToken, setJwtCookie } from '../../lib/auth';
import dbConnect from '../../lib/db/db';
import User from '../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Registration - Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
      });

      await dbConnect();
      console.log('Database connected successfully for registration');
      
      const { username, email, password } = req.body;
      console.log('Registration attempt for email:', email, 'username:', username);

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        console.log('User already exists:', existingUser.email);
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }

      console.log('Creating new user...');
      // Create new user (password will be hashed automatically by the pre-save hook)
      const newUser = await User.create({
        username,
        email,
        password
      });
      console.log('User created successfully:', newUser._id);

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
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error stack:', error.stack);
      
      // Handle specific MongoDB errors
      if (error.code === 11000) {
        return res.status(400).json({ 
          message: 'User with this email or username already exists' 
        });
      }
      
      return res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}