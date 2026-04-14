const { execSync } = require('child_process');
try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('Build successful');
} catch (error) {
    console.error(error.stdout.toString());
    console.error(error.stderr.toString());
}
