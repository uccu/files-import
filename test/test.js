'use strict';

const assert = require('power-assert');
const path = require('path');
const fs = require('fs');
const Factory = require('../src/factory');
const File = require('../src/file');
const Folder = require('../src/folder');

describe('Global', function() {
    before(function() {
        fs.mkdirSync(path.join(__dirname, 'testFolder'));
        fs.mkdirSync(path.join(__dirname, 'testFolder', 'Afolder'));
        fs.mkdirSync(path.join(__dirname, 'testFolder', 'Bfolder'));
        fs.mkdirSync(path.join(__dirname, 'testFolder', 'Bfolder', 'Cfolder'));
        fs.writeFileSync(path.join(__dirname, 'testFolder', 'Afolder', 'Afile'), '');
        fs.writeFileSync(path.join(__dirname, 'testFolder', 'Afolder', 'Bfile'), '');
        fs.writeFileSync(path.join(__dirname, 'testFolder', 'Cfile'), '');
        fs.writeFileSync(path.join(__dirname, 'testFolder', 'Dfile'), '');
        fs.writeFileSync(path.join(__dirname, 'testFolder', 'Bfolder', 'Cfolder', 'Efile'), '');
    });

    after(function() {
        fs.unlinkSync(path.join(__dirname, 'testFolder', 'Afolder', 'Afile'), '');
        fs.unlinkSync(path.join(__dirname, 'testFolder', 'Afolder', 'Bfile'), '');
        fs.unlinkSync(path.join(__dirname, 'testFolder', 'Cfile'), '');
        fs.unlinkSync(path.join(__dirname, 'testFolder', 'Dfile'), '');
        fs.unlinkSync(path.join(__dirname, 'testFolder', 'Bfolder', 'Cfolder', 'Efile'), '');
        fs.rmdirSync(path.join(__dirname, 'testFolder', 'Bfolder', 'Cfolder'));
        fs.rmdirSync(path.join(__dirname, 'testFolder', 'Afolder'));
        fs.rmdirSync(path.join(__dirname, 'testFolder', 'Bfolder'));
        fs.rmdirSync(path.join(__dirname, 'testFolder'));
    });

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

            it('should throw an error when the param of method map is not a function', function() {

                const testFolder = path.join(__dirname, 'testFolder', 'Afolder');
                try {
                    const fac = new Factory(testFolder);
                    fac.map(1);
                    assert(false, 'not throw an error');
                } catch (e) {
                    assert.equal('fn is not a function', e.message, 'error message not matched');
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
                });
            });
        });

        describe('function map', function() {
            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);

                const data = [];

                fac.map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
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


        describe('exclude', function() {
            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.exclude(function(f) {
                    return f.path.match('folder');
                }).map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Cfile'],
                    ['Dfile']
                ]), 'map data is not matched');
            });

            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.exclude('folder').map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Cfile'],
                    ['Dfile']
                ]), 'map data is not matched');
            });

            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.exclude = /.file/;
                fac.map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([

                ]), 'map data is not matched');
            });

        });

        describe('include', function() {
            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.include(function(f) {
                    return f.path.match('folder');
                }).map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Afolder', 'Afile'],
                    ['Afolder', 'Bfile'],
                    ['Bfolder', 'Cfolder', 'Efile']
                ]), 'map data is not matched');
            });

            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.include('folder').map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Afolder', 'Afile'],
                    ['Afolder', 'Bfile'],
                    ['Bfolder', 'Cfolder', 'Efile']
                ]), 'map data is not matched');
            });

            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];
                fac.include = /.Dfile/;
                fac.map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Dfile']
                ]), 'map data is not matched');
            });

        });

        describe('complex', function() {
            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];

                fac.exclude = 'Cfolder';
                fac.exclude(/B(file|folder)/, Factory.PATH_TYPE.FOLDER);
                fac.include('Afile', Factory.PATH_TYPE.FILE);

                fac.include({}).map(file => {
                    data.push([...file.folders, path.basename(file.path)]);
                });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Afolder', 'Afile'],
                ]), 'map data is not matched');
            });

            it('should matched', function() {
                const testFolder = path.join(__dirname, 'testFolder');
                const fac = new Factory(testFolder);
                const data = [];

                fac.ignore('Cfile')
                    .exclude('Dfile')
                    .include('A', Factory.PATH_TYPE.FOLDER)
                    .exclude('Afile', Factory.PATH_TYPE.FILE)
                    .map(file => {
                        data.push([...file.folders, path.basename(file.path)]);
                    });

                assert.equal(JSON.stringify(data), JSON.stringify([
                    ['Afolder', 'Bfile'],
                ]), 'map data is not matched');
            });
            
        });
    });



    describe('Folder', function() {
        describe('constructor', function() {
            it('should success', function() {
                const testFolder = path.join(__dirname, 'testFolder', 'Bfolder');
                const folder = new Folder(testFolder, ['Bfolder']);

                assert(folder.path, 'path not exist');
                assert.equal(folder.folders.length, 1, 'folders not exist');
            });

            it('should success', function() {
                const testFolder = path.join(__dirname, 'testFolder', 'Bfolder');
                const folder = new Folder(testFolder);

                assert(folder.path, 'path not exist');
                assert.equal(folder.folders.length, 0, 'folders not exist');
            });
        });
    });
});