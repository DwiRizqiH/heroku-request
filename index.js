const fetch = require('node-fetch')
const express = require('express')
const fs = require('fs-extra')
const app = express()
const router = express.Router()
if(process.env.keyAccess == undefined) process.env.keyAccess = 'NB1R1hkxH94Wpoupc5fH'
 
app.engine('html', require('ejs').renderFile);
router.get('/', (req, res) => {
    return res.status(403).send({ error: true, msg: '403!' })
});

router.get('/request', async (req, res) => {
    if(req.query == undefined) return res.status(403).send({ error: true, msg: 'invalidQuery!' })
    if(req.query.key == undefined) return res.status(403).send({ error: true, msg: 'invalidKey!' })
    if(req.query.url == undefined) return res.send({ error: true, msg: 'invalidUrl' })
    if(req.query.key != process.env.keyAccess) return res.status(403).send({ error: true, msg: '403!' })
    if(!isUrl(req.query.url)) return res.send({ error: true, msg: 'invalidUrl' })
    try {
        const fetchReq = await fetch(req.query.url)
        const resultFetchReq = await fetchReq.text()
        return res.send({ error: false, data: resultFetchReq })
    } catch (err) {
        console.log(err)
        return res.status(503).send({ error: true, msg: '503!' })
    }
})

router.get('/render', async (req, res) => {
    if(req.query == undefined) return res.status(403).send({ error: true, msg: 'invalidQuery!' })
    if(req.query.key == undefined) return res.status(403).send({ error: true, msg: 'invalidKey!' })
    if(req.query.url == undefined) return res.send({ error: true, msg: 'invalidUrl' })
    if(req.query.key != process.env.keyAccess) return res.status(403).send({ error: true, msg: '403!' })
    if(!isUrl(req.query.url)) return res.send({ error: true, msg: 'invalidUrl' })
    try {
        const fetchReq = await fetch(req.query.url)
        const resultFetchReq = await fetchReq.text()
        const randomFileGenerated = `${__dirname}/views/${GenerateSerialNumber('00000000000000000000')}.html`
        await fs.writeFileSync(randomFileGenerated, resultFetchReq)
        return res.render(randomFileGenerated.replace(`${__dirname}/views/`, ''))
    } catch (err) {
        console.log(err)
        return res.status(503).send({ error: true, msg: '503!' })
    }
})

app.use('/', router)
app.set('port', (process.env.PORT || 5723))
app.listen(app.get('port'), () => {
    console.log('App Started on PORT', app.get('port'))
})


//Functions
function isUrl (s) {
    try {
        new URL(s)
        return true
    } catch (err) {
        console.log(err)
        return false
    }
}

function GenerateRandomNumber(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Generates a random alphanumberic character
function GenerateRandomChar() {
    var chars = "1234567890ABCDEFGIJKLMNOPQRSTUVWXYZ";
    var randomNumber = GenerateRandomNumber(0,chars.length - 1);
    return chars[randomNumber];
}
function GenerateSerialNumber(mask){
    var serialNumber = "";
    if(mask != null){
        for(var i=0; i < mask.length; i++){
            var maskChar = mask[i];
            serialNumber += maskChar == "0" ? GenerateRandomChar() : maskChar;
        }
    }
    return serialNumber;
}
