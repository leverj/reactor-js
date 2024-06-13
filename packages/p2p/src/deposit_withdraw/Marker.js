import {mkdir, readFile, rm, writeFile} from 'node:fs/promises'

export class Marker{
    constructor(chainId, block){
        this.chainId = chainId
        this.block = block
    }
    getBlock(){return this.block}
    setBlock(block){this.block = block}
    filePath(){return ""}
    async serialize(){await writeFile(filePath(), JSON.stringify({chainId: this.chainId, block: this.block}))}
    deserialize(){}
    /*static getMarker(chainId){return new Marker(chainId, 0)} //read from file and return Marker object 
    get block () {return this.block}
    setBlock(block){this.block = block}
    
    serialize(){} //save to file*/
}
