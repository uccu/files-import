'use strict';

const fs = require('fs');
const path = require('path');
const Folder = require('./folder');
const File = require('./file');


class Factory {

    constructor(folderPath, paths = []) {

        this.path = folderPath;
        this.fullPath = path.resolve(this.path);

        if (!fs.existsSync(this.fullPath)) {
            throw new Error('path is not exist');
        }

        const fileStat = fs.statSync(this.fullPath);
        if (!fileStat.isDirectory()) {
            throw new Error('path is not a directory');
        }

        this.paths = [];
        this.files = [];

        fs.readdirSync(this.fullPath).forEach(fileName => {
            const filePath = path.join(this.fullPath, fileName);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory()) {
                this.paths.push(new Folder(filePath, paths.concat(fileName)));
            } else {
                this.files.push(new File(filePath, paths));
            }
        });
    }

    map(fn) {
        const list = this.files.map(fn);
        return list.concat(this.paths.map(p => p.map(fn)));
    }



}






module.exports = Factory;
