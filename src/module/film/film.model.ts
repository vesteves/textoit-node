import db from '../../config/knex'

export const storeFilm = async (film: string | null, year: number | null, winner: boolean): Promise<number[]> => {
    if (!film) {
        throw new Error('Film is required')
    }

    if (!year) {
        throw new Error('Year is required')
    }
    try {
        const filmDb = await db('films').insert({
            year,
            name: film,
            winner
        })
        return filmDb;
    }
    catch (error: any) {
        throw new Error(`Error while recording ${film} film`)
    }
}

export const updateFilm = async (id: number, params: any): Promise<number> => {
    try {
        const filmDb = await db('films')
            .where({ id })
            .update({
                ...params
            })
        return filmDb;
    }
    catch (error: any) {
        console.log(error)
        throw new Error(`Error while updating ${id} film_id`)
    }
}
