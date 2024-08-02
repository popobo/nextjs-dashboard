// app/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/example");
      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Response:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
