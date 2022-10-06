import { networkNameType } from '../types/networkNameType';

export const getNetworkName = (process: any): networkNameType=> {
    const args = process.argv; // ["networkName=ganache"]
    // find an arg which starts with '--networkName'
    const arg = args.find((arg: string) => arg.startsWith('--networkName'));
    if(arg === undefined) {
        console.log("networkName is undefined, be sure to use the correct syntax: 'networkName' with correct casing");
    }
    const networkName = arg.split("=")[1]; // "ganache"
    console.log(networkName, process.argv);
    return networkName;
}