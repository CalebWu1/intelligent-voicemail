'use client';
import { Suspense } from "react";
import { InboxWrapper} from "./_components/inboxWrapper"
import { useSearchParams } from 'next/navigation';

function InboxPage() {
  const searchParams = useSearchParams();
  const filterUrgency = searchParams.get('urgency')?.toUpperCase() ?? 'ALL';

  return <InboxWrapper priorityFilter={filterUrgency} />;
}

export default function Inbox() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InboxPage />
    </Suspense>
  );
}