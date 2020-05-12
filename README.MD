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


