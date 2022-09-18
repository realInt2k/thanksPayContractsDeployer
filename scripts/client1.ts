import { createClient } from 'redis';

const client = createClient({
  socket: {
    port: 6969
  }
});

client.on('error', async (err) => {
  console.log("server is down or something");
  await client.connect();
});

async function main() {
  await client.connect();
  //await client.del('noderedis:jsondata');
  // await client.json.set('noderedis:jsondata', '$', {
  //   name: 'Roberta McDonald',
  //   pets: [
  //     {
  //     name: 'Rex',
  //     species: 'dog',
  //     age: 3,
  //     isMammal: true
  //     },
  //     {
  //     name: 'Goldie',
  //     species: 'fish',
  //     age: 2,
  //     isMammal: false
  //     }
  //   ]
  // });
  while(true) {
    try {
      let res = await client.json.get('noderedis:jsondata', {
        path: [
          '$.pets[1].name',
          '$.pets[1].age'
        ]
      });
      console.log(res);
    } catch(e) {
      console.log("server is down or something");
    }
  }
}

main().then(() => console.log(''));