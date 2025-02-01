// Database
import { db } from "@/database";

// Entities
import { BranchEntity } from "./entities/branch.entity";

interface IBranchsRepository {
  findById: (id: string) => Promise<Partial<BranchEntity> | undefined>;
}

export class BranchsRepository implements IBranchsRepository {
  async findById(id: string) {
    const result = await db.query(
      `SELECT * FROM "Agencia" a WHERE a.id = $1 LIMIT 1`,
      [id]
    );

    return result.rows[0] as Partial<BranchEntity> | undefined;
  }
}
