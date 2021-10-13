const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw (err);
    } else {
      var filepath = `${exports.dataDir}/${id}.txt`;
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          throw (err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {


  var filepath = `${exports.dataDir}`;

  var promisesArr = [];

  var fileTitles = new Promise((resolve, reject) => {
    fs.readdir(filepath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  var fileText = new Promise((resolve, reject) => {
    var newFilePath = `${filepath}/${title}`;
    fs.readFile(newFilePath, (err, text) => {
      if (err) {
        reject(err);
      } else {
        resolve({ id: title, text: text });
      }
    });
  });

  return Promise.all(promisesArr);

  /*
  // filepath defined
  var filepath = `${exports.dataDir}`;
  // retrieving array of filenames in directory
  fs.readdir(filepath, (err, files) => {
    if (err) {
      throw (err);
    } else {
      // upon successful retrieval, creating new array with appropriately filled in objects
      var newFiles = files.map((file) => {
        return { id: file.slice(0, 5), text: file.slice(0, 5) };
      });
      // calling callback on new files
      callback(null, newFiles);
    }
  });
  */

};

exports.readOne = (id, callback) => {
  var filepath = `${exports.dataDir}/${id}.txt`;
  fs.readFile(filepath, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });

};

exports.update = (id, text, callback) => {

  // var filepath = `${exports.dataDir}/${id}.txt`;
  var filepath = `${exports.dataDir}`;

  fs.readdir(filepath, (err, files) => {
    if (err) {
      throw (err);
    } else {
      var foundIt = false;
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].substr(0, 5);
        if (fileName === id) {
          foundIt = true;
        }
      }
      if (foundIt === true) {

        var filepathExists = `${exports.dataDir}/${id}.txt`;
        fs.writeFile(filepathExists, text, (err) => {
          if (err) {
            throw (err);
          } else {
            callback(null, { id, text });
          }
        });

      } else {
        callback(new Error(`No item with id: ${id}`));
      }

    }

  });

};

exports.delete = (id, callback) => {

  var filepath = `${exports.dataDir}`;

  fs.readdir(filepath, (err, files) => {
    if (err) {
      throw (err);
    } else {
      var foundIt = false;
      for (var i = 0; i < files.length; i++) {
        var fileName = files[i].substr(0, 5);
        if (fileName === id) {
          foundIt = true;
        }
      }
      if (foundIt === true) {

        var filepathExists = `${exports.dataDir}/${id}.txt`;
        fs.unlink(filepathExists, (err) => {
          if (err) {
            throw (err);
          } else {
            callback();
          }
        });

      } else {
        callback(new Error(`No item with id: ${id}`));
      }

    }

  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
