import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { waitFor } from "@testing-library/react";
import ListSightings from '../components/ListSightings';
import { describe } from "vitest";
import { vi } from "vitest";
import { DataProvider } from "../context/DataContext";
import "@testing-library/jest-dom";

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

    test('GET /api/sightings - fetches and displays Sightings table by grouped nickname', async () => {
      mockFetchJsonOnce([
        { id: 1, nickname: 'Simba', sighting_time: '2024-03-20T06:00:00Z', location: 'A', is_healthy: true, sighter_email: 's@test.com' },
        { id: 2, nickname: 'Simba', sighting_time: '2024-03-12T18:45:00Z', location: 'B', is_healthy: false, sighter_email: 's@test.com' }
      ])

      render(
        <DataProvider>
          <ListSightings />
        </DataProvider>
      );

      await waitFor(() => expect(global.fetch).toHaveBeenCalled());

      expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining("/api/sightings")
      );
      expect(await screen.findAllByText("Simba")).toHaveLength(1);

      expect(await screen.findAllByText("s@test.com")).toHaveLength(2);
    })

    test('GET /api/sightings/group - shows group sightings table data', async () => {
      mockFetchJsonOnce([]);
      mockFetchJsonOnce([
        {
          id: 20,
          sighting_time: "2026-03-11T03:02:00.000Z",
          location: "SiChuan Wolong Reserve",
          is_healthy: true,
          sighter_email: "group@test.com",
          individuals: ["Bao Bao", "Mei Xiang"],
        },
      ]);

      render(
        <DataProvider>
          <ListSightings />
        </DataProvider>
      );

      await waitFor(() => expect(global.fetch).toHaveBeenCalled());

      expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/sightings/group")
      );

      expect(await screen.findByText("Group Sightings")).toBeInTheDocument();
      expect(await screen.findByText("SiChuan Wolong Reserve")).toBeInTheDocument();
      expect(await screen.findByText("Bao Bao, Mei Xiang")).toBeInTheDocument();
      expect(await screen.findByText("group@test.com")).toBeInTheDocument();
    })

    test('POST /api/sightings/group - user can add a group sighting', async () => {
      const user = userEvent.setup();
      // 1) initial GET /api/sightings
      mockFetchJsonOnce([]);

      // 2) initial GET /api/sightings/group
      mockFetchJsonOnce([]);

      render(
        <DataProvider>
          <ListSightings />
        </DataProvider>
      );

      // Fetch Individual table
      mockFetchJsonOnce([
        { id: 5, nickname: "Bao Bao" },
        { id: 6, nickname: "Mei Xiang" },
      ]);

      // Open modal
      const addBtn = await screen.findByText(/add new sightings/i);
      await user.click(addBtn);

      await user.click(screen.getByLabelText(/bao bao/i));
      await user.click(screen.getByLabelText(/mei xiang/i));
      await user.type(screen.getByPlaceholderText(/sighting time/i), "2026-03-11T03:02");
      await user.type(screen.getByPlaceholderText(/location/i), "SiChuan Wolong Reserve");
      await user.type(screen.getByPlaceholderText(/sighter email/i), "group@test.com");
      await user.click(screen.getByPlaceholderText(/healthy/i));

      // 3) POST
      mockFetchJsonOnce({ id: 20, success: true });

      // 4) refreshAfterSightingChange()
      mockFetchJsonOnce([]);
      mockFetchJsonOnce([]);
      
      // 5) POST /api/sightings/group
      mockFetchJsonOnce([
        {
          id: 20,
          sighting_time: "2026-03-11T03:02:00.000Z",
          location: "SiChuan Wolong Reserve",
          is_healthy: true,
          sighter_email: "group@test.com",
          individuals: [5, 6],
        },
      ]);

      const submitBtn = screen.getByRole('button', { name: /add/i });
      await user.click(submitBtn);

      await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(3));

      const [url, options] = globalThis.fetch.mock.calls[2];
      expect(url).toContain("/api/sightings/group");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual(expect.objectContaining({ "Content-Type": "application/json" }));

      const body = JSON.parse(options.body);
      expect(body.location).toBe("SiChuan Wolong Reserve");
      expect(String(body.sighting_time)).toContain("2026-03-11T03:02");
    })
})