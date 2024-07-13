import { sql as vercelSql } from "@vercel/postgres";
import { sql as pgLocalSql } from "./pg-local";

export const sql = process.env.POSTGRES_IS_LOCAL ? pgLocalSql : vercelSql;
