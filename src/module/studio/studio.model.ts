import db from '../../config/knex'

export const storeStudio = async (name: string | null): Promise<number[]> => {
    if (!name) {
        throw new Error('Name is required')
    }
    try {
        const studioDb = await db('studios').insert({
            name
        })
        return studioDb;
    }
    catch (error: any) {
        throw new Error(`Error while recording ${name} studio`)
    }
}