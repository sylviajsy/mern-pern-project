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

      global.fetch = vi.fn().mockImplementation((url, options) => {
        // 1. POST /api/sightings/group
        if (url.includes("/api/sightings/group") && options?.method === "POST") {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ id: 20, message: "Success" }),
          });
        }

        // 2. GET /api/individuals
        if (url.includes("/api/individuals") && !options?.method) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 5, nickname: "Bao Bao" }, { id: 6, nickname: "Mei Xiang" }]),
          });
        }

        // 3. GET /api/sightings/group
        if (url.includes("/api/sightings/group") && !options?.method) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([
              {
                id: 20,
                sighting_time: "2026-03-11T03:02:00.000Z",
                location: "SiChuan Wolong Reserve",
                is_healthy: true,
                sighter_email: "group@test.com",
                individuals: ["Bao Bao", "Mei Xiang"],
              }
            ]),
          });
        }

        // 4. GET /api/sightings
        if (url.includes("/api/sightings") && !url.includes("/api/sightings/group") && !options?.method) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }

        return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
      });

      render(
        <DataProvider>
          <ListSightings />
        </DataProvider>
      );

      // Open modal
      const addBtn = await screen.findByText(/add new sightings/i);
      await user.click(addBtn);

      await user.click(screen.getByLabelText(/bao bao/i));
      await user.click(screen.getByLabelText(/mei xiang/i));
      await user.type(screen.getByPlaceholderText(/sighting time/i), "2026-03-11T03:02");
      await user.type(screen.getByPlaceholderText(/location/i), "SiChuan Wolong Reserve");
      await user.type(screen.getByPlaceholderText(/sighter email/i), "group@test.com");
      await user.click(document.getElementById('add-is_healthy'));

      const submitBtn = await screen.findByRole('button', { name: /add$/i });
      await user.click(submitBtn);

      // assert POST happened
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());

      const postCall = globalThis.fetch.mock.calls.find(
        ([url, options]) =>
          String(url).includes("/api/sightings/group") &&
          options?.method === "POST"
      );

      expect(postCall).toBeTruthy();

      const [url, options] = postCall;
      expect(url).toContain("/api/sightings/group");
      expect(options.method).toBe("POST");
      expect(options.headers).toEqual(
        expect.objectContaining({ "Content-Type": "application/json" })
      );

      const body = JSON.parse(options.body);
      expect(body.location).toBe("SiChuan Wolong Reserve");
      expect(body.sighter_email).toBe("group@test.com");
      expect(String(body.sighting_time)).toContain("2026-03-11T03:02");
      expect(body.individual_ids).toEqual(expect.arrayContaining([5, 6]));

      // assert refreshed group table shows new row
      expect(await screen.findByText(/Bao Bao/i)).toBeInTheDocument();
      expect(await screen.findByText(/group@test.com/i)).toBeInTheDocument();
      
    })
})