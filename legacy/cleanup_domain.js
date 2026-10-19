const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const DOMAIN_REGEX = /https?:\/\/christa-jarisch\.at/g;
const ESCAPED_DOMAIN_REGEX = /https?:\\\/\\\/christa-jarisch\.at/g;
const ENCODED_DOMAIN_REGEX = /https%3A%2F%2Fchrista-jarisch\.at/g;
const WWW_REGEX = /www\.christa-jarisch\.at/g; // Text content usually
const EXCLUDE_DIRS = ['node_modules', '.git', '.github'];

function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (EXCLUDE_DIRS.includes(file)) continue;
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, fileList);
        } else {
            // Process HTML, CSS, JS, JSON files
            if (['.html', '.css', '.js', '.json'].includes(path.extname(file))) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

function cleanup() {
    console.log('Replacing domain references...');
    const files = getAllFiles(ROOT_DIR);
    let count = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf-8');
        let modified = false;

        // Replace standard URLs
        if (DOMAIN_REGEX.test(content)) {
            content = content.replace(DOMAIN_REGEX, ''); // Replace with empty string, leaving following / usually
            modified = true;
        }

        // Replace escaped URLs (for JSON)
        if (ESCAPED_DOMAIN_REGEX.test(content)) {
            content = content.replace(ESCAPED_DOMAIN_REGEX, '');
            modified = true;
        }

        if (ENCODED_DOMAIN_REGEX.test(content)) {
            content = content.replace(ENCODED_DOMAIN_REGEX, '');
            modified = true;
        }

        if (WWW_REGEX.test(content)) {
            // For text content like "Internet: www.christa-jarisch.at", we might want to keep it or change it.
            // But if it's a link, we want to remove it. 
            // The user asked to remove "". 
            // "www.christa-jarisch.at" references might be text.
            // I'll replace it with a placeholder or just remove it if it looks like a link data.
            // Let's replace with nothing for now to be consistent, or just leave it if it's text.
            // Actually, for "Internet: www...", removing it leaves "Internet: ".
            // I will skip WWW regex for now unless it's inside a URL context, which is hard to detect with regex.
            // But the user specifically mentioned "".
            // Let's sticking to the requested scope.
            
            // Wait, grep showed "Internet: www.christa-jarisch.at". This is text. 
            // If I change it, I should change it to something meaningful or just leaving it is fine if it's "text".
            // But for correctness on a migrated site, it should probably point to the new domain. 
            // Since I don't know the new domain, I will leave the text "www.christa-jarisch.at" alone as it's likely a label.
            // However, the `oembed` links were the main issue.
        }

        if (modified) {
            // Fix double slash issues if they arise (e.g. href="//foo") which is valid protocol relative, 
            // but if we replaced "https://domain.com/" with "/" we might get "//" if original was "https://domain.com/foo".
            // Wait, "https://domain.com/foo" -> "/foo". 
            // "https://domain.com" -> "".
            // If original was "https://domain.com" -> "" (empty).
            
            // Corner case: `href=""` -> `href=""`.
            
            console.log(`Updated: ${path.relative(ROOT_DIR, file)}`);
            fs.writeFileSync(file, content);
            count++;
        }
    }
    console.log(`Cleanup complete. Modified ${count} files.`);
}

cleanup();
