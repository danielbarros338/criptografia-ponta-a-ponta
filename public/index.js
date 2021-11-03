let app = new Vue({
    el: "#app",
    data: {
        data_front: ""
    }
});

const btn = document.querySelector("#btn");
btn.addEventListener("click", async ()=>{
    const msgEnc = await encrypt(app.data_front);
    await sendData(msgEnc);
})

const sendData = async (msgEnc) => {
    try{
        fetch("http://localhost:3000/decript", {
            method: "POST",
            body: JSON.stringify({msgEnc}),
            headers: {"Content-Type":"application/json"}
        })
    }catch(err){
        console.log("ERR_REQ: ", err)
    }
}

const encrypt = async (msg)=>{
    try{
        const encode = new TextEncoder();
        const binaryDer = await binaryPubKey();
        const importedKey = await importKey(binaryDer);
        const encMsg = await window.crypto.subtle.encrypt({
                name: "RSA-OAEP",
            },
            importedKey,
            encode.encode(msg)
        );

        return arrayBufferToBase64(encMsg);

    }catch(err){
        console.log("ERR_ENCRYPT: ", err)
    }
}

const binaryPubKey = async ()=>{
        const key = JSON.parse(await getKey());
        const keyFormated = formatKey(key);
        const clearPubKey = window.atob(keyFormated);
        return str2ab(clearPubKey);
}

const importKey = async (binaryDer)=>{
    return await window.crypto.subtle.importKey('spki',
        binaryDer,
        {
            name:"RSA-OAEP",
            modulusLength: 1024,
            hash: "SHA-1"
        },
        true,
        ['encrypt']
    )
}


const getKey = async ()=>{
    try{
        const pubKey = await fetch('http://localhost:3000/get');
        return pubKey.json();
    }catch(err){
        console.log('ERR_REQ: ', err);
    }
}

const formatKey = (key)=>{
    key = key.pub.replace("-----BEGIN PUBLIC KEY-----","");
    key  = key.replace("-----END PUBLIC KEY-----","");
    return key
}

const str2ab = (str) =>{
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

const arrayBufferToBase64 = (buffer) => {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

