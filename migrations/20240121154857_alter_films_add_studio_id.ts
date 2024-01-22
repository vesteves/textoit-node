import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('film_studio', (table) => {
        table.bigIncrements('id').primary()
        table.integer('film_id').unsigned()
        table.integer('studio_id').unsigned()
        table.foreign('film_id').references('films')
        table.foreign('studio_id').references('studios')
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('film_studio')
}
