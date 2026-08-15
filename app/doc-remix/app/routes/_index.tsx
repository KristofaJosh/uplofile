import { useEffect, useState } from "react";
import type { MetaFunction } from "react-router";
import {
  IoArrowForwardOutline,
  IoCheckmark,
  IoCloudUploadOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { CodeBlock } from "@/components/CodeBlock";
import { Header } from "@/components/Header";
import { useCopy } from "@/hooks/use-copy";
import { withPageMeta } from "@/lib/seo";

export const meta: MetaFunction = () => {
  return withPageMeta("/", [
    { title: "Uplofile — Composable React File Upload Components" },
    {
      name: "description",
      content:
        "Composable React file upload UI primitives for selecting files, showing progress, and managing uploads with your existing backend.",
    },
  ]);
};

const sample = `import { Root, Dropzone, Trigger, Preview } from "uplofile";

export function Uploader() {
  return (
    <Root upload={putToS3}>
      <Dropzone>
        <Trigger>Choose files</Trigger>
        <Preview />
      </Dropzone>
    </Root>
  );
}`;

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Uplofile",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Composable React file upload UI primitives for selecting files, showing progress, and managing uploads with your existing backend.",
  url: "https://uplofile.kristofajosh.dev/",
  programmingLanguage: "TypeScript",
  offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
};

function formatDownloads(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default function Index() {
  const [copied, copy] = useCopy();
  const [stats, setStats] = useState({ week: "—", month: "—", total: "—" });

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    void Promise.all([
      fetch("https://api.npmjs.org/downloads/point/last-week/uplofile").then(
        (response) => response.json() as Promise<{ downloads: number }>,
      ),
      fetch("https://api.npmjs.org/downloads/point/last-month/uplofile").then(
        (response) => response.json() as Promise<{ downloads: number }>,
      ),
      fetch(
        `https://api.npmjs.org/downloads/point/2015-01-10:${today}/uplofile`,
      ).then((response) => response.json() as Promise<{ downloads: number }>),
    ])
      .then(([week, month, total]) =>
        setStats({
          week: formatDownloads(week.downloads),
          month: formatDownloads(month.downloads),
          total: formatDownloads(total.downloads),
        }),
      )
      .catch(() => undefined);
  }, []);

  return (
    <div className="docs-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <Header />
      <main className="home-content">
        <section className="home-hero">
          <h1>
            Build upload UI that fits.
            <br />
            <span>Keep your backend in charge.</span>
          </h1>
          <p>
            Composable React components for choosing files, showing progress,
            and managing each upload. Use your existing <code>upload()</code>{" "}
            function.
          </p>
          <div className="hero-actions">
            <a className="outline-button" href="/quick-start">
              Quick start <IoArrowForwardOutline aria-hidden="true" size={14} />
            </a>
            <div className="install-command">
              <code>npm i uplofile</code>
              <button
                type="button"
                onClick={() => void copy("npm i uplofile")}
                aria-label="Copy install command"
              >
                {copied ? (
                  <IoCheckmark size={14} />
                ) : (
                  <IoCopyOutline size={14} />
                )}
              </button>
            </div>
          </div>
        </section>

        <section
          className="stats-grid"
          aria-label="Uplofile download statistics"
        >
          <div>
            <strong>{stats.week}</strong>
            <span>downloads / week</span>
          </div>
          <div>
            <strong>{stats.month}</strong>
            <span>downloads / month</span>
          </div>
          <div>
            <strong>{stats.total}</strong>
            <span>total downloads</span>
          </div>
          <div>
            <strong>React 16+</strong>
            <span>MIT · zero deps</span>
          </div>
        </section>

        <div className="home-divider" />

        <section className="home-split">
          <div>
            <p className="eyebrow">The whole thing</p>
            <CodeBlock code={sample} filename="Uploader.tsx" />
            <a className="text-link" href="/quick-start">
              Explore the quick start{" "}
              <IoArrowForwardOutline aria-hidden="true" size={14} />
            </a>
          </div>
          <div className="boundary">
            <p className="eyebrow">Boundary</p>
            <div>
              <strong>Uplofile handles</strong>
              <p>
                File state and lifecycle
                <br />
                Progress, cancel, retry, remove
                <br />
                Drag-and-drop and file dialog
                <br />
                Hidden input for form posts
              </p>
            </div>
            <div>
              <strong>You handle</strong>
              <p>
                Transport and protocol
                <br />
                Storage backend and auth
                <br />
                Retry and resumable strategy
                <br />
                All styling
              </p>
            </div>
          </div>
        </section>

        <section className="principles">
          <div>
            <IoCloudUploadOutline size={18} />
            <h2>Composable by default</h2>
            <p>
              Use each primitive independently, then make the upload experience
              yours.
            </p>
          </div>
          <div>
            <IoCheckmark size={18} />
            <h2>Accessible interactions</h2>
            <p>
              Keyboard-friendly triggers and native file input behavior are
              built in.
            </p>
          </div>
          <div>
            <IoArrowForwardOutline size={18} />
            <h2>Bring your transport</h2>
            <p>
              Keep your backend, credentials, and upload protocol exactly where
              they belong.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
