const { exec } = require('child_process');
const net = require('net');

function isPortInUse(port) {
  return new Promise((resolve) => {
    const client = new net.Socket();
    client.once('connect', () => {
      client.destroy();
      resolve(true);
    });
    client.once('error', () => {
      resolve(false);
    });
    client.connect(port, '127.0.0.1');
  });
}

async function findPidOnPort(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (err || !stdout) return resolve(null);
      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const localAddr = parts[1] || '';
        if (localAddr.includes(`:${port}`)) {
          const pid = parts[4];
          if (pid && pid !== '0') return resolve(parseInt(pid));
        }
      }
      resolve(null);
    });
  });
}

async function main() {
  const PORT = 3002;
  const pid = await findPidOnPort(PORT);
  if (pid) {
    console.log(`Killing process ${pid} on port ${PORT}...`);
    exec(`taskkill /PID ${pid} /F`, (err) => {
      if (err) console.error('Kill failed:', err.message);
      else console.log('Killed.');
      setTimeout(startServer, 1000);
    });
  } else {
    console.log('No process on port', PORT);
    startServer();
  }
}

function startServer() {
  console.log('Starting server-api...');
  exec('node src/index.js', { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) console.error('Server error:', err.message);
    console.log(stdout, stderr);
  });
}

main();
