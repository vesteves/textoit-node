import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('films', (table) => {
        table.bigIncrements('id').primary()
        table.integer('year')
        table.string('name').unique()
        table.boolean('winner')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('films')
}

