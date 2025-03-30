// Database
import { createConnection } from "@/database";

// Entities
import { BranchEntity } from "./entities/branch.entity";

interface IBranchsRepository {
  findById: (id: string) => Promise<Partial<BranchEntity> | undefined>;
}

export class BranchsRepository implements IBranchsRepository {
  async findById(id: string) {
    const client = await createConnection();
    const result = await client.query(
      `SELECT * FROM "Agencia" a WHERE a.id = $1 LIMIT 1`,
      [id]
    );
    await client.end();
    return result?.rows[0] as Partial<BranchEntity> | undefined;
  }

  async findAll() {
    const client = await createConnection();
    const result = await client.query(`SELECT * FROM "Agencia" a`);
    await client.end();
    return (result?.rows || []) as BranchEntity[];
  }
}
