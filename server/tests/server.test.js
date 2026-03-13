const app = require("../app");
const db = require('../db/db-connection');

// Mock db.query
jest.mock("../db/db-connection", () => ({
  query: jest.fn(),
}));

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

function mockReq({ params = {}, body = {}, query = {} } = {}) {
  return { params, body, query };
}

function getHandler(app, method, path) {
  const layer = app._router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method]
  );
  return layer.route.stack[0].handle;
}

describe('Backend route handler unit tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /api/sightings/group - returns grouped sightings', async () => {
        db.query.mockResolvedValueOnce({
            rows: [
                {
                id: 20,
                sighting_time: "2026-03-11T03:02:00.000Z",
                location: "SiChuan Wolong Reserve",
                is_healthy: true,
                sighter_email: "group@test.com",
                individuals: ["Bao Bao", "Mei Xiang"],
                },
            ],
        })

        const handler = getHandler(app, "get", "/api/sightings/group");
        const req = mockReq();
        const res = mockRes();

        await handler(req, res);

        const [sql] = db.query.mock.calls[0];
        expect(sql).toMatch(/ARRAY_AGG\(i\.nickname ORDER BY i\.nickname\) AS individuals/i);
        expect(sql).toMatch(/HAVING COUNT\(si\.individual_id\) > 1/i);

        expect(res.json).toHaveBeenCalledWith([
        {
            id: 20,
            sighting_time: "2026-03-11T03:02:00.000Z",
            location: "SiChuan Wolong Reserve",
            is_healthy: true,
            sighter_email: "group@test.com",
            individuals: ["Bao Bao", "Mei Xiang"],
        },
        ]);
    })
})