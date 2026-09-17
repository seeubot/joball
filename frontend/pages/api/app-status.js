export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    success: true,
    data: {
      maintenanceMode: true,
      forceUpdate: false,
      latestVersion: '1.0.0',
      minSupportedVersion: '1.0.0',
      updateMessage: '',
      maintenanceMessage: '',
    }
  });
}
