'use strict';

const path = require('path');
const Factory = require('files-import');
const factory = new Factory('test/testFolder');
factory.map(file => {
    console.log(
        file.paths.join('/') + '|' + path.basename(file.path) 
    )
});