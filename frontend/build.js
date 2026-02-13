import fs from 'node:fs';
import gracefulFs from 'graceful-fs';
import { build } from 'vite';

// Patch fs with graceful-fs to handle EMFILE errors
gracefulFs.gracefulify(fs);

console.log('Starting build with graceful-fs...');

try {
    await build();
    console.log('Build completed successfully.');
} catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
}
