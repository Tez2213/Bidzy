import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, walletAddress } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { walletAddress },
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Failed to update wallet address:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}