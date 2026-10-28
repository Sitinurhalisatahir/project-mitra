import { Suspense } from "react";
import { getApiDocs } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";
import "swagger-ui-react/swagger-ui.css";

async function Docs() {
  const spec = await getApiDocs();
  return <ReactSwagger spec={spec} />;
}

export default function ApiDocsPage() {
  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <Suspense fallback={<p style={{ padding: 20 }}>Memuat dokumentasi...</p>}>
        <Docs />
      </Suspense>
    </div>
  );
}