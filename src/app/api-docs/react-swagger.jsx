"use client";

import dynamic from "next/dynamic";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p style={{ padding: 20 }}>Memuat dokumentasi...</p>,
});

export default function ReactSwagger({ spec }) {
  return <SwaggerUI spec={spec} persistAuthorization />;
}
