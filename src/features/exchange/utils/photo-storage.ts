import { Directory, File, Paths } from 'expo-file-system';

const FOLDER = 'item-photos';

/** Copies a picked photo into the app's documents so it survives relaunch; returns its file name. */
export function savePickedPhoto(uri: string): string {
  const dir = new Directory(Paths.document, FOLDER);
  dir.create({ idempotent: true, intermediates: true });
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase() ?? 'jpg';
  const name = `P${Date.now()}.${ext.length <= 4 ? ext : 'jpg'}`;
  new File(uri).copy(new File(dir, name));
  return name;
}

/** Stored by file name, not full path: the app's documents path can change between installs. */
export function uploadedPhotoURI(name: string): string | null {
  if (!name) return null;
  const file = new File(Paths.document, FOLDER, name);
  return file.exists ? file.uri : null;
}
