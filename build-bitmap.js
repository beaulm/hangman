const fs = require('fs');

//Cache all possible binary numbers up to 31 bits

//Initialize our bitmap
let bitmap = [];

//For each bit up to 31
for(let bits=0; bits<=31; bits++) {

  //Add a new array to our bitmap
  bitmap.push([]);

  //For every possible binary number of the current length
  for(let num=0; num<Math.pow(2,bits)-1; num++) {

    //Get the current binary number
    let binary = num.toString(2);

    //Pad it with zero's to the appropriate length
    let padded = ('0000000000000000000000000000000'.substr(binary.length)+binary).substr(bits);

    //Add it to our bitmap
    bitmap[bits].push(padded);

  }

}

fs.writeFile('bitmap.js', JSON.stringify(bitmap), (err) => {
  if (err) throw err;
  console.log('Bitmap created!');
});
