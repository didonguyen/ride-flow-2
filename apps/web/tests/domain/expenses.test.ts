import { describe, expect, it } from "vitest";

import {
  calculateExpenseBalances,
  splitExpenseEqually
} from "@/src/domain/expenses";

describe("expense domain", () => {
  it("splits an expense equally and assigns rounding remainder to earliest members", () => {
    expect(
      splitExpenseEqually({
        amount: 100,
        participantIds: ["member-a", "member-b", "member-c"]
      })
    ).toEqual([
      { memberId: "member-a", shareAmount: 33.34 },
      { memberId: "member-b", shareAmount: 33.33 },
      { memberId: "member-c", shareAmount: 33.33 }
    ]);
  });

  it("returns the full amount for a single participant", () => {
    expect(
      splitExpenseEqually({ amount: 45000, participantIds: ["member-a"] })
    ).toEqual([{ memberId: "member-a", shareAmount: 45000 }]);
  });

  it("rejects splits with no participants", () => {
    expect(() =>
      splitExpenseEqually({ amount: 100, participantIds: [] })
    ).toThrow("expense_participants_required");
  });

  it("calculates member balances from paid amounts and participant shares", () => {
    const balances = calculateExpenseBalances({
      expenses: [
        {
          amount: 90,
          paidByMemberId: "member-a",
          participants: [
            { memberId: "member-a", shareAmount: 30 },
            { memberId: "member-b", shareAmount: 30 },
            { memberId: "member-c", shareAmount: 30 }
          ]
        },
        {
          amount: 60,
          paidByMemberId: "member-b",
          participants: [
            { memberId: "member-b", shareAmount: 30 },
            { memberId: "member-c", shareAmount: 30 }
          ]
        }
      ],
      members: [
        { id: "member-a", name: "An" },
        { id: "member-b", name: "Binh" },
        { id: "member-c", name: "Chi" }
      ]
    });

    expect(balances).toEqual([
      { amount: 60, memberId: "member-a", name: "An", tone: "gets" },
      { amount: 0, memberId: "member-b", name: "Binh", tone: "settled" },
      { amount: 60, memberId: "member-c", name: "Chi", tone: "owes" }
    ]);
  });
});
