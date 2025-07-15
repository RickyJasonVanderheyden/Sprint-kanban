import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/db/db';
import User from '../../lib/db/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Environment check
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      VERCEL: process.env.VERCEL ? 'Yes' : 'No'
    };
    
    console.log('Environment check:', envCheck);
    
    // Database connection check
    await dbConnect();
    
    // Simple database operation
    const userCount = await User.countDocuments();
    
    return res.status(200).json({
      status: 'OK',
      message: 'All systems operational',
      environment: envCheck,
      database: {
        connected: true,
        userCount: userCount
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    console.error('Health check failed:', error);
    
    return res.status(500).json({
      status: 'ERROR',
      message: 'System check failed',
      error: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
        VERCEL: process.env.VERCEL ? 'Yes' : 'No'
      },
      timestamp: new Date().toISOString()
    });
  }
}
