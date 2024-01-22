import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('film_producer', (table) => {
        table.bigIncrements('id').primary()
        table.integer('film_id').unsigned()
        table.integer('producer_id').unsigned()
        table.foreign('film_id').references('films')
        table.foreign('producer_id').references('producers')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('film_producer')
}
