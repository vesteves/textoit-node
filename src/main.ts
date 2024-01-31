import fs from 'fs';
import { parse } from 'csv-parse'
import db from './config/knex'

import { IFilm, storeFilm, updateFilm } from "./module/film";
import { IStudio, storeStudio } from "./module/studio";
import { IProducer, storeProducer } from "./module/producer";
import { storeFilmProducer } from "./module/filmProducer";

class Main {
    protected filepath: string = '';

    constructor(filepath: string) {
        this.filepath = filepath
    }

    parseProducers(input: string): string[] {
        const normalizedInput = input.replace(/ and /g, ', ');
        const producers = normalizedInput.split(', ');
        return producers;
    }

    async processRow(row: string[]) {
        if (
            !row[0] ||
            !row[1] ||
            !row[2] ||
            !row[3] ||
            (row[4] && !(row[4] === 'yes' || row[4] === undefined))
        ) {
            throw new Error('This file isn\'t able to be processed. Please verify the row\'s rules and try again.')
        }
        const yearRaw = parseInt(row[0])
        const filmRaw = row[1]
        const studioRaw = row[2]
        const producersRaw = this.parseProducers(row[3])
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

    async createReadStream() {
        return fs.createReadStream(this.filepath)
            .pipe(parse({ delimiter: ";", from_line: 2 }));
    }

    async initate() {
        console.info('DB migrate')
        await db.migrate.latest();

        console.info('Reading file started. Please wait a few seconds')

        const stream = await this.createReadStream();

        stream.on("data", async (row: string[]) => {
            stream.pause();

            try {
                await this.processRow(row);
            } catch (error: any) {
                throw new Error(error);
            }

            stream.resume();
        });

        stream.on("end", () => {
            console.log("The file was processed. The server is ON!");
        });

        stream.on("error", (error: any) => {
            throw new Error(error);
        });

        return stream;
    }
}

export default Main;