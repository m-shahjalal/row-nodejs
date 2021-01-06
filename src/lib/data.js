// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory for the data folder
lib.basedir = path.join(__dirname, '/../.data/');

// create data
lib.create = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDesc) => {
    if (!err && fileDesc) {
      // convert data to json
      const parsedData = JSON.stringify(data);

      // write to data to the file and close it
      fs.writeFile(fileDesc, parsedData, (err2) => {
        if (!err2) {
          fs.close(fileDesc, (err3) => {
            if (!err3) {
              callback('writing data successfully');
            } else {
              callback('Error closing file');
            }
          });
        } else {
          callback('Error writing to new file');
        }
      });
    } else {
      callback('could not create file');
    }
  });
};

// read data
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => callback(err, data));
};

// update data
lib.update = (dir, file, data, callback) => {
  // open the file
  fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDisc) => {
    if (!err && fileDisc) {
      const stringData = JSON.stringify(data);

      // transcrate file
      fs.ftruncate(fileDisc, (err2) => {
        if (!err2) {
          // write the fileDisc
          fs.writeFile(fileDisc, stringData, (err3) => {
            if (!err3) {
              // close the  file
              fs.close(fileDisc, (err4) => {
                if (!err4) {
                  callback('file updating successfully');
                } else {
                  callback('error closing file');
                }
              });
            } else {
              callback('writing error');
            }
          });
        } else {
          callback("Can't truncate the file");
        }
      });
    } else {
      callback('Error updating file may not exits');
    }
  });
};

// delete data
lib.delete = (dir, file, callback) => {
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback('delete file successfully');
    } else {
      callback('error while deleting file');
    }
  });
};
// export module
module.exports = lib;
