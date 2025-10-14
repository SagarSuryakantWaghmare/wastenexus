import { mkdir, access, constants } from 'fs/promises';
import { join } from 'path';

export async function ensureDirectoryExists(dirPath: string) {
  try {
    await access(dirPath, constants.F_OK);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isAllowedFileType(
  filename: string, 
  allowedTypes: string[] = ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png']
): boolean {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
}

export function getFileTypeFromExtension(ext: string): 'image' | 'document' | 'spreadsheet' | 'other' {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const docTypes = ['pdf', 'doc', 'docx', 'txt'];
  const sheetTypes = ['xls', 'xlsx', 'csv'];

  if (imageTypes.includes(ext)) return 'image';
  if (docTypes.includes(ext)) return 'document';
  if (sheetTypes.includes(ext)) return 'spreadsheet';
  return 'other';
}

export function getFileIcon(ext: string): string {
  const type = getFileTypeFromExtension(ext);
  
  switch (type) {
    case 'image':
      return '🖼️';
    case 'document':
      return '📄';
    case 'spreadsheet':
      return '📊';
    default:
      return '📁';
  }
}
