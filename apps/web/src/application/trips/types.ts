import type { TripDayDraft } from "@/src/domain/trips";

export type TripBaseInput = {
  ownerId: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  transport?: string;
  coverImagePath?: string | null;
  coverImageUrl?: string | null;
};

export type CreateTripInput = TripBaseInput & {
  ownerEmail?: string | null;
};

export type PersistTripWithDaysInput = CreateTripInput & {
  days: TripDayDraft[];
};

export type CreatedTripDay = {
  id: string;
  tripId: string;
  date: string;
  dayIndex: number;
};

export type CreatedTrip = TripBaseInput & {
  id: string;
  days: CreatedTripDay[];
  transport: string;
};

export type CreateTripError =
  | "trip_name_required"
  | "trip_destination_required"
  | "trip_date_invalid"
  | "trip_end_before_start";

export type TripRepository = {
  createTripWithDays(input: PersistTripWithDaysInput): Promise<CreatedTrip>;
  updateTripCover?(input: {
    coverImagePath: string;
    coverImageUrl: string;
    tripId: string;
  }): Promise<void>;
};

export type TripDayRepository = {
  addTripDay(input: {
    date: string;
    dayIndex: number;
    tripId: string;
  }): Promise<CreatedTripDay>;
  updateTripEndDate(input: { endDate: string; tripId: string }): Promise<void>;
};

export type TripQueryRepository = {
  listDashboardTrips(): Promise<
    {
      id: string;
      name: string;
      destination: string;
      startDate: string;
      endDate: string;
      createdAt: string;
      coverImageUrl?: string | null;
      transport?: string | null;
    }[]
  >;
};

export type MemoryAssetInput = {
  altText?: string;
  imagePath: string;
  imageUrl: string;
  sortOrder: number;
};

export type MemoryRecord = {
  assets: Array<MemoryAssetInput & { id: string }>;
  content: string;
  createdAt: string;
  createdBy: string;
  id: string;
  title: string;
  tripId: string;
};

export type MemoryRepository = {
  createMemory(input: {
    assets: MemoryAssetInput[];
    content: string;
    createdBy: string;
    title: string;
    tripId: string;
  }): Promise<{ id: string }>;
  deleteMemory(input: { memoryId: string }): Promise<{ id: string }>;
  listMemories(tripId: string): Promise<MemoryRecord[]>;
};

export type ExpenseParticipantInput = {
  memberId: string;
  shareAmount: number;
};

export type ExpenseRecord = {
  amount: number;
  category: string;
  createdBy: string;
  currency: string;
  date: string;
  id: string;
  notes: string;
  paidByMemberId: string;
  participants: ExpenseParticipantInput[];
  title: string;
  tripId: string;
};

export type ExpenseRepository = {
  createExpense(input: {
    amount: number;
    category: string;
    createdBy: string;
    currency: string;
    date: string;
    notes: string;
    paidByMemberId: string;
    participants: ExpenseParticipantInput[];
    title: string;
    tripId: string;
  }): Promise<{ id: string }>;
  deleteExpense(input: { expenseId: string }): Promise<{ id: string }>;
  listExpenses(tripId: string): Promise<ExpenseRecord[]>;
  updateExpense(input: {
    amount: number;
    category: string;
    currency: string;
    date: string;
    expenseId: string;
    notes: string;
    paidByMemberId: string;
    participants: ExpenseParticipantInput[];
    title: string;
    tripId: string;
  }): Promise<{ id: string }>;
};
