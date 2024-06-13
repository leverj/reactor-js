
export class Marker{
    constructor(chainId, block){
        this.chainId = chainId
        this.block = block
    }
    getMarker(chainId){return new Marker(chainId, 0)} //read from file and return Marker object 
    get block () {return this.block}
    setBlock(block){this.block = block}
    
    serialize(){} //save to file
}
