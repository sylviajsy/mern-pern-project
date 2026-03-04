import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";
import ListSightings from '../components/ListSightings';
import { describe } from "vitest";
import { vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeAll(() => {
  vi.spyOn(global, "fetch");
});

afterAll(() => {
  vi.restoreAllMocks();
});

function mockFetchJsonOnce(data, { ok = true, status = 200 } = {}) {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(data),
    })
  );
}

describe('ListSightings API Integration test', () => {

    test('GET /api/sightings - fetches and displays Sightings table by group', async () => {
      mockFetchJsonOnce([
        { id: 1, nickname: 'Simba', sighting_time: '2024-03-20T06:00:00Z', location: 'A', is_healthy: true, sighter_email: 's@test.com' },
        { id: 2, nickname: 'Simba', sighting_time: '2024-03-12T18:45:00Z', location: 'B', is_healthy: false, sighter_email: 's@test.com' }
      ])

        render(<ListSightings />);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/sightings")
        );
        expect(await screen.findAllByText("Simba")).toHaveLength(1);

        expect(await screen.findAllByText("s@test.com")).toHaveLength(2);
    })
})