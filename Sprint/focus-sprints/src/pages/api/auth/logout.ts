import { NextApiRequest, NextApiResponse } from 'next';
import { clearJwtCookie } from '../../../lib/auth';

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    clearJwtCookie(res); // Clear the JWT cookie
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
};
