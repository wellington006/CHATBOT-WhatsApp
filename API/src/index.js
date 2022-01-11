const express = require('express')
const app = express()
const port = 500

const db = require('lowdb')('./src/database.json')

app.use(express.json())

app.get('/user/:idUser', (req, res) => {
    const idUser = req.params.idUser

    const user = db.get('users')
        .find({ id: idUser })
        .value()

    res.status(200).send(user)
})

app.post('/user', (req, res) => {
    const user = req.body

    db.get('users')
        .push(user)
        .write()

    res.status(200).send()
})

app.get('/user/aready-registred/:idUser', (req, res) => {
    const idUser = req.params.idUser

    const isRegistred = db.get('users')
        .find({ id: idUser })
        .value()

    res.status(200).send(typeof (isRegistred) == 'object' ? true : false)
})

app.put('/user', async (req, res) => {
    const user = req.body

    await db.get('users')
        .find({ id: user.id })
        .assign(user)
        .write()
        
    res.status(200).send(true)
})

app.get('/menu', async (req, res) => {
    const menu = await db.get('menu')
        .value()

    res.status(200).send(menu)
})

app.listen(port, () => {
    console.log(`Server running in port ${port}`)
})