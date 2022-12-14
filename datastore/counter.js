const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {

  return new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (err) {
        callback(null, 0);
      } else {
        resolve(callback(null, Number(fileData)));
      }
    });
  });


  // fs.readFile(exports.counterFile, (err, fileData) => {
  //   if (err) {
  //     callback(null, 0);
  //   } else {
  //     callback(null, Number(fileData));
  //   }
  // });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);

  return new Promise((resolve, reject) => {
    fs.writeFile(exports.counterFile, counterString, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        resolve(callback(null, counterString));
      }
    });
  });

};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {

  // writeCounter should only be exec. if readCounter is successful
  readCounter((err, result) => {
    if (err) {
      callback(null, 0);

    } else {
      counter = result + 1;
      writeCounter(counter, (err, result) => {
        if (err) {
          throw (err);
        } else {
          callback(null, zeroPaddedNumber(counter));
        }
      });
    }


  });

  //return zeroPaddedNumber(counter);
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
