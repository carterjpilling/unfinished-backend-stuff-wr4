const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { title, password } = req.body

        const [commander] = await db.check_commander(title)

        if (commander) {
            return res.status(400).send('Comander has already been promoted')
        }

        let salt = bcrypt.genSaltSync(10)
        let hash = bcrypt.hashSync(password, salt)

        let [newCommander] = await db.promote_commander({ title, hash })

        req.session.commander = newCommander
        res.status(201).send(req.session.commander)


    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const { title, password } = req.body

        let [commander] = await db.check_commander(title)

        if (!commander) {
            return res.status(400).send('No commander found.')
        }

        let authenticated = bcrypt.compareSync(password, commander.password)

        if (!authenticated) {
            return res.status(401).send('Password is incorrect')
        }

        delete commander.password
        req.session.commander = commander
        res.status(202).send(req.session.commander)
    },
    logout: (req, res) => {

    },
    getcommander: (req, res) => {

    }
}