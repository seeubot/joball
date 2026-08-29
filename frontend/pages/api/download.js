export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Resource ID is required' });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Fetch resource info from backend
    const resourceResponse = await fetch(`${backendUrl}/api/resources/${id}`);
    const resourceResult = await resourceResponse.json();

    if (!resourceResult.success) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    const resource = resourceResult.data;

    // Fetch the file from backend
    const fileResponse = await fetch(`${backendUrl}${resource.fileUrl}`);
    
    if (!fileResponse.ok) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Get file buffer
    const fileBuffer = await fileResponse.arrayBuffer();

    // Set appropriate headers
    const contentTypes = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    res.setHeader('Content-Type', contentTypes[resource.fileType] || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${resource.fileName}"`);
    res.setHeader('Content-Length', fileBuffer.length);

    // Send file
    res.send(Buffer.from(fileBuffer));

    // Increment download count in background
    fetch(`${backendUrl}/api/resources/${id}/download-count`, {
      method: 'POST'
    }).catch(err => console.error('Error updating download count:', err));

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
}
