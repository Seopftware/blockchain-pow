const CryptoJS = require("crypto-js");

class Block{
    // the function gets called every time we made new block
    constructor(index, hash, previousHash, timestamp, data){
        this.index=index;
        this.hash=hash;
        this.previousHash=previousHash;
        this.timestamp=timestamp;
        this.data=data;
    }
}

// make first block
// hash from SHA256 Hash Generator
const genesisBlock = new Block(
    0,
    "7043EEC2224776975E5B4AA39A2AD575D0F9F70873A232BBF61F627F12601DB0",
    null,
    1535943926.164,
    "This is the Genesis Block!"
)

// block chain is array of block
let blockchain = [genesisBlock];

// console.log(blockchain) // first block

// functional programming
const getNewestBlock = () => blockchain[blockchain.length -1];
const getTimestamp = () => new Date().getTime() / 1000;
const getBlockchain = () => blockchain;
const createHash = (index, previousHash, timestamp, data) =>
    CryptoJS.SHA256(index + previousHash + timestamp + JSON.stringify(data)).toString();

const createNewBlock = data => {
   const previousBlock = getNewestBlock();
   const newBlockIndex = previousBlock.index + 1;
   const newTimestamp = getTimestamp();
   const newHash = createHash(
       newBlockIndex, 
       previousBlock.hash, 
       newTimestamp, 
       data
   );
   const newBlock = new Block(
       newBlockIndex,
       newHash,
       previousBlock.hash,
       newTimestamp,
       data
   );
    addBlockToChain(newBlock);
    return newBlock;
};

const getBlockHash = block => createHash(block.index, block.previousHash, block.timestamp, block.data);

// Validate of block data
const isBlockValid = (candidateBlock, latestBlock) => { // invallid new block
    if(!isBlockStructureValid(candidateBlock)){
        console.log("The candidate block structure is not valid");
        return false;
    }    
    else if(latestBlock.index +1 !==candidateBlock.index){ // index
        conolse.log("The candidate block doestn't have a valid index");
        return false;
    }
    else if(latestBlock.hash !== candidateBlock.previousHash){ // block hash
        console.log("The previous hash of the candidate block is not the hash of the latest block");
        return false;
    }
    else if(getBlockHash(candidateBlock) !== candidateBlock.hash){ // hash check again 
        console.log("The hash of this block is invaillid")
        return false;
    }
    return true;
}

// Validate of block structure
const isBlockStructureValid = block => {
    // true or false
    return(
        typeof block.index === 'number' 
        && typeof block.hash === 'string'  
        && typeof block.previousHash === 'string'
        && typeof block.timestamp === 'number'
        && typeof block.data === 'string'
    )
}

// Validate of Chain => same chain?
const isChainValid = candidateChain => {
    const isGenesisValid = block => {
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };

    if(!isGenesisValid(candidateChain[0])){
        console.log("The candidateChains genesisBlock is not the same as our genesisBlock");
        return false;
    }

    // i is start 1, because we don't need to check genesisblock (genesis block doesn't have a previous block)
    for(let i=1; i<candidateChain.length; i++){ 
        // candidate block(new block) , latest block(previous block)
        if(!isBlockValid(candidateChain[i], candidateChain[i - 1])){
            return false;
        }
    }
    return true;
}

const replaceChain = candidateChain => {
    // blockchain want more longer chain
    if(isChainValid(candidateChain) && candidateChain.length > getBlockchain().length){
        blockchain = candidateChain;
        return true;
    } else{
        return false;
    }
};

const addBlockToChain = candidateBlock => {
    if(isBlockValid(candidateBlock, getNewestBlock())){
        getBlockchain().push(candidateBlock);
        return true;
    }else{
        return false;
    }
};

module.exports={
    getNewestBlock,
    getBlockchain,
    createNewBlock,
    isBlockStructureValid,
    addBlockToChain,
    replaceChain
}