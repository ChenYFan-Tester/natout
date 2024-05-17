const NatterPath = './natter.py';
import { spawn } from 'child_process';
import fs from 'fs';
const NATConfig = JSON.parse(fs.readFileSync('./config.json', "utf-8"))
const templeConfig = JSON.parse(fs.readFileSync('./template.json', "utf-8"))
const logger = (type, id, message) => {
    let color;
    switch (type) {
        case 'info':
            color = '\x1b[32m';
            break;
        case 'error':
            color = '\x1b[31m';
            break;
        case 'warning':
            color = '\x1b[33m';
            break;
        default:
            color = '\x1b[37m';
    }
    console.log(color, `[${id}] ${message}`);
}
logger('info', 'server', 'Starting server...');
for (var forwarder of NATConfig) {
    if (forwarder.type === "tcp") {
        if (forwarder.direct) templeConfig.open_port.tcp.push(`0.0.0.0:${forwarder.inner_port}`)
        else templeConfig.forward_port.tcp.push(`127.0.0.1:${forwarder.inner_port}`)
    } else if (forwarder.type === "udp") {
        if (forwarder.direct) templeConfig.open_port.udp.push(`0.0.0.0:${forwarder.inner_port}`)
        else templeConfig.forward_port.udp.push(`127.0.0.1:${forwarder.inner_port}`)
    } else {
        logger('error', 'server', `Unknown forward type: ${forwarder.type}`);
    }
}
fs.writeFileSync('./temp/config.json', JSON.stringify(templeConfig, null, 4))
fs.copyFileSync('./config.json', './temp/data.json')
const c = spawn('python3', [
    NatterPath,
    "-c",
    "./temp/config.json"
])
c.stdout.on('data', (data) => {
    console.log(data.toString());
})
c.stderr.on('data', (data) => {
    console.error(data.toString());
});

