'use strict';

const fs = require('fs');
const path = require('path');
const Folder = require('./folder');
const File = require('./file');


class Factory {

    static PATH_TYPE = {
        ALL: 0,
        FILE: 1,
        FOLDER: 2
    }

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
        this._filter = [];

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

    _cludeAdd(pro, fn, t) {
        if (typeof fn === 'string') {
            fn = path.join(fn);
            this._filter.push({
                m: pro, fn: i => i.path.indexOf(fn) !== -1, t
            });
        } else if (fn instanceof RegExp) {
            this._filter.push({
                m: pro, fn: i => i.path.search(fn) !== -1, t
            });
        } else if (typeof fn === 'function') {
            this._filter.push({
                m: pro, fn, t
            });
        }
    }

    get include() {
        return (fn, type) => {
            this._cludeAdd(FILTER_TYPE.INCLUDE, fn, type);
            return this;
        }
    }

    set include(fn) {
        this._cludeAdd(FILTER_TYPE.INCLUDE, fn);
    }

    get exclude() {
        return (fn, type) => {
            this._cludeAdd(FILTER_TYPE.EXCLUDE, fn, type);
            return this;
        }
    }

    set exclude(fn) {
        this._cludeAdd(FILTER_TYPE.EXCLUDE, fn);
    }


    ignore(fn, type) {
        console.warn('Factory.ignore is deprecated: Use Factory.exclude() instead. And it will be removed in feature');
        this._cludeAdd(FILTER_TYPE.EXCLUDE, fn, type);
        return this;
    }


    handleFileIgnore(file, fn) {
        for (let f of this._filter) {
            if (f.t && f.t !== Factory.PATH_TYPE.FILE) continue;
            if (f.m === FILTER_TYPE.EXCLUDE && f.fn(file)) return;
            if (f.m === FILTER_TYPE.INCLUDE && !f.fn(file)) return;
        }
        fn(file);
    }

    /**
     * @param {Folder} folder 
     * @param {function} fn 
     * @return void
     */
    handleFolderIgnore(folder, fn) {
        for (let f of this._filter) {
            if (f.t && f.t !== Factory.PATH_TYPE.FOLDER) continue;
            if (f.m === FILTER_TYPE.EXCLUDE && f.fn(folder)) return;
            if (f.m === FILTER_TYPE.INCLUDE && !f.fn(folder)) return;
        }
        const fac = new Factory(folder.path, folder.folders);
        fac._filter = this._filter;
        fac.map(fn);
    }
}

const FILTER_TYPE = {
    INCLUDE: 0,
    EXCLUDE: 1,
}



module.exports = Factory;
