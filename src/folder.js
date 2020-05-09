'use strict';


class Folder {

    constructor(path, paths = []) {
        this.path = path;
        this.paths = paths;
        const Fac = require('./factory');
        this.factory = new Fac(this.path, paths);
    }

    map(fn) {
        return this.factory.map(fn);
    }

}




module.exports = Folder;
