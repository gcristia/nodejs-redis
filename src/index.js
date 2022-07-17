const express = require('express')
const axios = require('axios')
const responseTime = require('response-time')
const redis = require('redis')

const clientRedis = redis.createClient({
    host: 'localhost',
    port: 6379,
})

clientRedis.on('error', (err) => console.log('Redis Client Error', err));

const app = express()

app.use(responseTime())

const connectRedis = async () => {
    await clientRedis.connect();
}

connectRedis()

app.get('/character', async (req, res) => {

    try {
        const reply = await clientRedis.get('characters')

        if (reply) {
            return res.json(JSON.parse(reply))
        }

        const response = await axios.get('https://rickandmortyapi.com/api/character')

        await clientRedis.set("characters", JSON.stringify(response.data))

        res.json(response.data)
    } catch (err) {
        console.log(err)
    }

})

app.listen(3000)
console.log('Server on port 3000')
