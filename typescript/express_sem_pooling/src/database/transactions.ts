// import { db } from ".";

export const startDatabaseTransaction = () => {
  // return db.query("BEGIN");
};

export const endDatabaseTransaction = async () => {
  // try {
  //   await db.query("COMMIT");
  //   return true;
  // } catch (err) {
  //   await db.query("ROLLBACK");
  //   return false;
  // }
  return true;
};
