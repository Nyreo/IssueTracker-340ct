import DateHandler from '../../src/utils/functional/dateHandler'

const msPerDay = (1000*60*60*24)

describe('difference()', () => {

    test('difference between two valid dates', async done  => {
        try {
            const date1 = Date.now()
            const date2 = Date.now() - msPerDay

            expect(DateHandler.difference(date1, date2) / msPerDay).toEqual(1)
            
        } catch (err) {
            done.fail(err)
        } finally {
            done()
        }
    })

    test('difference between invalid dates (date2)', async done => {
        try {
            const date1 = Date.now()
            const date2 = 'test'

            DateHandler.difference(date1, date2)

            done.fail('Error should have been thrown')
            
        } catch (err) {
            expect(err).toEqual(Error('invalid date type'))
            done()
        } 
    })

    test('difference between invalid dates (date1)', async done => {
        try {
            const date1 = 'test'
            const date2 = Date.now()

            DateHandler.difference(date1, date2)

            done.fail('Error should have been thrown')
            
        } catch (err) {
            expect(err).toEqual(Error('invalid date type'))
            done()
        } 
    })

    test('date1 should not be blank', async done => {
        try {
            DateHandler.difference()

            done.fail('Error should have been thrown')
            
        } catch (err) {
            expect(err).toEqual(Error('date1 must not be blank'))
            done()
        } 
    })

    test('date2 should not be blank', async done => {
        try {
            DateHandler.difference(1)

            done.fail('Error should have been thrown')
            
        } catch (err) {
            expect(err).toEqual(Error('date2 must not be blank'))
            done()
        } 
    })
    
    test('absolute date difference', async done => {
        try {
            const date1 = Date.now()
            const date2 = Date.now() + msPerDay

            expect(DateHandler.difference(date1, date2) / msPerDay).toBe(1)
        } catch (err) {
            done.fail(err)
        } finally {
            done()
        }
    })
})

describe('timestampdays()', () => {

    test('converting valid timestamp', async done => {
        expect(DateHandler.timestampDays(msPerDay)).toBe(1)

        done()
    })

    test('converting invalid timestamp (negative)', async done => {
        try {
            DateHandler.timestampDays(-1)
            done.fail('error should have been thrown')
        } catch (err) {
            expect(err).toEqual(Error('timestamp cannot be negative'))
            done()
        }
    })

    test('converting invalid timestamp (NaN)', async done => {
        try {
            DateHandler.timestampDays('test')
            done.fail('error should have been thrown')
        } catch (err) {
            expect(err).toEqual(Error('value is not a number'))
            done()
        }
    })

    test('timestamp param should not be empty', async done => {
        try{
            DateHandler.timestampDays()

            done.fail('error should have been thrown')
        } catch(err) {
            expect(err).toEqual(Error('timestamp must not be blank'))
            done()
        }
    })
})