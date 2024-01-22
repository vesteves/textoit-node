import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('producers', (table) => {
        table.bigIncrements('id').primary()
        table.string('name').unique()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('producers')
}

