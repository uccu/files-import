
[![Build Status](https://www.travis-ci.org/uccu/files-import.svg?branch=master)](https://www.travis-ci.org/uccu/files-import)
[![Maintainability](https://api.codeclimate.com/v1/badges/ee3a1bd63688f36b0074/maintainability)](https://codeclimate.com/github/uccu/files-import/maintainability)
[![codecov](https://codecov.io/gh/uccu/files-import/branch/master/graph/badge.svg)](https://codecov.io/gh/uccu/files-import)
[![GitHub issues](https://img.shields.io/github/issues/uccu/files-import)](https://github.com/uccu/files-import/issues)
![GitHub](https://img.shields.io/github/license/uccu/files-import)

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
        file.folders.join('/') + '|' + path.basename(file.path)
    )
});

# |Cfile
# |Dfile
# Afolder|Afile
# Afolder|Bfile
# Bfolder/Cfolder|Efile


factory
.exclude('Cfile')
.exclude('Dfile')
.include('A', Factory.PATH_TYPE.FOLDER)
.exclude('Afile', Factory.PATH_TYPE.FILE)
.map(file => {
    console.log( path.basename(file.path) );
});


# Bfile
```


### INCLUDE
```javascript
// fac.include = 'folder';
// fac.include = /folder/;
// fac.include('folder');
// fac.include(/folder/);
factory.include(function(f) {
    return f.path.indexOf('folder') !== -1;
}).map(file => {
    console.log(
        file.folders.join('/') + '|' + path.basename(file.path)
    )
});

# Afolder|Afile
# Afolder|Bfile
# Bfolder/Cfolder|Efile
```

### EXCLUDE
```javascript
// fac.exclude = 'folder';
// fac.exclude = /folder/;
// fac.exclude('folder');
// fac.exclude(/folder/);
factory.exclude(function(f) {
    return f.path.indexOf('folder') !== -1;
}).map(file => {
    console.log(
        file.folders.join('/') + '|' + path.basename(file.path)
    )
});

# |Cfile
# |Dfile
```

### SUGGESTION
```javascript
/** wrong */
factory.map(function() {
    if(file.folders[0] === 'test') return;
    // other code
});

/** ok */
factory.exclude(f => {
    return f.folders[0] === 'test';
}).map(function() {
    // other code
});

/** traverse files in folder exclude folder inside */
factory.exclude(f => {
    return f.folders[0];
}).map(function() {
    // other code
});

# |Cfile
# |Dfile
```
