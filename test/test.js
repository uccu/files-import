'use strict';

const path = require('path')
const { Factory: Fac } = require('..')
const fac = new Fac(path.join(__dirname, '..'));

fac.map(function (file) {
    console.log(path.join(file.paths.join('/'), path.basename(file.path)));
})