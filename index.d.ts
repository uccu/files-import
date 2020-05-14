/// <reference types="node" />

declare module 'files-import' {

    interface File {
        path: string
        folders: string[]
    }

    interface Folder {
        path: string
        folders: string[]
    }

    export class Factory {
        public files : File[]
        public folders : Folder[]
        constructor(folderPath: string, folders?: string[]): void
        public map(fn: (f: File) => void): void
        public ignore(fn: ((f: File | Folder) => boolean) | string | RegExp): void
    }

    export default Factory
    export = Factory
}

