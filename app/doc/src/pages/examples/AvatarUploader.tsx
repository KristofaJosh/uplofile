import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

const ExampleAvatarUploader = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Avatar Uploader</h1>
        <p className="text-lg text-muted-foreground mb-8">
          A circular avatar uploader with hover overlay for profile pictures.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30 flex justify-center">
            <UplofileRoot upload={mockUpload} accept="image/*">
              <UplofilePreview
                render={({ items }) => (
                  <UplofileTrigger>
                    <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group border-2 border-border">
                      {items.length > 0 && items[0].previewUrl ? (
                        <img
                          src={items[0].previewUrl}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-3xl">
                          👤
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm">Change</span>
                      </div>

                      {items.length > 0 && items[0].status === "uploading" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white text-sm">
                            {items[0].progress}%
                          </span>
                        </div>
                      )}
                    </div>
                  </UplofileTrigger>
                )}
              />
            </UplofileRoot>
          </div>
        </section>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Code
          </h2>
          <CodeBlock
            language="tsx"
            code={`import {
  UplofileRoot,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";

export function AvatarUploader() {
  return (
    <UplofileRoot upload={upload} accept="image/*">
      <UplofilePreview
        render={({ items }) => (
          <UplofileTrigger>
            <div className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer group">
              {items.length > 0 && items[0].previewUrl ? (
                <img
                  src={items[0].previewUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center text-3xl">
                  👤
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>
          </UplofileTrigger>
        )}
      />
    </UplofileRoot>
  );
}`}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Key Points
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              → Single file upload (no{" "}
              <code className="code-inline">multiple</code> prop)
            </li>
            <li>→ Hover overlay for change action</li>
            <li>
              → Circular crop with{" "}
              <code className="code-inline">rounded-full</code>
            </li>
            <li>
              → Uses <code className="code-inline">item.previewUrl</code> for
              instant preview
            </li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleAvatarUploader;
