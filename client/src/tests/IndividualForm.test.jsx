import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, vi } from "vitest";
import IndividualForm from "../components/IndividualForm";
import "@testing-library/jest-dom";

describe('Individual Form Unit Test', () => {
    const mockOnAdd = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        globalThis.fetch = vi.fn();
    });

    test('User can type Nick Name', async () => {
        const user = userEvent.setup();

        render(<IndividualForm onAdd={mockOnAdd} />);

        const input = screen.getByPlaceholderText(/nick name/i);

        await user.type(input, "Simba");

        expect(input.value).toBe("Simba");
    })

    test('user can select species from dropdown', async () => {
        const user = userEvent.setup();

        const mockSpecies = [
            { id: 1, common_name: 'Tiger' }
        ];

        globalThis.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockSpecies,
        });

        render(<IndividualForm onAdd={mockOnAdd} />);

        const select = await screen.findByRole("combobox");

        // Initial Value
        await expect(select.value).toBe("");

        await user.selectOptions(select, "1");

        expect(select.value).toBe("1");

        const selectedOption = screen.getByRole('option', { name: 'Tiger' });
        expect(selectedOption.selected).toBe(true);
    })
})