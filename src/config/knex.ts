import knex, { Knex } from 'knex'

let conn: Knex

const databaseConn = () => {
    if (!conn) {
        conn = knex({
            client: 'sqlite3',
            connection: {
                filename: ":memory:"
            },
            useNullAsDefault: true
        });
    }

    return conn
}

export default databaseConn()