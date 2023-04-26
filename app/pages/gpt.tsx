import Head from "next/head";
import React, { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<string|undefined>();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    fetch("/api/generate", {
      method: "POST",
      body: query,
    })
    .then((res: Response) => res.json())
    .then(data => {
      setResult(data.result);
      setQuery("");
    })
    .catch((err:any) => {
      console.log(err);
    });
  };

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
      </Head>

      <main className={styles.main}>
        <h3>Chat with ChatGPT</h3>
        <form onSubmit={onSubmit}>
          <textarea
            cols= {3}
            name="query"
            placeholder="Ask a question"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
          <input type="submit" value="Submit"/>
        </form>
        <pre className={styles.result}>{result}</pre>
      </main>
    </div>
  );
}
