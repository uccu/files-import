'use strict';

const path = require('path')
const Fac = require('..')
const fac = new Fac(path.join(__dirname, '..'));

fac.map(function(file) {
    if (['.git', '.vscode'].indexOf(file.paths[0]) !== -1) return;
    console.log(path.join(file.paths.join('/'), path.basename(file.path)));
})