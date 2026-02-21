import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Index from "./pages/Index";
import Installation from "./pages/Installation";
import QuickStart from "./pages/QuickStart";
import ComponentRoot from "./pages/components/Root";
import ComponentTrigger from "./pages/components/Trigger";
import ComponentPreview from "./pages/components/Preview";
import ComponentDropzone from "./pages/components/Dropzone";
import ComponentHiddenInput from "./pages/components/HiddenInput";
import ApiProps from "./pages/api/Props";
import ApiActions from "./pages/api/Actions";
import ExampleBasicUploader from "./pages/examples/BasicUploader";
import ExampleDropzoneUploader from "./pages/examples/DropzoneUploader";
import ExampleImageGallery from "./pages/examples/ImageGallery";
import ExampleAvatarUploader from "./pages/examples/AvatarUploader";
import ExampleFileListWithActions from "./pages/examples/FileListWithActions";
import ExampleFormIntegration from "./pages/examples/FormIntegration";
import ExampleVideoUploader from "./pages/examples/VideoUploader";
import ExampleBeforeUploadValidation from "./pages/examples/BeforeUploadValidation";
import ExampleDefaultPreview from "./pages/examples/DefaultPreview";
import ExampleSortableGallery from "./pages/examples/SortableGallery";
import ExampleRootImperative from "./pages/examples/RootImperative";
import ExampleLoadingState from "./pages/examples/LoadingState";
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";

const SITE_NAME = "Uplofile";
const SITE_URL = "https://uplofile.kristofajosh.dev";
const DEFAULT_OG_IMAGE = `${SITE_URL}/web-app-manifest-512x512.png`;

const normalizeCanonicalUrl = (pathname: string) => {
  if (pathname === "/") {
    return `${SITE_URL}/`;
  }

  return `${SITE_URL}${pathname.replace(/\/$/, "")}`;
};

const pageJsonLd = ({
  title,
  description,
  canonicalUrl,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: canonicalUrl,
});

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Uplofile",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "Composable file upload components for React. Accessible, headless primitives that are easy to integrate and style.",
  url: "https://uplofile.kristofajosh.dev/",
  programmingLanguage: "TypeScript",
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "USD",
  },
};

const PageWrapper = ({
  children,
  title,
  description,
  noIndex = false,
  structuredData,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}) => {
  const location = useLocation();
  const canonicalUrl = normalizeCanonicalUrl(location.pathname);
  const robots = noIndex ? "noindex, nofollow" : "index, follow";
  const jsonLd = structuredData ?? pageJsonLd({ title, description, canonicalUrl });

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content={robots} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {children}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper
              title="Uplofile - Composable File Upload Components for React"
              description="Composable file upload components for React. Accessible, headless primitives that are easy to integrate and style."
              structuredData={homepageJsonLd}
            >
              <Index />
            </PageWrapper>
          }
        />
        <Route
          path="/installation"
          element={
            <PageWrapper
              title="Installation - Uplofile"
              description="Learn how to install and set up Uplofile in your React project."
            >
              <Installation />
            </PageWrapper>
          }
        />
        <Route
          path="/quick-start"
          element={
            <PageWrapper
              title="Quick Start - Uplofile"
              description="Get started quickly with Uplofile file upload components."
            >
              <QuickStart />
            </PageWrapper>
          }
        />
        <Route
          path="/components/root"
          element={
            <PageWrapper
              title="Root Component - Uplofile"
              description="The Root component is the main container for Uplofile file upload functionality."
            >
              <ComponentRoot />
            </PageWrapper>
          }
        />
        <Route
          path="/components/trigger"
          element={
            <PageWrapper
              title="Trigger Component - Uplofile"
              description="The Trigger component opens the file picker dialog."
            >
              <ComponentTrigger />
            </PageWrapper>
          }
        />
        <Route
          path="/components/preview"
          element={
            <PageWrapper
              title="Preview Component - Uplofile"
              description="The Preview component displays file previews with images, videos, and file icons."
            >
              <ComponentPreview />
            </PageWrapper>
          }
        />
        <Route
          path="/components/dropzone"
          element={
            <PageWrapper
              title="Dropzone Component - Uplofile"
              description="The Dropzone component provides a drag-and-drop area for file uploads."
            >
              <ComponentDropzone />
            </PageWrapper>
          }
        />
        <Route
          path="/components/hidden-input"
          element={
            <PageWrapper
              title="HiddenInput Component - Uplofile"
              description="The HiddenInput component renders a hidden file input element."
            >
              <ComponentHiddenInput />
            </PageWrapper>
          }
        />
        <Route
          path="/api/props"
          element={
            <PageWrapper
              title="Props API - Uplofile"
              description="Complete reference for all props available in Uplofile components."
            >
              <ApiProps />
            </PageWrapper>
          }
        />
        <Route
          path="/api/actions"
          element={
            <PageWrapper
              title="Actions API - Uplofile"
              description="Learn about actions available for controlling Uplofile components programmatically."
            >
              <ApiActions />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/basic"
          element={
            <PageWrapper
              title="Basic Uploader Example - Uplofile"
              description="A basic file uploader example using Uplofile components."
            >
              <ExampleBasicUploader />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/dropzone"
          element={
            <PageWrapper
              title="Dropzone Uploader Example - Uplofile"
              description="A drag-and-drop file uploader example."
            >
              <ExampleDropzoneUploader />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/image-gallery"
          element={
            <PageWrapper
              title="Image Gallery Example - Uplofile"
              description="An image gallery upload example with previews."
            >
              <ExampleImageGallery />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/avatar"
          element={
            <PageWrapper
              title="Avatar Uploader Example - Uplofile"
              description="An avatar upload example with image cropping."
            >
              <ExampleAvatarUploader />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/file-list"
          element={
            <PageWrapper
              title="File List Example - Uplofile"
              description="A file list with actions example."
            >
              <ExampleFileListWithActions />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/form"
          element={
            <PageWrapper
              title="Form Integration Example - Uplofile"
              description="How to integrate Uplofile with forms."
            >
              <ExampleFormIntegration />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/video"
          element={
            <PageWrapper
              title="Video Uploader Example - Uplofile"
              description="A video upload example with preview."
            >
              <ExampleVideoUploader />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/validation"
          element={
            <PageWrapper
              title="Validation Example - Uplofile"
              description="How to validate files before upload."
            >
              <ExampleBeforeUploadValidation />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/default-preview"
          element={
            <PageWrapper
              title="Default Preview Example - Uplofile"
              description="Example showing default file previews."
            >
              <ExampleDefaultPreview />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/sortable-gallery"
          element={
            <PageWrapper
              title="Sortable Gallery Example - Uplofile"
              description="A sortable image gallery with drag-and-drop reordering."
            >
              <ExampleSortableGallery />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/root-imperative"
          element={
            <PageWrapper
              title="Root Imperative Example - Uplofile"
              description="Using the Root component imperatively for full control."
            >
              <ExampleRootImperative />
            </PageWrapper>
          }
        />
        <Route
          path="/examples/loading-state"
          element={
            <PageWrapper
              title="Loading State Example - Uplofile"
              description="Handling loading and progress states in Uplofile."
            >
              <ExampleLoadingState />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper
              title="Page Not Found - Uplofile"
              description="Page not found."
              noIndex
            >
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </HelmetProvider>
);

export default App;
