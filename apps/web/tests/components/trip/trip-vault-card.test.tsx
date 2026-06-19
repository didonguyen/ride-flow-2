import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TripVaultCard } from "@/components/trip/trip-vault-card";

describe("TripVaultCard", () => {
  it("renders the three stat rows and the Add Memory button", async () => {
    const onAdd = vi.fn();
    render(
      <TripVaultCard
        journalCount={7}
        onAddMemory={onAdd}
        photosCount={48}
        placesCount={12}
      />
    );
    expect(screen.getByTestId("trip-vault-stat-photos")).toHaveTextContent("48");
    expect(screen.getByTestId("trip-vault-stat-journal-entries")).toHaveTextContent("7");
    expect(screen.getByTestId("trip-vault-stat-places-saved")).toHaveTextContent("12");
    await userEvent.click(screen.getByTestId("trip-vault-add"));
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
