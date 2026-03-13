import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, vi } from "vitest";
import IndividualForm from "../components/IndividualForm";
import { DataProvider } from "../context/DataContext";

describe('Individual Form Unit Test', () => {
    const mockOnAdd = vi.fn();

    test('User can type Nick Name', async() => {
        const user = userEvent.setup();

        render(<IndividualForm onAdd={mockOnAdd} />);

        const input = screen.getByPlaceholderText(/nick name/i);

        await user.type(input, "Simba");

        expect(input.value).toBe("Simba");
    })
})