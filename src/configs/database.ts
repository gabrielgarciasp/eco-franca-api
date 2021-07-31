import { createConnection } from 'typeorm'

createConnection({
    type: 'mysql',
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'root',
    database: process.env.DB_SCHEMA || 'hackathon',
    entities: [__dirname + '/../models/*{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE === 'true' || false,
    logging: process.env.DB_LOGGING === 'true' || false,
})
    .then(() => {
        console.log('✔️ Database connected')
    })
    .catch((error) => {
        console.error('❌ Database failed to connect')
        console.error(error)
    })
