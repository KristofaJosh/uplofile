import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/installation" element={<Installation />} />
          <Route path="/quick-start" element={<QuickStart />} />
          <Route path="/components/root" element={<ComponentRoot />} />
          <Route path="/components/trigger" element={<ComponentTrigger />} />
          <Route path="/components/preview" element={<ComponentPreview />} />
          <Route path="/components/dropzone" element={<ComponentDropzone />} />
          <Route
            path="/components/hidden-input"
            element={<ComponentHiddenInput />}
          />
          <Route path="/api/props" element={<ApiProps />} />
          <Route path="/api/actions" element={<ApiActions />} />
          <Route path="/examples/basic" element={<ExampleBasicUploader />} />
          <Route
            path="/examples/dropzone"
            element={<ExampleDropzoneUploader />}
          />
          <Route
            path="/examples/image-gallery"
            element={<ExampleImageGallery />}
          />
          <Route path="/examples/avatar" element={<ExampleAvatarUploader />} />
          <Route
            path="/examples/file-list"
            element={<ExampleFileListWithActions />}
          />
          <Route path="/examples/form" element={<ExampleFormIntegration />} />
          <Route path="/examples/video" element={<ExampleVideoUploader />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    <Analytics />
  </>
);

export default App;
