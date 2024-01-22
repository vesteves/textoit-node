import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('studios', (table) => {
        table.bigIncrements('id').primary();
        table.string('name').unique();
    });

    await knex.schema.alterTable('films', (table) => {
        table.integer('studio_id').unsigned();
        table.foreign('studio_id').references('id').inTable('studios'); // Referência correta da chave estrangeira
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('films', (table) => {
        table.dropForeign(['studio_id']);
        table.dropColumn('studio_id');
    });

    await knex.schema.dropTable('studios');
}