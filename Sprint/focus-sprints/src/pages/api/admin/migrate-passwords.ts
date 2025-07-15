import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/db/db';
import User from '../../../lib/db/User';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await dbConnect();
      
      const { action } = req.body;
      
      if (action === 'fix_passwords') {
        // Get all users
        const users = await User.find({});
        
        let fixedCount = 0;
        
        for (const user of users) {
          // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, etc.)
          if (!user.password.startsWith('$2')) {
            // Password is plain text, hash it
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            
            // Update user with hashed password
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            fixedCount++;
          }
        }
        
        return res.status(200).json({
          message: `Fixed ${fixedCount} users with plain text passwords`,
          totalUsers: users.length,
          fixedUsers: fixedCount
        });
      }
      
      if (action === 'list_users') {
        const users = await User.find({}, { password: 0 });
        return res.status(200).json({
          users: users.map(user => ({
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
          }))
        });
      }
      
      if (action === 'delete_all') {
        await User.deleteMany({});
        return res.status(200).json({ message: 'All users deleted' });
      }
      
      return res.status(400).json({ message: 'Invalid action' });
      
    } catch (error: any) {
      console.error('Migration error:', error);
      return res.status(500).json({ 
        message: 'Error',
        error: error.message
      });
    }
  }
  
  res.status(405).json({ message: 'Method Not Allowed' });
}
