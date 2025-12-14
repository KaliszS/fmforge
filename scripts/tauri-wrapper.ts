import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const args = process.argv.slice(2);
const rootDir = resolve(import.meta.dir, '..');

// Sync Version Logic
const pkgPath = join(rootDir, 'package.json');
const tauriConfPath = join(rootDir, 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = join(rootDir, 'src-tauri', 'Cargo.toml');

try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const version = pkg.version;

    // Update tauri.conf.json
    const tauriConf = JSON.parse(readFileSync(tauriConfPath, 'utf-8'));
    if (tauriConf.version !== version) {
        tauriConf.version = version;
        writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));
        console.log(`[FM Forge] Updated tauri.conf.json to version ${version}`);
    }

    // Update Cargo.toml
    let cargoToml = readFileSync(cargoTomlPath, 'utf-8');
    const versionRegex = /^version = ".*"/m;
    if (cargoToml.match(versionRegex)) {
        const currentCargoVersion = cargoToml.match(versionRegex)?.[0];
        if (currentCargoVersion !== `version = "${version}"`) {
            cargoToml = cargoToml.replace(versionRegex, `version = "${version}"`);
            writeFileSync(cargoTomlPath, cargoToml);
            console.log(`[FM Forge] Updated Cargo.toml to version ${version}`);
        }
    }
} catch (e) {
    console.error("[FM Forge] Version sync failed:", e);
}

// Run Tauri CLI
// We use 'bun x tauri' to ensure we use the local or cached tauri CLI
const tauri = Bun.spawn(["bun", "x", "tauri", ...args], {
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
});

await tauri.exited;
process.exit(tauri.exitCode);
