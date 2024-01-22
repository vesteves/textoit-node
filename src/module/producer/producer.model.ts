import db from '../../config/knex'

export const storeProducer = async (name: string | null): Promise<number[]> => {
    if (!name) {
        throw new Error('Name is required')
    }
    try {
        const producerDb = await db('producers').insert({
            name
        })
        return producerDb;
    }
    catch (error: any) {
        throw new Error(`Error while recording ${name} producer`)
    }
}