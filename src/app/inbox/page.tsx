'use client';
import { useState } from "react";
import { InboxWrapper} from "./_components/inboxWrapper"
import { useSearchParams } from 'next/navigation';

export default function Inbox() {
  const searchParams = useSearchParams();
const [filterUrgency] = useState<string>(
  searchParams.get('urgency')?.toUpperCase() ?? 'ALL'
);
  return (
      <InboxWrapper priorityFilter={filterUrgency} />
  )
}