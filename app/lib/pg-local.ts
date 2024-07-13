import { Pool, Query } from "pg";
import { QueryResult, QueryResultRow } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_URL;

export type Primitive = string | number | boolean | undefined | null;

const pool = new Pool({
  connectionString,
});

function isTemplateStringArray(
  strings: TemplateStringsArray | string[]
): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw)
  );
}

export function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: Primitive[]
): [string, Primitive[]] {
  if (!isTemplateStringArray(strings) || !Array.isArray(values)) {
    throw new Error("sqlTemplate must be called with a template string");
  }

  let result = strings[0] ?? "";

  for (let i = 0; i < strings.length; i++) {
    result += `$${i}${strings[i]} ?? ''};`;
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
