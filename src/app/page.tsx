import Link from "next/link";

const tools = [
  {
    href: "/docsplit",
    name: "Doc Split",
    tagline: "Split a merged PDF into individual files",
    description:
      "Upload a multi-patient merged PDF. Define splits by page ranges or a fixed page count per patient. Download all individual files as a ZIP in one click.",
    colorBg: "bg-indigo-100",
    colorText: "text-indigo-600",
    colorHoverBg: "group-hover:bg-indigo-600",
    colorHoverText: "group-hover:text-white",
    colorTagline: "text-indigo-600",
    colorStep: "bg-indigo-100 text-indigo-700",
    colorLink: "text-indigo-600",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
        />
      </svg>
    ),
    steps: ["Upload merged PDF", "Set page ranges or fixed count", "Download ZIP"],
  },
  {
    href: "/namestamp",
    name: "Name Stamp",
    tagline: "Stamp patient names on every page of a chart template",
    description:
      "Upload a blank chart PDF. Add a list of patient names, choose the corner, and generate one stamped PDF per patient — all in a single click.",
    colorBg: "bg-violet-100",
    colorText: "text-violet-600",
    colorHoverBg: "group-hover:bg-violet-600",
    colorHoverText: "group-hover:text-white",
    colorTagline: "text-violet-600",
    colorStep: "bg-violet-100 text-violet-700",
    colorLink: "text-violet-600",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    steps: ["Upload chart template", "Add patient names", "Download stamped ZIPs"],
  },
];

export default function HomePage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Chart Desk</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Simple PDF tools for patient chart management. No uploads to servers — everything runs in your browser.
          </p>
        </div>

        {/* Tool cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-all"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 ${tool.colorBg} ${tool.colorText} ${tool.colorHoverBg} ${tool.colorHoverText} transition-colors`}
              >
                {tool.icon}
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{tool.name}</h2>
              <p className={`text-sm font-medium ${tool.colorTagline} mb-3`}>{tool.tagline}</p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{tool.description}</p>

              <ol className="space-y-1.5">
                {tool.steps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${tool.colorStep} text-xs font-bold shrink-0`}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className={`mt-6 flex items-center gap-1.5 text-sm font-semibold ${tool.colorLink}`}>
                Open {tool.name}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Privacy note */}
        <p className="text-center text-xs text-gray-400 mt-12">
          All processing happens locally in your browser. No files are uploaded or stored anywhere.
        </p>
      </div>
    </main>
  );
}
