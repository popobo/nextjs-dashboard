import { Pool, Query } from "pg";
import { QueryResult, QueryResultRow } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;

export type Primitive = string | number | boolean | undefined | null;

const pool = new Pool({
  connectionString,
});

function isTemplateStringsArray(
  strings: unknown
): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw)
  );
}

export function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error(
      "It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')"
    );
  }

  let result = strings[0] ?? "";

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ""}`;
  }

  return [result, values];
}

export async function sql<O extends QueryResultRow>(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): Promise<QueryResult<O>> {
  const [query, params] = sqlTemplate(strings, ...values);

  const res = await pool.query(query, params);

  return res as unknown as Promise<QueryResult<O>>;
}
