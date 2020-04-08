const app = require('../../app/gcapi')
const supertest = require('supertest')
const request = supertest(app)
const matchers = require('jest-json-schema').matchers
expect.extend(matchers)

describe('/all endpoint with no queries', () => {
    let res

    beforeAll(async () => {
        res = await request.get('/api/v1/all')
    })

    test('should be defined.', async () => {
        expect(res).toBeDefined()
    })

    test('should respond with 200 status code.', async () => {
        expect(res.status).toBe(200)
    })

    test('should return an object', async () => {
        expect(typeof res.body).toBe('object')
    })
})
