import { getBookings } from "@/lib/actions/admin";
import { BookingsTable } from "./bookings-table";

export default async function AdminBookingsPage() {
  const { data, count } = await getBookings(1, 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-inter-tight text-2xl font-bold text-foreground">Bookings</h1>
        <p className="mt-1 font-inter text-sm text-muted-secondary">
          All scheduled consultation bookings
        </p>
      </div>
      <BookingsTable initialData={data} initialCount={count} />
    </div>
  );
}
