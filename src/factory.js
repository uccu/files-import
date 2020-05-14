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
        this._exclude = null;
        this._include = null;

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

    include(fn) {
        if (typeof fn === 'string') {
            fn = path.join(fn);
            this._include = i => i.path.indexOf(fn) !== -1;
        } else if (fn instanceof RegExp) {
            this._include = i => i.path.search(fn) !== -1;
        } else if (typeof fn === 'function') {
            this._include = fn;
        }

        return this;
    }

    exclude(fn) {
        return this.ignore(fn);
    }


    ignore(fn) {
        if (typeof fn === 'string') {
            fn = path.join(fn);
            this._exclude = i => i.path.indexOf(fn) !== -1;
        } else if (fn instanceof RegExp) {
            this._exclude = i => i.path.search(fn) !== -1;
        } else if (typeof fn === 'function') {
            this._exclude = fn;
        }

        return this;
    }


    handleFileIgnore(file, fn) {
        if (this._exclude && this._exclude(file)) return;
        if (this._include && !this._include(file)) return;
        fn(file);
    }

    /**
     * @param {Folder} folder 
     * @param {function} fn 
     * @return void
     */
    handleFolderIgnore(folder, fn) {
        if (this._exclude && this._exclude(folder)) return;
        if (this._include && !this._include(folder)) return;
        const fac = new Factory(folder.path, folder.folders);
        fac.exclude(this._exclude).include(this._include).map(fn);
    }
}





module.exports = Factory;
