const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
const cwd = path.join(__dirname, 'android');

const child = spawn(gradlew, args, { 
  stdio: 'inherit', 
  cwd,
  shell: true 
});

child.on('exit', code => {
  process.exit(code);
});
