import { notFound } from "next/navigation";
import { PhotoView } from "@/components/PhotoView";
import { getSiteContent, getPhotoWithNeighbors } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [content, result] = await Promise.all([getSiteContent(), getPhotoWithNeighbors(id)]);
  if (!result) notFound();

  return (
    <PhotoView
      content={content}
      photo={result.photo}
      prevId={result.prevId}
      nextId={result.nextId}
      index={result.index}
      total={result.total}
    />
  );
}
