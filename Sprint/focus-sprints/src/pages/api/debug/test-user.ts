import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db/db';
import User from '../../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect();
      
      // Get all users (for debugging - remove in production)
      const users = await User.find({}, { password: 0 }); // Exclude password field
      
      return res.status(200).json({ 
        message: 'Users retrieved successfully',
        users: users,
        count: users.length
      });
    } catch (error: any) {
      console.error('Debug error:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      
      // Create test user
      const testUser = await User.create({
        username: 'testuser',
        email: email,
        password: password
      });
      
      return res.status(201).json({ 
        message: 'Test user created successfully',
        user: {
          id: testUser._id,
          username: testUser.username,
          email: testUser.email
        }
      });
    } catch (error: any) {
      console.error('Test user creation error:', error);
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
