import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db/db';
import User from '../../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { action, email, password } = req.body;
      
      if (action === 'check_user') {
        const user = await User.findOne({ email });
        return res.status(200).json({
          userExists: !!user,
          userPassword: user ? user.password : null,
          passwordLength: user ? user.password.length : 0
        });
      }
      
      if (action === 'create_test_user') {
        // Delete existing test user first
        await User.deleteOne({ email });
        
        // Create new test user with hashed password
        const testUser = await User.create({
          username: 'testuser',
          email: email,
          password: password
        });
        
        return res.status(201).json({
          message: 'Test user created',
          user: {
            id: testUser._id,
            username: testUser.username,
            email: testUser.email
          }
        });
      }
      
      if (action === 'delete_all_users') {
        await User.deleteMany({});
        return res.status(200).json({ message: 'All users deleted' });
      }
      
    } catch (error: any) {
      console.error('Debug error:', error);
      return res.status(500).json({ 
        message: 'Error',
        error: error.message
      });
    }
  }
  
  res.status(405).json({ message: 'Method Not Allowed' });
}
