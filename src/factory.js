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

    _cludeAdd(m, fn, t) {

        let filter = null;

        if (typeof fn === 'string') {
            fn = path.join(fn);
            filter = i => i.path.indexOf(fn) !== -1;

        } else if (fn instanceof RegExp) {
            filter = i => i.path.search(fn) !== -1;

        } else if (typeof fn === 'function') {
            filter = fn;
        } else {
            return;
        }
        this._filter.push({ m, fn: filter, t });
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

        const filterList = this._filter.filter(isFilterFile);
        if (!handleFilter(filterList, file)) return;
        fn(file);
    }

    /**
     * @param {Folder} folder 
     * @param {function} fn 
     * @return void
     */
    handleFolderIgnore(folder, fn) {

        const filterList = this._filter.filter(isFilterFolder);
        if (!handleFilter(filterList, folder)) return;

        const fac = new Factory(folder.path, folder.folders);
        fac._filter = this._filter;
        fac.map(fn);
    }
}

Factory.PATH_TYPE = {
    ALL: 0,
    FILE: 1,
    FOLDER: 2
};

const FILTER_TYPE = {
    INCLUDE: 0,
    EXCLUDE: 1,
}

function isFilterFile(f) {
    return !f.t || f.t === Factory.PATH_TYPE.FILE;
}

function isFilterFolder(f) {
    return !f.t || f.t === Factory.PATH_TYPE.FOLDER;
}

function handleFilter(filterList, fileOrFolder) {

    for (const filterObj of filterList) {

        if (filterObj.m === FILTER_TYPE.EXCLUDE) {
            if (filterObj.fn(fileOrFolder)) return false;
        }

        if (filterObj.m === FILTER_TYPE.INCLUDE) {
            if (!filterObj.fn(fileOrFolder)) return false;
        }
    }

    return true;
}

module.exports = Factory;
