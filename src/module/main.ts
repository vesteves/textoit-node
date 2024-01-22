import fs from 'fs';
import { parse } from 'csv-parse'
import db from '../config/knex'

import { IFilm, storeFilm, updateFilm } from "../module/film";
import { IStudio, storeStudio } from "../module/studio";
import { IProducer, storeProducer } from "../module/producer";
import { storeFilmProducer } from "../module/filmProducer";

export class Main {
    parseProducers(input: string): string[] {
        const normalizedInput = input.replace(/ and /g, ', ');
        const producers = normalizedInput.split(', ');
        return producers;
    }

    async initate() {
        console.info('DB migrate')
        await db.migrate.latest();

        console.info('Reading file started. Please wait a few seconds')

        const stream = fs.createReadStream("./movielist.csv")
            .pipe(parse({ delimiter: ";", from_line: 2 }));

        const processRow = async (row: string[]) => {
            const yearRaw = parseInt(row[0]) || null
            const filmRaw = row[1] || null
            const studioRaw = row[2] || null
            const producersRaw = this.parseProducers(row[3]) || []
            const winnerRaw = !!row[4]

            const filmFound: IFilm[] | [] = await db('films')
                .select()
                .where({ name: filmRaw })

            if (!filmFound.length) {
                const filmStored = await storeFilm(filmRaw, yearRaw, winnerRaw)
                const filmId = filmStored[0]

                const studioFound: IStudio[] = await db('studios')
                    .select()
                    .where({ name: studioRaw })

                if (!studioFound.length) {
                    const studioStored = await storeStudio(studioRaw)
                    const studio = studioStored[0]

                    await updateFilm(filmId, { studio_id: studio })
                }
                else {
                    await updateFilm(filmId, { studio_id: studioFound[0].id })
                }

                for (const producerRaw of producersRaw) {
                    const producerFound: IProducer[] = await db('producers')
                        .select()
                        .where({ name: producerRaw })

                    let producerId: number
                    if (!producerFound.length) {
                        const producerStored = await storeProducer(producerRaw)
                        producerId = producerStored[0]
                    }
                    else {
                        producerId = producerFound[0].id
                    }

                    await storeFilmProducer(filmId, producerId)
                }
            }
        };

        stream.on("data", async (row: string[]) => {
            stream.pause();

            try {
                await processRow(row);
            } catch (error) {
                console.error(error);
            }

            stream.resume();
        });

        stream.on("end", () => {
            console.log("The file was processed. The server is ON!");
        });

        stream.on("error", (error: any) => {
            console.log(error.message);
        });
    }
}