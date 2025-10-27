const fs = require('fs');
const path = require('path');

const lockfilePath = path.join(__dirname, '..', 'package-lock.json');

if (fs.existsSync(lockfilePath)) {
    const lock = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));

    const sharp = [
        'sharp',
        '@img/sharp-libvips-darwin-arm64',
        '@img/sharp-libvips-darwin-x64',
        '@img/sharp-libvips-linux-arm',
        '@img/sharp-libvips-linux-arm64',
        '@img/sharp-libvips-linux-s390x',
        '@img/sharp-libvips-linux-x64',
        '@img/sharp-libvips-linuxmusl-arm64',
        '@img/sharp-libvips-linuxmusl-x64',
        '@img/sharp-linux-arm',
        '@img/sharp-linux-arm64',
        '@img/sharp-linux-s390x',
        '@img/sharp-linux-x64',
        '@img/sharp-win32-ia32',
        '@img/sharp-win32-x64',
        '@img/sharp-wasm32'
    ];

    sharp.forEach(p => {
        if (lock.packages) {
            delete lock.packages[`node_modules/${p}`];
        }
        if (lock.dependencies) {
            delete lock.dependencies[p];
        }
    });

    function clean(o) {
        if (o && typeof o === 'object') {
            for (const k in o) {
                if (k === 'optionalDependencies' && o[k]) {
                    sharp.forEach(p => delete o[k][p]);
                } else if (typeof o[k] === 'object') {
                    clean(o[k]);
                }
            }
        }
    }

    clean(lock);

    fs.writeFileSync(lockfilePath, JSON.stringify(lock, null, 2), 'utf8');
    console.log('[OK] Removed Sharp packages to maintain license compliance');
}
