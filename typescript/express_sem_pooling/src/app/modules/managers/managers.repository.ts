// Database
import { createConnection } from "@/database";

// Entities
import { ManagerEntity } from "./entities/manager.entity";

interface IManagersRepository {
  findByEmail: (email: string) => Promise<Partial<ManagerEntity> | undefined>;
  findAll: (quantidade: number) => Promise<Partial<ManagerEntity>[]>;
}

export class ManagersRepository implements IManagersRepository {
  async findByEmail(email: string) {
    const client = await createConnection();
    const result = await client.query(
      `SELECT * FROM "Gerente" g WHERE g.email = $1 LIMIT 1`,
      [email]
    );
    await client.end();
    return result.rows[0] as Partial<ManagerEntity> | undefined;
  }

  async findAll(quantidade: number) {
    const client = await createConnection();
    const result = await client.query(`SELECT * FROM "Gerente" LIMIT $1`, [
      quantidade,
    ]);
    await client.end();
    return (result?.rows || []) as Partial<ManagerEntity>[];
  }
}
