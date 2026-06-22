"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, Wallet } from "lucide-react";

import { AiInsightCard } from "@/components/trip/ai-insight-card";
import { BudgetUsageBar } from "@/components/trip/budget-usage-bar";
import { MemberBalanceRow } from "@/components/trip/member-balance-row";
import { TripStatCard } from "@/components/trip/trip-stat-card";
import { ActionModal } from "@/components/ui/action-modal";
import type { TripMemberRecord } from "@/src/application/members/types";
import type {
  TripExpense,
  TripExpenseSummary
} from "@/src/application/trips/expenses-data";

type ExpensesSurfaceProps = {
  addExpenseAction?: (formData: FormData) => Promise<void> | void;
  deleteExpenseAction?: (formData: FormData) => Promise<void> | void;
  members?: TripMemberRecord[];
  summary: TripExpenseSummary;
  tripId: string;
  tripName: string;
  updateExpenseAction?: (formData: FormData) => Promise<void> | void;
};

export function ExpensesSurface({
  addExpenseAction,
  deleteExpenseAction,
  members = [],
  summary,
  tripId,
  tripName,
  updateExpenseAction
}: ExpensesSurfaceProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<TripExpense | null>(null);
  const [showSettle, setShowSettle] = useState(false);
  const activeBalances = summary.balances.filter(isActiveBalance);
  const editingExpense =
    summary.transactions.find((expense) => expense.id === editingExpenseId) ?? null;

  return (
    <section
      aria-label={`Expenses for ${tripName}`}
      className="flex flex-col gap-6 px-5 py-8 sm:px-8 lg:px-10 lg:py-10"
      data-testid="expenses-surface"
      data-trip-id={tripId}
    >
      <ActionModal
        description="Record who paid, who joined, and how the shared cost should be split."
        onOpenChange={setShowAddExpense}
        open={showAddExpense}
        title="Add expense"
      >
        <ExpenseForm
          action={addExpenseAction}
          onSubmit={() => setShowAddExpense(false)}
          members={members}
          submitLabel="Save expense"
          tripId={tripId}
        />
      </ActionModal>

      <ActionModal
        description="Update the amount, category, payer, notes, or joined members."
        onOpenChange={(open) => {
          if (!open) setEditingExpenseId(null);
        }}
        open={Boolean(editingExpense)}
        title="Edit expense"
      >
        {editingExpense ? (
          <ExpenseForm
            action={updateExpenseAction}
            onSubmit={() => setEditingExpenseId(null)}
            expense={editingExpense}
            members={members}
            submitLabel="Update expense"
            tripId={tripId}
          />
        ) : null}
      </ActionModal>

      <ActionModal
        description={
          deletingExpense
            ? `This removes "${deletingExpense.title}" from the trip expense list.`
            : undefined
        }
        onOpenChange={(open) => {
          if (!open) setDeletingExpense(null);
        }}
        open={Boolean(deletingExpense)}
        title="Delete expense"
      >
        {deletingExpense ? (
          <form
            action={deleteExpenseAction}
            className="flex flex-wrap gap-2"
            onSubmit={() => setDeletingExpense(null)}
          >
            <input name="tripId" type="hidden" value={tripId} />
            <input name="expenseId" type="hidden" value={deletingExpense.id} />
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              data-testid={`expenses-delete-confirm-${deletingExpense.id}`}
              type="submit"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
              Delete expense
            </button>
            <button
              className="inline-flex items-center justify-center rounded-full border border-paper-300 bg-white px-4 py-2 text-sm font-semibold text-ink-700 transition hover:bg-paper-100"
              type="button"
              onClick={() => setDeletingExpense(null)}
            >
              Cancel
            </button>
          </form>
        ) : null}
      </ActionModal>

      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-forest-800/95 px-5 py-4 text-white shadow-rideflow-editorial-card"
        data-testid="expenses-cover-actions"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Expenses for {tripName}
          </p>
          <p className="text-sm text-white/80">
            Track who paid and who joined each shared cost.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-ink-950 shadow-rideflow-editorial-card transition hover:bg-amber-500"
          data-testid="expenses-add"
          type="button"
          onClick={() => setShowAddExpense(true)}
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Add expense
        </button>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li>
          <TripStatCard
            icon={Wallet}
            label="Total Spent"
            value={formatMoney(summary.totalSpent, summary.currency)}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Expenses"
            value={`${summary.transactions.length}`}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Members"
            tone="pending"
            value={`${summary.memberCount}`}
          />
        </li>
        <li>
          <TripStatCard
            icon={Wallet}
            label="Per Person"
            value={formatMoney(summary.perPerson, summary.currency)}
          />
        </li>
      </ul>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <article
            aria-label="Category usage"
            className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-category-usage"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-ink-950">Category Usage</h2>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                {formatMoney(summary.totalSpent, summary.currency)} recorded
              </span>
            </div>
            <BudgetUsageBar
              caption="Based on recorded expenses only."
              slices={summary.breakdown}
              total={summary.totalSpent}
            />
          </article>

          <article
            aria-label="Recent expenses"
            className="flex flex-col gap-4 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-recent"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl text-ink-950">Recent Expenses</h2>
            </div>
            {summary.transactions.length === 0 ? (
              <p
                className="rounded-2xl border border-dashed border-paper-200 bg-paper-50 px-4 py-6 text-center text-sm text-ink-500"
                data-testid="expenses-empty"
              >
                No expenses recorded yet.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {summary.transactions.map((transaction) => (
                  <ExpenseRow
                    canDelete={Boolean(deleteExpenseAction)}
                    canEdit={Boolean(updateExpenseAction)}
                    key={transaction.id}
                    onDelete={() => setDeletingExpense(transaction)}
                    onEdit={() => setEditingExpenseId(transaction.id)}
                    transaction={transaction}
                  />
                ))}
              </div>
            )}
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
                -&gt;
              </span>
            </div>
            <button
              className="inline-flex w-full items-center justify-center rounded-full bg-forest-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-700"
              data-testid="expenses-settle-all"
              type="button"
              onClick={() => setShowSettle((value) => !value)}
            >
              {showSettle ? "Settlement noted" : "Settle all balances"}
            </button>
            {showSettle ? (
              <p
                className="rounded-2xl bg-sage-100 px-4 py-3 text-xs font-semibold text-forest-800"
                data-testid="expenses-settle-confirmation"
              >
                Payment settlement is not connected yet. Use the balances below
                as the current shared-expense guide.
              </p>
            ) : null}
          </article>

          <article
            aria-label="Member balances"
            className="flex flex-col gap-1 rounded-2xl bg-paper-50 p-5 shadow-rideflow-editorial-card ring-1 ring-paper-200"
            data-testid="expenses-member-balances"
          >
            <h2 className="font-display text-xl text-ink-950">Member Balances</h2>
            {activeBalances.length === 0 ? (
              <p className="py-3 text-sm font-medium text-ink-500">
                Everyone is settled.
              </p>
            ) : (
              <ul className="divide-y divide-paper-200">
                {activeBalances.map((balance) => (
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
            )}
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

function ExpenseRow({
  canDelete,
  canEdit,
  onDelete,
  onEdit,
  transaction
}: {
  canDelete: boolean;
  canEdit: boolean;
  onDelete: () => void;
  onEdit: () => void;
  transaction: TripExpense;
}) {
  return (
    <article
      className="flex flex-col gap-3 rounded-2xl bg-paper-50 p-4 ring-1 ring-paper-200"
      data-testid="transaction-row"
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-forest-800">
          <Wallet aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-ink-950">
            {transaction.title}
          </h3>
          <p className="text-xs font-medium text-ink-500">
            Paid by {transaction.paidBy} - {transaction.date} - {transaction.category}
          </p>
        </div>
        <span className="text-base font-semibold text-ink-950">
          {formatMoney(transaction.amount, transaction.currency)}
        </span>
        {canEdit ? (
          <button
            aria-label={`Edit ${transaction.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper-100 text-ink-700 transition hover:bg-sage-100"
            data-testid={`expenses-edit-${transaction.id}`}
            type="button"
            onClick={onEdit}
          >
            <Pencil aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
        {canDelete ? (
          <button
            aria-label={`Delete ${transaction.title}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700 transition hover:bg-red-100"
            data-testid={`expenses-delete-${transaction.id}`}
            type="button"
            onClick={onDelete}
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function ExpenseForm({
  action,
  expense,
  members,
  submitLabel,
  tripId,
  onSubmit
}: {
  action?: (formData: FormData) => Promise<void> | void;
  expense?: TripExpense;
  members: TripMemberRecord[];
  submitLabel: string;
  tripId: string;
  onSubmit?: () => void;
}) {
  const defaultPaidBy = expense?.paidByMemberId ?? members[0]?.id ?? "";
  const selectedParticipants = new Set(
    expense?.participantIds ?? members.map((member) => member.id)
  );

  return (
    <form
      action={action}
      className="grid gap-3 rounded-2xl bg-sage-100 p-4"
      data-testid={expense ? "expenses-edit-form" : "expenses-add-form"}
      onSubmit={onSubmit}
    >
      <input name="tripId" type="hidden" value={tripId} />
      {expense ? <input name="expenseId" type="hidden" value={expense.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Title
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={expense?.title ?? ""}
            name="title"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Amount
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={expense?.amount ?? ""}
            min="0.01"
            name="amount"
            required
            step="0.01"
            type="number"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Currency
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm uppercase text-ink-950 outline-none focus:border-forest-800"
            defaultValue={expense?.currency ?? "VND"}
            maxLength={3}
            name="currency"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Category
          <select
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={expense?.category ?? "food"}
            name="category"
          >
            {["food", "fuel", "stay", "tickets", "transport", "other"].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Date
          <input
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={toDateInputValue(expense?.dateValue)}
            name="date"
            type="date"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Paid by
          <select
            className="rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
            defaultValue={defaultPaidBy}
            name="paidByMemberId"
          >
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.email}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
        Notes
        <textarea
          className="min-h-20 rounded-xl border border-paper-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-ink-950 outline-none focus:border-forest-800"
          defaultValue={expense?.notes ?? ""}
          name="notes"
        />
      </label>
      <fieldset className="grid gap-2">
        <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-800">
          Joined this expense
        </legend>
        {members.length === 0 ? (
          <p className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-ink-500">
            Invite trip members before adding shared expenses.
          </p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {members.map((member) => (
            <label
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-ink-700"
              key={member.id}
            >
              <input
                defaultChecked={selectedParticipants.has(member.id)}
                name="participantIds"
                type="checkbox"
                value={member.id}
              />
              {member.email}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        className="inline-flex w-fit items-center justify-center rounded-full bg-forest-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:bg-ink-300"
        data-testid={expense ? "expenses-edit-submit" : "expenses-add-submit"}
        disabled={members.length === 0}
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function formatMoney(amount: number, currency: string) {
  const safeCurrency = /^[A-Z]{3}$/.test(currency) ? currency : "VND";

  return new Intl.NumberFormat("vi-VN", {
    currency: safeCurrency,
    maximumFractionDigits: safeCurrency === "VND" ? 0 : 2,
    style: "currency"
  }).format(amount);
}

function toDateInputValue(value?: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Date().toISOString().slice(0, 10);
}

function isActiveBalance(
  balance: TripExpenseSummary["balances"][number]
): balance is TripExpenseSummary["balances"][number] & { tone: "gets" | "owes" } {
  return balance.tone !== "settled";
}
