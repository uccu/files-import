'use strict';

const fs = require('fs');
const path = require('path');
const Folder = require('./folder');
const File = require('./file');


class Factory {

    constructor(folderPath, folders = []) {

        this.path = folderPath;
        this.fullPath = path.resolve(this.path);

        if (!fs.existsSync(this.fullPath)) {
            throw new Error('path \'' + this.fullPath + '\' is not exist');
        }

        const fileStat = fs.statSync(this.fullPath);
        if (!fileStat.isDirectory()) {
            throw new Error('path \'' + this.fullPath + '\' is not a directory');
        }

        this.folders = [];
        this.files = [];
        this._ignore = null;

        fs.readdirSync(this.fullPath).forEach(fileName => {
            const filePath = path.join(this.fullPath, fileName);
            const fileStat = fs.statSync(filePath);
            if (fileStat.isDirectory()) {
                this.folders.push(new Folder(filePath, folders.concat(fileName)));
            } else {
                this.files.push(new File(filePath, folders));
            }
        });
    }


    map(fn) {

        if (typeof fn !== 'function') {
            throw new Error('fn is not a function');
        }

        this.files.map(file => {
            this.handleFileIgnore(file, fn);
        });

        this.folders.map(folder => {
            this.handleFolderIgnore(folder, fn);
        });
    }


    ignore(fn) {
        if (typeof fn === 'string') {
            fn = path.join(fn);
            this._ignore = i => i.path.indexOf(fn) !== -1;
        }
        if (fn instanceof RegExp) {
            this._ignore = i => i.path.search(fn) !== -1;
        }
        if (typeof fn === 'function') {
            this._ignore = fn;
        }

        return this;
    }


    handleFileIgnore(file, fn) {
        if (this._ignore && this._ignore(file)) return;
        fn(file);
    }

    /**
     * @param {Folder} folder 
     * @param {function} fn 
     * @return void
     */
    handleFolderIgnore(folder, fn) {
        if (this._ignore && this._ignore(folder)) return;
        const fac = new Factory(folder.path, folder.folders);
        fac.ignore(this._ignore).map(fn);
    }
}





module.exports = Factory;
