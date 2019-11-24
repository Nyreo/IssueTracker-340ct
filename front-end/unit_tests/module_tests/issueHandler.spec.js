import axios from 'axios'

import IssueHandler from '../../src/modules/issueHandler'

describe('fetchAllIssues', () => {
    test('correctly fetches all issues', async done => {
        // mock api response with data
        axios.get = jest.fn(() => Promise.resolve({
            data : [
                {
                    id : 1,
                    description : 'test'
                },
                {
                    id : 2,
                    description : 'test2'
                }
            ],
            status: 200
        }))

        try {
            await expect(IssueHandler.fetchAllIssues())
                .resolves.toEqual([
                    {
                        id : 1,
                        description : 'test'
                    },
                    {
                        id : 2,
                        description : 'test2'
                    }
                ])
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('fetching all issues with internal server error', async done => {
        axios.get = jest.fn(() => Promise.reject(
            {
                response : {
                    message : 'internal server error',
                    status: 400
                }
            }
        ))

        try {
            await expect(IssueHandler.fetchAllIssues())
                .rejects.toEqual({
                    message: 'internal server error',
                    status: 400
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('reportIssue', () => {

    test('reporting an issue with valid credentials', async done => {
        axios.post = jest.fn(() => Promise.resolve(
            {
                status: 200
            }
        ))

        try {
            await expect(IssueHandler.reportIssue({}))
                .resolves.toEqual({
                    status: 200
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('reporting an issue with invalid credentials', async done => {
        axios.post = jest.fn(() => Promise.reject(
            {
                response: {
                    status: 400,
                    message: 'timestamp cannot be negative'
                }
            }
        ))

        try {
            await expect(IssueHandler.reportIssue({}))
                .rejects.toEqual({
                    status: 400,
                    message: 'timestamp cannot be negative'
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('updateIssueStatus', () => {

    test('updating existing issue with valid status', async done => {
        axios.put = jest.fn(() => Promise.resolve(
            {
                status: 200
            }
        ))

        try {
            await expect(IssueHandler.updateIssueStatus(1, 'test'))
                .resolves.toEqual({
                    status: 200
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('updating non-existing issue with valid status', async done => {
        axios.put = jest.fn(() => Promise.reject(
            {
                response : {
                    status: 400,
                    message: 'issue does not exist'
                }
            }
        ))

        try {
            await expect(IssueHandler.updateIssueStatus(1, 'test'))
                .rejects.toEqual({
                    status: 400,
                    message: 'issue does not exist'
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('updateIssuePriority', () => {

    test('updating existing issue with valid status', async done => {
        axios.put = jest.fn(() => Promise.resolve(
            {
                status: 200
            }
        ))

        try {
            await expect(IssueHandler.updateIssuePriority(1, 1))
                .resolves.toEqual({
                    status: 200
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('updating non-existing issue with valid priority', async done => {
        axios.put = jest.fn(() => Promise.reject(
            {
                response : {
                    status: 400,
                    message: 'issue does not exist'
                }
            }
        ))

        try {
            await expect(IssueHandler.updateIssuePriority(1, 1))
                .rejects.toEqual({
                    status: 400,
                    message: 'issue does not exist'
                })
        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('filterIssues', () => {

    test('issues correctly filtered with a single, valid filter', async done => {
        try {
            const issues = [
                {
                    status:'test'
                },
                {
                    status:'test2'
                }
            ]
            const filter = { status : 'test' }
            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(1)
            expect(filteredIssues).toEqual([{
                status: 'test'
            }])

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('issues correctly filtered with a multiple, valid filter', async done => {
        try {
            const issues = [
                {
                    status:'test',
                    priority: 1
                },
                {
                    status:'test2',
                    priority: 2
                }
            ]
            const filter = { status : 'test', priority: 1 }

            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(1)
            expect(filteredIssues).toEqual([{
                status:'test',
                priority: 1
            }])

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('issues filtered when no matches (single)', async done => {
        try {
            const issues = [
                {
                    status:'test',
                    priority: 1
                },
                {
                    status:'test2',
                    priority: 2
                }
            ]
            const filter = { priority: 3 }

            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(0)
            expect(filteredIssues).toEqual([])

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('issues filterd when no matches (multiple)', async done => {
        try {
            const issues = [
                {
                    status:'test',
                    priority: 1
                },
                {
                    status:'test2',
                    priority: 2
                }
            ]
            const filter = { status: 'testing', priority: 3 }

            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(0)
            expect(filteredIssues).toEqual([])

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('issues not filtered when no matches filter', async done => {
        try {
            const issues = [
                {
                    status:'test',
                    priority: 1
                },
                {
                    status:'test2',
                    priority: 2
                }
            ]
            const filter = {}

            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(2)
            expect(filteredIssues).toEqual(issues)

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('issues not filtered when passed filter that does not exist', async done => {
        try {
            const issues = [
                {
                    status:'test',
                    priority: 1
                },
                {
                    status:'test2',
                    priority: 2
                }
            ]
            const filter = { testing: 'test' }

            const filteredIssues = IssueHandler.filterIssues(issues, filter)

            expect(filteredIssues.length).toBe(2)
            expect(filteredIssues).toEqual(issues)

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('filtering no issues', async done => {
        try {
            const issues = []
            const filter = { testing: 'test' }

            IssueHandler.filterIssues(issues, filter)

            done.fail('error should have been thrown') 

        } catch (err) {
            expect(err).toEqual(Error('No issues available'))
            done()
        }
    })
})

describe('splitIssues', () => {

    test('correctly splits issues with correct parameters', async done => {
        try {
            const issues = [
                {
                    status: 'test'
                },
                {
                    status: 'test2'
                },
                {
                    status: 'test3'
                }
            ]

            const splitIssues = IssueHandler.splitIssues(issues, 2)

            expect(splitIssues.length).toBe(2)
        } catch(err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('splits into one when length is less than rpp', async done => {
        try {
            const issues = [
                {
                    status: 'test'
                },
                {
                    status: 'test2'
                }
            ]

            const splitIssues = IssueHandler.splitIssues(issues, 3)

            expect(splitIssues.length).toBe(1)
        } catch(err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('split issues when no rpp provided', async done => {
        try {
            const issues = [
                {
                    status: 'test'
                },
                {
                    status: 'test2'
                }
            ]

            const splitIssues = IssueHandler.splitIssues(issues)

            expect(splitIssues.length).toBe(1)
        } catch(err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('split fails when no issues provided', async done => {
        try {
            IssueHandler.splitIssues()

            done.fail('error should have been thrown')
        } catch(err) {
            expect(err).toEqual(Error('No issues available'))
            done()
        } 
    })
})

describe('voteForIssue', () => {
    test('voting for a valid and existing issue', async done => {
        axios.post = jest.fn((endpoint, data) => Promise.resolve({
            data : 1,
            status: 200
        }))

        try {
            await expect(IssueHandler.voteForIssue(1, 'username'))
                .resolves.toEqual(1)
            expect(axios.post.mock.calls.length).toBe(1)
            expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/upvote')
            expect(axios.post.mock.calls[0][1]).toEqual({id: 1, username:'username'})

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('voting for an invalid issue', async done => {
        axios.post = jest.fn((endpoint, data) => Promise.reject(
            {
                response : {
                    status: 400,
                    message: 'you cannot vote for an issue multiple times'
                }
            }
        ))

        try {
            await expect(IssueHandler.voteForIssue(1, 'username'))
                .rejects.toEqual({
                    status: 400,
                    message: 'you cannot vote for an issue multiple times'
                })
            expect(axios.post.mock.calls.length).toBe(1)
            expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/upvote')
            expect(axios.post.mock.calls[0][1]).toEqual({id: 1, username:'username'})

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('voteAgainstIssue', () => {

    test('voting against a valid and existing issue', async done => {
        expect.assertions(4)

        axios.post = jest.fn((endpoint, data) => Promise.resolve({
            data : 1,
            status: 200
        }))

        try {
            await expect(IssueHandler.voteAgainstIssue(1, 'username'))
                .resolves.toEqual(1)
            expect(axios.post.mock.calls.length).toBe(1)
            expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/downvote')
            expect(axios.post.mock.calls[0][1]).toEqual({id: 1, username:'username'})

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })

    test('voting against an invalid issue', async done => {
        expect.assertions(4)

        axios.post = jest.fn((endpoint, data) => Promise.reject(
            {
                response : {
                    status: 400,
                    message: 'you cannot vote for an issue multiple times'
                }
            }
        ))

        try {
            await expect(IssueHandler.voteAgainstIssue(1, 'username'))
                .rejects.toEqual({
                    status: 400,
                    message: 'you cannot vote for an issue multiple times'
                })
            expect(axios.post.mock.calls.length).toBe(1)
            expect(axios.post.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/downvote')
            expect(axios.post.mock.calls[0][1]).toEqual({id: 1, username:'username'})

        } catch (err) {
            done.fail(err.message)
        } finally {
            done()
        }
    })
})

describe('fetchJobSheet', () => {

    test('fetching an avaialble job sheet', async done => {
        expect.assertions(4)
        
        axios.get = jest.fn((endpoint, options) => Promise.resolve({
            data : {},
            status: 200
        }))

        try {
            await expect(IssueHandler.fetchJobSheet())
                .resolves.toEqual({
                    data : {},
                    status: 200
                })

            expect(axios.get.mock.calls.length).toBe(1)
            expect(axios.get.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/joblist')
            expect(axios.get.mock.calls[0][1]).toEqual({responseType: 'blob'})

            done()
        } catch(err) {
            done.fail(err)
        }
    })

    test('fetching invalid job sheet', async done => {
        expect.assertions(4)
        
        axios.get = jest.fn((endpoint, options) => Promise.reject({
            response : {
                status: 400,
                message: 'invalid request'
            }
        }))

        try {
            await expect(IssueHandler.fetchJobSheet())
                .rejects.toEqual({
                    status: 400,
                    message: 'invalid request'
                })

            expect(axios.get.mock.calls.length).toBe(1)
            expect(axios.get.mock.calls[0][0]).toBe('https://mitch137-test-api.herokuapp.com/issues/joblist')
            expect(axios.get.mock.calls[0][1]).toEqual({responseType: 'blob'})

            done()
        } catch(err) {
            done.fail(err)
        }
    })
})