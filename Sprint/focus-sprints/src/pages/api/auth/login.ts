import { NextApiRequest, NextApiResponse } from 'next';
import { createJwtToken, setJwtCookie } from '../../../lib/auth';
import dbConnect from '../../../lib/db/db';
import User from '../../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Environment check:', {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set'
      });

      await dbConnect();
      console.log('Database connected successfully');
      
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user by email
      const user = await User.findOne({ email });
      console.log('User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      console.log('Checking password...');
      const isPasswordValid = await user.comparePassword(password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create JWT token with user's MongoDB _id
      const token = createJwtToken(user._id.toString());
      setJwtCookie(res, token);
      
      return res.status(200).json({ 
        message: 'Logged in successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error stack:', error.stack);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message, // Show error message in both dev and production for debugging
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        environment: process.env.NODE_ENV
      });
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
};
