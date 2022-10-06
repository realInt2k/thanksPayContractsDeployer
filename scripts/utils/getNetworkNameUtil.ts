
export const getNetworkName = (process: any) => {
    const args = process.argv; // ["networkName=ganache"]
    // find an arg which starts with '--networkName'
    const arg = args.find((arg: string) => arg.startsWith('--networkName'));
    const networkName = arg.split("=")[1]; // "ganache"
    console.log(networkName, process.argv);
    return networkName;
}