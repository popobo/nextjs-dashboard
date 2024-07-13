import { Client, QueryResult } from "pg";

const client = new Client(
  process.env.POSTGRES_URL
);

interface ExtendedClient extends Client {
  sql: (
    strings: TemplateStringsArray,
    ...values: any[]
  ) => Promise<QueryResult>;
  isConnected: boolean;
}

export const getClient = async (): Promise<ExtendedClient> => {
  const extendedClient = client as ExtendedClient;

  if (!extendedClient.isConnected) {
    await extendedClient.connect();
    extendedClient.isConnected = true;
  }

  extendedClient.sql = async (
    strings: TemplateStringsArray,
    ...values: any[]
  ): Promise<QueryResult> => {
    if (!strings) {
      throw new Error("sql is required");
    }
    const [query, params] = sqlTemplate(strings, ...values);
    const res = await extendedClient.query(query, params);
    return res;
  };

  return extendedClient;
};

function sqlTemplate(
  strings: TemplateStringsArray,
  ...values: any[]
): [string, any[]] {
  if (!isTemplateStringsArray(strings) || !Array.isArray(values)) {
    throw new Error(
      "incorrect_tagged_template_call: It looks like you tried to call `sql` as a function. Make sure to use it as a tagged template.\n\tExample: sql`SELECT * FROM users`, not sql('SELECT * FROM users')"
    );
  }

  let result = strings[0] ?? "";

  for (let i = 1; i < strings.length; i++) {
    result += `$${i}${strings[i] ?? ""}`;
  }

  return [result, values];
}

function isTemplateStringsArray(strings: any): strings is TemplateStringsArray {
  return (
    Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw)
  );
}
