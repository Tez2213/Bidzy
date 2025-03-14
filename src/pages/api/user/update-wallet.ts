import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { walletAddress } = req.body;
    
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { walletAddress },
    });

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update wallet error:', error);
    return res.status(500).json({ error: 'Failed to update wallet address' });
  }
}