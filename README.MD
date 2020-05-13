
[![Build Status](https://www.travis-ci.org/uccu/files-import.svg?branch=master)](https://www.travis-ci.org/uccu/files-import)
[![Maintainability](https://api.codeclimate.com/v1/badges/ee3a1bd63688f36b0074/maintainability)](https://codeclimate.com/github/uccu/files-import/maintainability)
[![codecov](https://codecov.io/gh/uccu/files-import/branch/master/graph/badge.svg)](https://codecov.io/gh/uccu/files-import)

### LICENSE
MIT

### GOAL
Traverse all files in a folder

### INSTALL
```javscript
npm i files-import
```

### HOW TO USE
```javascript
#   Afolder
#    ├ Afile
#    └ Bfile
#   Bfolder
#    └ Cfolder
#       └ Efile
#   Cfile
#   Dfile

const path = require('path');
const Factory = require('files-import');
const factory = new Factory('myFolder');
factory.map(file => {
    console.log(
        file.paths.join('/') + '|' + path.basename(file.path)
    )
});

# |Cfile
# |Dfile
# Afolder|Afile
# Afolder|Bfile
# Bfolder/Cfolder|Efile
```


