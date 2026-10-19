const fs = require('fs-extra');
const path = require('path');
const https = require('https');

const ROOT_DIR = __dirname;
const HOME_FILE = path.join(ROOT_DIR, 'index.html');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

if (!fs.existsSync(HOME_FILE)) {
    console.error('index.html not found');
    process.exit(1);
}

const content = fs.readFileSync(HOME_FILE, 'utf-8');

// Regex to find /uploads/... paths
// Matches /uploads/ followed by valid path chars
const UPLOADS_REGEX = /\/uploads\/([a-zA-Z0-9_\-\.\/]+)/g;

const matches = [...content.matchAll(UPLOADS_REGEX)];
const uniquePaths = [...new Set(matches.map(m => m[0]))];

console.log(`Found ${uniquePaths.length} references to /uploads/`);

async function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                file.close();
                fs.unlinkSync(destPath); // Delete partial
                resolve(false);
                return;
            }
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlinkSync(destPath);
            resolve(false);
        });
    });
}

async function run() {
    for (const relPath of uniquePaths) {
        // relPath is like "/uploads/2016/05/wheat-background.jpg"
        // Local path: c:/dev/.../uploads/2016/05/wheat-background.jpg
        // Remote URL: https://christa-jarisch.at/wp-content/uploads/2016/05/wheat-background.jpg
        
        // Remove leading slash for path.join
        const safePath = relPath.startsWith('/') ? relPath.slice(1) : relPath;
        const localDest = path.join(ROOT_DIR, safePath);
        
        if (fs.existsSync(localDest)) {
            // console.log(`Exists: ${relPath}`);
            continue;
        }
        
        console.log(`Missing: ${relPath}`);
        
        // Reconstruct remote URL
        // We know we mapped /uploads/ from /wp-content/uploads/
        // remove '/uploads/' from start of safePath (which is "uploads/...")
        const subPath = safePath.replace('uploads/', '');
        const remoteUrl = `https://christa-jarisch.at/wp-content/uploads/${subPath}`;
        
        // Ensure directory exists
        const dir = path.dirname(localDest);
        fs.ensureDirSync(dir);
        
        console.log(`Downloading from ${remoteUrl}...`);
        const success = await downloadFile(remoteUrl, localDest);
        if (success) {
            console.log('Success.');
        } else {
            console.error('Failed.');
        }
    }
    console.log('Done.');
}

run();
