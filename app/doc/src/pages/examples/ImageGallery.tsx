import { DocsLayout } from "@/components/DocsLayout";
import { CodeBlock } from "@/components/CodeBlock";
import {
  UplofileRoot,
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";
import { mockUpload } from "@/lib/utils.ts";

const ExampleImageGallery = () => {
  return (
    <DocsLayout>
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-3xl font-bold mb-2">Image Gallery Uploader</h1>
        <p className="text-lg text-muted-foreground mb-8">
          An image-focused uploader with thumbnail previews in a grid layout.
        </p>

        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-semibold border-b border-border pb-2">
            Preview
          </h2>
          <div className="not-prose p-6 border border-border rounded-lg bg-muted/30">
            <UplofileRoot upload={mockUpload} accept="image/*" multiple>
              <UplofilePreview
                render={({ items }) => (
                  <div className="grid grid-cols-4 gap-4">
                    {items.map((item) => (
                      <div key={item.uid} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                        {item.previewUrl && (
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                        {item.status === "uploading" && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-sm">{item.progress}%</span>
                          </div>
                        )}
                      </div>
                    ))}

                    <UplofileDropzone className="aspect-square rounded-lg flex items-center justify-center border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors data-[dragging=true]:border-primary data-[dragging=true]:bg-primary/10">
                      <UplofileTrigger>
                        <span className="text-2xl text-muted-foreground">+</span>
                      </UplofileTrigger>
                    </UplofileDropzone>
                  </div>
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
  UplofileDropzone,
  UplofileTrigger,
  UplofilePreview,
} from "@/components/ui/uplofile";

export function ImageGalleryUploader() {
  return (
    <UplofileRoot upload={upload} accept="image/*" multiple>
      <UplofilePreview
        render={({ items }) => (
          <div className="grid grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item.uid} className="relative aspect-square rounded-lg overflow-hidden">
                {item.previewUrl && (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                )}
                {item.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white">{item.progress}%</span>
                  </div>
                )}
              </div>
            ))}

            <UplofileDropzone className="aspect-square rounded-lg border-2 border-dashed cursor-pointer data-[dragging=true]:border-primary">
              <UplofileTrigger>
                <span className="text-2xl text-muted-foreground">+</span>
              </UplofileTrigger>
            </UplofileDropzone>
          </div>
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
            <li>→ Uses <code className="code-inline">accept="image/*"</code> to filter file types</li>
            <li>→ Grid layout with thumbnail previews via <code className="code-inline">item.previewUrl</code></li>
            <li>→ Add button appears alongside existing images</li>
            <li>→ Progress overlay during upload</li>
          </ul>
        </section>
      </article>
    </DocsLayout>
  );
};

export default ExampleImageGallery;
