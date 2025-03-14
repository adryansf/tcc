// Database
import { db } from "@/database";

// Entities
import { ManagerEntity } from "./entities/manager.entity";

interface IManagersRepository {
  findByEmail: (email: string) => Promise<Partial<ManagerEntity> | undefined>;
  findAll: (quantidade: number) => Promise<Partial<ManagerEntity>[]>;
}

export class ManagersRepository implements IManagersRepository {
  async findByEmail(email: string) {
    const result = await db.query(
      `SELECT * FROM "Gerente" g WHERE g.email = $1 LIMIT 1`,
      [email]
    );

    return result.rows[0] as Partial<ManagerEntity> | undefined;
  }

  async findAll(quantidade: number) {
    const result = await db.query(`SELECT * FROM "Gerente" LIMIT $1`, [
      quantidade,
    ]);

    return (result?.rows || []) as Partial<ManagerEntity>[];
  }
}
