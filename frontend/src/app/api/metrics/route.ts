export async function GET() {
  return new Response(
    `
# HELP devmarket_status DevMarket application status
# TYPE devmarket_status gauge
devmarket_status 1
`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}