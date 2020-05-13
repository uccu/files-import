'use strict';

const assert = require('power-assert');
const path = require('path');
const Factory = require('../src/factory');
const File = require('../src/file');
const Folder = require('../src/folder');


describe('Factory', function() {
    describe('error test', function() {
        it('should throw an error when inputs a path which is not exist', function() {

            const testFolder = path.join(__dirname, 'n-testFolder');
            try {
                new Factory(testFolder);
                assert(false, 'not throw an error');
            } catch (e) {
                const fullPath = path.resolve(testFolder);
                assert.equal('path \'' + fullPath + '\' is not exist', e.message, 'error message not matched');
            }
        });

        it('should throw an error when inputs a path which is not a folder', function() {

            const testFolder = path.join(__dirname, 'testFolder', 'Cfile');
            try {
                new Factory(testFolder);
                assert(false, 'not throw an error');
            } catch (e) {
                const fullPath = path.resolve(testFolder);
                assert.equal('path \'' + fullPath + '\' is not a directory', e.message, 'error message not matched');
            }
        });

    });

    describe('constructor', function() {
        it('should success when inputs a path which is exist and its a folder', function() {
            const testFolder = path.join(__dirname, 'testFolder');
            const fac = new Factory(testFolder);
            assert.equal(fac.files.length, 2, 'files not matched');
            assert.equal(fac.folders.length, 2, 'folders not matched');

            fac.files.forEach(e => {
                assert(e instanceof File, 'file is not instance of File Class');
            });
            fac.folders.forEach(e => {
                assert(e instanceof Folder, 'folder is not instance of Folder Class');
                assert(e.factory instanceof Factory, 'folder.factory is not instance of Factory Class');
            });
        });
    });

    describe('function map', function() {
        it('should matched', function() {
            const testFolder = path.join(__dirname, 'testFolder');
            const fac = new Factory(testFolder);

            const data = [];

            fac.map(file => {
                data.push([...file.paths, path.basename(file.path)]);
            });

            assert.equal(JSON.stringify(data), JSON.stringify([
                ['Cfile'],
                ['Dfile'],
                ['Afolder', 'Afile'],
                ['Afolder', 'Bfile'],
                ['Bfolder', 'Cfolder', 'Efile']
            ]), 'map data is not matched');

        });
    });
});



describe('Folder', function() {
    describe('constructor', function() {
        it('should success', function() {
            const testFolder = path.join(__dirname, 'testFolder', 'Bfolder', 'Cfolder');
            const folder = new Folder(testFolder, ['Bfolder']);

            assert(folder.path, 'path not exist');
            assert.equal(folder.paths.length, 1, 'paths not exist');
        });
    });

    describe('constructor', function() {
        it('should matched', function() {
            const testFolder = path.join(__dirname, 'testFolder');
            const folder = new Folder(testFolder);

            const data = [];

            folder.map(file => {
                data.push([...file.paths, path.basename(file.path)]);
            });

            assert.equal(JSON.stringify(data), JSON.stringify([
                ['Cfile'],
                ['Dfile'],
                ['Afolder', 'Afile'],
                ['Afolder', 'Bfile'],
                ['Bfolder', 'Cfolder', 'Efile']
            ]), 'map data is not matched');

        });
    });
});