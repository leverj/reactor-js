import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'

export class Marker{
    constructor(chainId, blockNumber){
        this.chainId = chainId
        this.blockNumber = blockNumber
    }
    getBlockNumber(){return this.blockNumber}
    setBlockNumber(blockNumber){this.blockNumber = blockNumber}
    filePath(){return ""}
    async serialize(){await writeFile(filePath(), JSON.stringify({chainId: this.chainId, blockNumber: this.blockNumber}))}
    static getMarker(chainId){return new Marker(chainId, 0)} 
}
