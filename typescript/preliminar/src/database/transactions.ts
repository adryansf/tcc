import { db } from ".";

export const startDatabaseTransaction = () => {
  return db.query("BEGIN");
};

export const endDatabaseTransaction = async () => {
  // await db.query("ROLLBACK");
  // return false;

  try {
    await db.query("COMMIT");
    return true;
  } catch (err) {
    await db.query("ROLLBACK");
    return false;
  }
};
