export type Block = { start: Date; end: Date; title?: string; id?: number };

export function detectOverlap(
  requestedStart: Date,
  durationMinutes: number,
  busyBlocks: Block[]
) {
  const requestedEnd = new Date(requestedStart.getTime() + durationMinutes * 60000);
  const conflicts = busyBlocks.filter(({ start, end }) => requestedStart < end && start < requestedEnd);
  return {
    hasConflict: conflicts.length > 0,
    conflicts,
    requestedEnd,
  };
}
