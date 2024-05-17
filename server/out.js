import fs from 'fs';
import { spawn } from 'child_process';
let NATConfig = JSON.parse(fs.readFileSync('./temp/data.json', "utf-8"))
const [protocol, inner_ip, inner_port, outer_ip, outer_port] = process.argv.slice(2);
console.log(protocol, inner_ip, inner_port, outer_ip, outer_port)
const id = NATConfig.findIndex(config => config.inner_port === Number(inner_port) && config.type === protocol)
if (id === -1) throw ('Unknown Forward!')
NATConfig[id].outer_ip = outer_ip;
NATConfig[id].outer_port = Number(outer_port);
NATConfig[id].status = "success";
fs.writeFileSync('./temp/data.json', JSON.stringify(NATConfig, null, 4))
fs.copyFileSync('./temp/data.json', '../static/config.json')
if (NATConfig[id].script !== undefined) {
    console.log("Script Found!")
    //const script_process = new ChildProcess();
    spawn('bash', [NATConfig[id].script, inner_ip, inner_port, outer_ip, outer_port])
}

