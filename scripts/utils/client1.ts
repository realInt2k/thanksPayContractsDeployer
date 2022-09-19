import { createClient } from 'redis';

const client = createClient({
  socket: {
    port: 6379
  }
});

client.on('error', async (err) => {
  console.log("server is down or something");
  await client.connect();
});

client.on('connect', async () => {
  // run it every 5 seconds:
  setInterval(async () => {
    let avail = await client.json.get('transactions');
    if(!avail) {
      client.json.set('transactions', '.', []);
      console.log("just set transactions to []");
    } else {
      let trans:any = await client.json.get('transactions', {"path": "."});
      console.log(trans);
    }
  }, 2000);
});

async function main() {
  await client.connect();

}

main().then(() => console.log(''));