const NodeRSA = require("node-rsa")

exports.createKeys = ()=>{
    const key = new NodeRSA({ b: 2048});
    globalThis.key = key.exportKey('private');
    return key.exportKey('public','spki');
}

exports.decryptMsg = (msg) => {
    const keyPrivate = new NodeRSA(globalThis.key);
    const decryptMsg = keyPrivate.decrypt(msg.msgEnc, 'utf8');
    return decryptMsg;
}