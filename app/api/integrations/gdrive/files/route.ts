import { NextRequest, NextResponse } from 'next/server';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
}

interface GoogleDriveResponse {
  files: GoogleDriveFile[];
  nextPageToken?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get('folderId');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    const pageToken = searchParams.get('pageToken');
    const query = searchParams.get('query') || '';

    // In a real implementation, you would:
    // 1. Get the user's access token from your database
    // 2. Verify the user is authenticated
    // 3. Check if they have Google Drive integration enabled

    const accessToken = 'user_access_token'; // This would come from your database

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google Drive not connected' },
        { status: 401 }
      );
    }

    // Build query parameters
    const params = new URLSearchParams({
      pageSize: pageSize.toString(),
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink)',
      orderBy: 'modifiedTime desc',
    });

    // Add folder filter if specified
    if (folderId) {
      params.set('q', `'${folderId}' in parents and trashed=false`);
    } else {
      // Search for supported file types
      const supportedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/tiff',
        'audio/mpeg',
        'audio/wav',
        'audio/webm',
        'audio/mp4',
      ];

      const mimeTypeQuery = supportedTypes.map(type => `mimeType='${type}'`).join(' or ');
      const baseQuery = `(${mimeTypeQuery}) and trashed=false`;
      const finalQuery = query ? `${baseQuery} and name contains '${query}'` : baseQuery;
      params.set('q', finalQuery);
    }

    // Add page token if provided
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    // Fetch files from Google Drive
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Drive API error:', response.status, errorText);

      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Google Drive access expired. Please reconnect.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch files from Google Drive' },
        { status: 500 }
      );
    }

    const data: GoogleDriveResponse = await response.json();

    // Transform files to our format
    const files = data.files.map(file => ({
      id: file.id,
      name: file.name,
      type: getFileType(file.mimeType),
      mimeType: file.mimeType,
      size: file.size ? parseInt(file.size) : undefined,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
      downloadUrl: file.webContentLink,
      viewUrl: file.webViewLink,
    }));

    return NextResponse.json({
      files,
      nextPageToken: data.nextPageToken,
      hasMore: !!data.nextPageToken,
    });

  } catch (error) {
    console.error('Google Drive files error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Drive files' },
      { status: 500 }
    );
  }
}

// Helper function to determine file type category
function getFileType(mimeType: string): string {
  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
  if (mimeType.includes('image')) return 'image';
  if (mimeType.includes('audio')) return 'audio';
  if (mimeType.includes('sheet') || mimeType.includes('spreadsheet')) return 'spreadsheet';
  if (mimeType.includes('presentation')) return 'presentation';
  return 'other';
}

// POST endpoint to download/import a file
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileId, name, autoClassify = false } = body;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Get the user's access token from your database
    // 2. Download the file from Google Drive
    // 3. Store it in your storage (Supabase Storage)
    // 4. Create a document record in your database
    // 5. If autoClassify is true, run AI classification
    // 6. Update usage counters

    console.log('Importing Google Drive file:', { fileId, name, autoClassify });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'File imported successfully',
      documentId: 'doc_' + Math.random().toString(36).substring(7),
    });

  } catch (error) {
    console.error('Google Drive import error:', error);
    return NextResponse.json(
      { error: 'Failed to import file from Google Drive' },
      { status: 500 }
    );
  }
}