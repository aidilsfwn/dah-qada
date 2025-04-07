import Dexie, { Table } from "dexie";

export interface QadaSalah {
  id?: number;
  date: string;
  salahTime: string;
  reason?: string;
  status: "open" | "done";
}

class DahQadaDatabase extends Dexie {
  qadaSalah!: Table<QadaSalah>;

  constructor() {
    super("DahQadaDatabase");
    this.version(1).stores({
      qadaSalah: "++id, date",
    });
  }
}

export const db = new DahQadaDatabase();
