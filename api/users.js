// Vercel API route for user-related functionality
export default async function handler(req, res) {
  // Handle different HTTP methods
  switch (req.method) {
    case 'GET':
      // Return sample user data
      res.status(200).json({ id: 1, name: 'Sample User', wins: 0, losses: 0 });
      break;
      
    case 'POST':
      // Process user creation/update
      const { name, telegramId } = req.body;
      if (!name || !telegramId) {
        return res.status(400).json({ error: 'Name and Telegram ID are required' });
      }
      
      // In a real implementation, you would connect to a database here
      res.status(201).json({ id: Date.now(), name, telegramId, wins: 0, losses: 0 });
      break;
      
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}