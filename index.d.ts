/// <reference types="node" />

declare module 'files-import' {

    interface File {
        public path: string
        public paths: string[]
    }

    interface Folder {
        public path: string
        public paths: string[]
    }

    export class Factory {
        constructor(folderPath: string, paths?: string[]): viod
        public map(fn: (f: File) => void): void
    }

    export default Factory
    export = Factory
}

