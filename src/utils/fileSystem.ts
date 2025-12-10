
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

/**
 * Saves a file with "Auto-save" to specific folder logic for Mobile.
 * 
 * Mobile (Android/iOS):
 * - Writes directly to 'Download/slyke_attend/' (using Directory.ExternalStorage).
 * - "Documents" used as fallback.
 * 
 * Desktop (Browser):
 * - Traditional "Download" to default folder.
 */
export async function saveFile(
    blob: Blob,
    filename: string,
    _description: string,
    _mimeType: string,
    _extensions: Record<string, string[]>
): Promise<string> {
    const isNative = Capacitor.isNativePlatform();

    if (isNative) {
        // Declare variable outside try/catch for scope access
        let base64Data: string;
        try {
            base64Data = await blobToBase64(blob);
        } catch (e) {
            console.error('Failed to convert blob', e);
            throw new Error('Failed to prepare file data.');
        }

        try {
            // Define folder: Download/slyke_attend
            const folder = 'Download/slyke_attend';
            const path = `${folder}/${filename}`;

            // 1. Ensure directory exists
            try {
                await Filesystem.mkdir({
                    path: folder,
                    directory: Directory.ExternalStorage,
                    recursive: true
                });
            } catch (e) {
                // Ignore if exists
            }

            // 2. Write file
            await Filesystem.writeFile({
                path: path,
                data: base64Data,
                directory: Directory.ExternalStorage,
                encoding: Encoding.UTF8
            });

            return `Saved to Internal Storage/${folder}/${filename}`;

        } catch (e) {
            console.error('Filesystem write failed', e);
            // Fallback: Try Documents if ExternalStorage fails
            try {
                const fallbackFolder = 'slyke_attend';
                const fallbackPath = `${fallbackFolder}/${filename}`;
                await Filesystem.mkdir({ path: fallbackFolder, directory: Directory.Documents, recursive: true }).catch(() => { });
                await Filesystem.writeFile({
                    path: fallbackPath,
                    data: base64Data, // Now accessible
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8
                });
                return `Saved to Documents/${fallbackFolder}/${filename}`;
            } catch (fallbackErr) {
                console.warn('Fallback failed', fallbackErr);
                throw new Error('Failed to auto-save to device storage.');
            }
        }
    } else {
        // Desktop / Browser Fallback -> "Downloads"
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return 'Saved to default Downloads folder';
    }
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Remove "data:application/json;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
