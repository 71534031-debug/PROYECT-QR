import { spawn } from 'child_process';
import http from 'http';

const VITE_PORT = 5173;
const MAX_WAIT = 30000;
const POLL_INTERVAL = 500;

function waitForUrl(url, timeout) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    function check() {
      http.get(url, (res) => {
        if (res.statusCode === 200) resolve();
        else retry();
      }).on('error', retry);
    }
    function retry() {
      if (Date.now() - start > timeout) reject(new Error(`Timeout waiting for ${url}`));
      else setTimeout(check, POLL_INTERVAL);
    }
    check();
  });
}

async function main() {
  console.log('Starting Vite dev server...');
  const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  try {
    await waitForUrl(`http://localhost:${VITE_PORT}`, MAX_WAIT);
    console.log('Vite server ready, running Cypress...');
    const cypress = spawn('npx', ['cypress', 'run'], { stdio: 'inherit', shell: true });
    cypress.on('close', (code) => {
      vite.kill();
      process.exit(code);
    });
  } catch (err) {
    console.error(err.message);
    vite.kill();
    process.exit(1);
  }
}

main();