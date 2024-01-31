import db from '../../config/knex'

export const getMinMax = async () => {
    const intervals = db('films as f1')
        .join('film_producer as fp1', 'f1.id', 'fp1.film_id')
        .join('producers as p', 'fp1.producer_id', 'p.id')
        .join('films as f2', function () {
            this.on('fp1.producer_id', '=', 'fp2.producer_id').andOn('f1.year', '<', 'f2.year')
        })
        .join('film_producer as fp2', 'f2.id', 'fp2.film_id')
        .select('p.name as producer', 'f1.year as previousWin', 'f2.year as followingWin')
        .select(db.raw('(f2.year - f1.year) as interval'))
        .where('f1.winner', true)
        .andWhere('f2.winner', true)
        .groupBy('p.name', 'f1.year', 'f2.year');

    const maxInterval = intervals.clone().orderBy('interval', 'desc').first();
    const minInterval = intervals.clone().orderBy('interval', 'asc').first();

    return await Promise.all([maxInterval, minInterval])
        .then(([maxResult, minResult]) => {
            const result = {
                max: [maxResult].map(r => ({
                    producer: r.producer,
                    interval: r.interval,
                    previousWin: r.previousWin,
                    followingWin: r.followingWin
                })),
                min: [minResult].map(r => ({
                    producer: r.producer,
                    interval: r.interval,
                    previousWin: r.previousWin,
                    followingWin: r.followingWin
                }))
            };

            return result
        })
        .catch((error: any) => {
            return error.message
        });
}
