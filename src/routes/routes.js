const { createKeys, decryptMsg } = require('../auth/keys');

module.exports = app => {
   app.get('/get', (req, res) => {
      const pubKey = createKeys();
      res.json(JSON.stringify({
         pub: pubKey
      }));
   });

   app.post('/decript', async (req, res) =>{
      console.log(decryptMsg(req.body))
   })

   app.get('/', (req, res) => { //Somente para desenvolvimento
      app.send(`${process.cwd()}/public/index.html`)
   })
}