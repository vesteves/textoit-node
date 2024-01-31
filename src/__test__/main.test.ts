import Main from '../main';
import db from '../config/knex';
import movielistMock from './movielist.mock'

jest.mock('../config/knex', () => {
    const mChain = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
    };

    const knexMock: any = jest.fn(() => mChain);
    knexMock.migrate = {
        latest: jest.fn().mockResolvedValue(null),
    };

    return knexMock;
});

describe('Main test suite', () => {
    it('Main should be instance of Main class', () => {
        const main = new Main('./src/__test__/movielist.csv');
        expect(main).toBeInstanceOf(Main);
    });

    describe('parseProducers test suite', () => {
        it('Should split producers name into an array', () => {
            const main = new Main('./src/__test__/movielist.csv');
            expect(main.parseProducers('Vitor, Carol and Jade')).toEqual(['Vitor', 'Carol', 'Jade']);
        });
    });

    describe('processRow test suite', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Should print DB migrate', async () => {
            const main = new Main('./src/__test__/movielist.csv');
            await main.processRow(['1980', 'Can\'t Stop the Music', 'Associated Film Distribution', 'Allan Carr', 'yes']);
            expect(db('any').select).toHaveBeenCalled();
        });
    });

    describe('createReadStream test suite', () => {

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('Should DB migrate', async () => {
            const main = new Main('./movielist.csv');

            let rowMock: any = []
            const streamResult = await main.createReadStream();

            streamResult.on("data", async (row: string[]) => {
                rowMock.push(row);
            });

            streamResult.on("end", () => {
                expect(rowMock).toMatchObject(movielistMock);
            });
        });

        it('Should throw an error', (done) => {
            const main = new Main('./src/__test__/movielistmodified.csv');

            let rowMock: any = [];
            main.createReadStream().then(streamResult => {
                streamResult.on("data", (row) => {
                    if (row.length) {
                        rowMock.push(row);
                    }
                });

                streamResult.on("end", () => {
                    try {
                        expect(rowMock).not.toMatchObject(movielistMock);
                        done();
                    } catch (error) {
                        done(error);
                    }
                });
            }).catch(err => {
                done(err);
            });
        });
    });
});