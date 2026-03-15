import { notFound } from "next/navigation";
import PrinterReveal from "../components/PrinterReveal";
import data from "@/data.json";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketPage({ params }: PageProps) {
  const { id } = await params;
  const ticket = data.users[id as keyof typeof data.users];

  if (!ticket) return notFound();

  return (
    <main className="min-h-screen bg-slate-900">
      <PrinterReveal name={ticket.name} teams={ticket.teams} />
    </main>
  );
}

export function generateStaticParams() {
  return Object.keys(data.users).map((id) => ({ id }));
}
