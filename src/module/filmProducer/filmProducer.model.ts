import db from '../../config/knex'

export const storeFilmProducer = async (film: number, producer: number): Promise<number[]> => {
    try {
        const filmProducerDb = await db('film_producer').insert({
            film_id: film,
            producer_id: producer
        })
        return filmProducerDb;
    }
    catch (error: any) {
        throw new Error(`Error while recording ${film} film and ${producer}`)
    }
}