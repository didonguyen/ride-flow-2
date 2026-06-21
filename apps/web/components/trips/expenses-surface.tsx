"use client";

import { useState } from "react";
import { Pencil, Play, Plus } from "lucide-react";

import { AiInsightCard } from "@/components/trip/ai-insight-card";
import { BudgetUsageBar } from "@/components/trip/budget-usage-bar";
import { MemberBalanceRow } from "@/components/trip/member-balance-row";
import { SettlementRow } from "@/components/trip/settlement-row";
import { TransactionRow } from "@/components/trip/transaction-row";
import { TripStatCard } from "@/components/trip/trip-stat-card";
import { getTripExpenseSummary } from "@/src/application/trips/expenses-data";
import { Wallet } from "lucide-react";

type ExpensesSurfaceProps = {
  tripId: string;
  tripName: string;
};

export function ExpensesSurface({ tripId, tripName }: ExpensesSurfaceProps) {
  const summary = getTripExpenseSummary();
  const [splitEqually, setSplitEqually] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettle, setShowSettle] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [riding, setRiding] = useState(false);

  return (
    <section
      aria-label={`Expenses for ${tripName}`}
      className="flex flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
      data-testid="expenses-surface"
      data-trip-id={tripId}
    >
      <input
        aria-label="Edit trip details"
        checked={editingDetails}
        className="sr-only"
        data-testid="expenses-edit-toggle"
        onChange={(event) => setEditingDetails(event.target.checked)}
        readOnly={false}
        type="checkbox"
      />
      <input
        aria-label="Toggle ride mode"
        checked={riding}
        className="sr-only"
        data-testid="expenses-ride-toggle"
        onChange={(event) => setRiding(event.target.checked)}
        type="checkbox"
      />
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-forest-800/95 px-5 py-4 text-white shadow-rideflow-editorial-card"
        data-testid="expenses-cover-actions"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Expenses for {tripName}
          </p>
          <p className="text-sm text-white/80">
            Track who paid, settle up at the end of the ride.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            data-testid="expenses-edit-details"
            type="button"
            onClick={() => setEditingDetails((value) => !value)}
          >
            <Pencil aria-hidden="true" className="h-3.5 w-3.5" />
            {editingDetails ? "Editing…" : "Edit Details"}
          </button>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-ink-950 shadow-rideflow-editorial-card transition hover:bg-amber-500"
            data-testid="expenses-start-ride"
            type="button"
            onClick={() => setRiding((value) => !value)}
          >
            <Play aria-hidden="true" className="h-3.5 w-3.5" />
            {riding ? "Riding…" : "Start Ride"}
          </button>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <TripStatCard
            icon={Wallet}
            label="Total Spent"
            value={`$${summary.totalSpent}`}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Trip Budget"
            value={`$${summary.budget}`}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Pending"
            tone="pending"
            value={`$${summary.pending}`}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Per Person"
            value={`$${summary.perPerson}`}
          />
        </li>
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <article
            aria-label="Budget usage"
            className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-budget-usage"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-950">Budget Usage</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                {Math.round((summary.totalSpent / summary.budget) * 100)}% of $
                {summary.budget} used
              </span>
            </div>
            <BudgetUsageBar
              slices={summary.breakdown}
              total={summary.budget}
            />
          </article>

          <article
            aria-label="Recent expenses"
            className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-recent"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-950">Recent Expenses</h2>
              <div className="flex items-center gap-2">
                <button
                  aria-pressed={splitEqually}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                    splitEqually
                      ? "border-forest-800 bg-forest-800 text-white"
                      : "border-paper-200 bg-paper-50 text-ink-700 hover:border-forest-800/40"
                  )}
                  data-testid="expenses-split-equally"
                  type="button"
                  onClick={() => setSplitEqually((value) => !value)}
                >
                  Split equally
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-forest-800 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-forest-700"
                  data-testid="expenses-add"
                  type="button"
                  onClick={() => setShowAddExpense((value) => !value)}
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  Add expense
                </button>
              </div>
            </div>
            {showAddExpense ? (
              <p
                className="rounded-2xl bg-sage-100 px-4 py-3 text-xs font-semibold text-forest-800"
                data-testid="expenses-add-confirmation"
              >
                Draft expense form will open here. Closing this confirmation for now.
              </p>
            ) : null}
            <div className="flex flex-col gap-3">
              {summary.transactions.map((transaction) => (
                <TransactionRow
                  amount={transaction.amount}
                  category={transaction.category}
                  date={transaction.date}
                  key={transaction.id}
                  paidBy={transaction.paidBy}
                  status={transaction.status}
                  title={transaction.title}
                />
              ))}
            </div>
            <button
              className="text-center text-sm font-semibold text-forest-800 underline-offset-4 hover:underline"
              data-testid="expenses-view-all"
              type="button"
            >
              View all expenses
            </button>
          </article>
        </div>

        <div className="flex flex-col gap-6">
          <article
            aria-label="Settlement"
            className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-settlement"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-950">Settlement</h2>
              <span aria-hidden="true" className="text-forest-800">
                ↔
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {summary.settlements.map((settlement) => (
                <SettlementRow
                  amount={settlement.amount}
                  creditorName={settlement.creditorName}
                  debtorInitial={settlement.debtorInitial}
                  debtorName={settlement.debtorName}
                  key={settlement.id}
                />
              ))}
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
              data-testid="expenses-settle-all"
              type="button"
              onClick={() => setShowSettle((value) => !value)}
            >
              {showSettle ? "Settling…" : "Settle all balances"}
            </button>
            {showSettle ? (
              <p
                className="rounded-2xl bg-sage-100 px-4 py-3 text-xs font-semibold text-forest-800"
                data-testid="expenses-settle-confirmation"
              >
                We sent a settlement nudge to every member. Mark all balances as
                paid when the transfers land.
              </p>
            ) : null}
          </article>

          <article
            aria-label="Member balances"
            className="flex flex-col gap-1 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-member-balances"
          >
            <h2 className="font-display text-xl text-ink-950">Member Balances</h2>
            <ul className="divide-y divide-paper-200">
              {summary.balances.map((balance) => (
                <li key={balance.id}>
                  <MemberBalanceRow
                    amount={balance.amount}
                    initial={balance.initial}
                    name={balance.name}
                    tone={balance.tone}
                  />
                </li>
              ))}
            </ul>
          </article>

          <AiInsightCard
            actionLabel={summary.insight.actionLabel}
            body={summary.insight.body}
            title={summary.insight.title}
          />
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
