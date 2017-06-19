const redis = require('redis');
const client = redis.createClient();

//Cache all possible binary numbers up to 31 bits

//For each bit up to 31
for(let bits=0; bits<=31; bits++) {

  //For every possible binary number of the current length
  for(let num=0; num<Math.pow(2, bits)-1; num++) {

    //Get the current binary number
    let binary = num.toString(2);

    //Get the output length for substr
    let outputLength = bits*-1;

    //Pad it with zero's to the appropriate length
    let padded = ('0000000000000000000000000000000'.substr(binary.length)+binary).substr(outputLength);

    //Create a key to access our padded number with
    let key = num+'-'+bits;

    //Add it to our bitmap
    client.set(key, padded, redis.print);

  }

}

client.quit();
process.exit();
