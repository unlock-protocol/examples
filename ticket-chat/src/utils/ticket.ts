import * as z from "zod";

export const Ticket = z.object({
  account: z.string(),
  timestamp: z.number(),
  tokenId: z
    .union([z.string(), z.number()])
    .transform((value) => value.toString()),
  network: z.number(),
  lockAddress: z.string(),
});

const TicketObject = z.object({
  data: Ticket,
  sig: z.string(),
  raw: z.string(),
});

interface Options {
  data?: string | null;
  sig?: string | null;
}

export function parseTicket({ data, sig }: Options) {
  try {
    if (!(sig && data)) {
      return;
    }
    const raw = decodeURIComponent(data);
    const result = TicketObject.parse({
      sig,
      raw,
      data: JSON.parse(raw),
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}
