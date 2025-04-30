const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const steps = [
    { cmd: 'gulp clean', label: '🔄 Cleaning up...' },
];

const spinnerFrames = ['|', '/', '-', '\\'];
let frame = 0;
let interval;

const startSpinner = (text) => {
    process.stdout.write(`\n${text}\n`);
    interval = setInterval(() => {
        process.stdout.write(`\r${spinnerFrames[frame++ % spinnerFrames.length]} Processing...`);
    }, 100);
};

const stopSpinner = () => {
    clearInterval(interval);
    process.stdout.write('\r✅ Complete                 \n');
};

const runCommand = (command, label) => {
    return new Promise((resolve) => {
        startSpinner(label);

        const childProcess = exec(command, { maxBuffer: 1024 * 1024 });

        let stdout = '';
        let stderr = '';

        childProcess.stdout.on('data', (data) => {
            stdout += data;
        });

        childProcess.stderr.on('data', (data) => {
            stderr += data;
        });

        childProcess.on('close', (code) => {
            stopSpinner();
            if (code !== 0) console.log('\n⚠️  Command completed with warnings');
            resolve(0);
        });
    });
};

async function runClean() {
    try {
        const dirPath = path.resolve('./sharepoint');
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
        for (const step of steps) {
            await runCommand(step.cmd, step.label);
        }
        console.log('\n✅ Cleaning Completed!🎉');
    } catch (err) {
        console.error(`\n❌ Error: ${err.message}`);
        process.exit(1);
    }
}

runClean();