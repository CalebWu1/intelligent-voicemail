import { api } from "~/trpc/server";
import { VoicemailWrapper } from "./_components/voicemailWrapper";

export default async function VoicemailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const voicemail = await api.voicemail.getById({ id });
  if (!voicemail) return <p>Voicemail not found.</p>;
  return <VoicemailWrapper voicemail={voicemail} />;
}