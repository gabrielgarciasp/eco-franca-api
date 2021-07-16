import { createConnection } from 'typeorm'

createConnection({
    type: 'mysql',
    host: 'db',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'hackathon',
    entities: [__dirname + '/../models/*'],
    synchronize: true,
    logging: false,
})
    .then(() => {
        console.log('Database connected ✔️')
    })
    .catch((error) => console.log('Database failed to connect', error))
