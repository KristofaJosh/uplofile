import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("installation", "routes/installation.tsx"),
  route("quick-start", "routes/quick-start.tsx"),

  // Components
  route("components/root", "routes/components/root.tsx"),
  route("components/trigger", "routes/components/trigger.tsx"),
  route("components/preview", "routes/components/preview.tsx"),
  route("components/dropzone", "routes/components/dropzone.tsx"),
  route("components/hidden-input", "routes/components/hiddeninput.tsx"),

  // API
  route("api/props", "routes/api/props.tsx"),
  route("api/actions", "routes/api/actions.tsx"),

  // Examples
  route("examples/default-preview", "routes/examples/defaultpreview.tsx"),
  route("examples/basic", "routes/examples/basicuploader.tsx"),
  route("examples/dropzone", "routes/examples/dropzoneuploader.tsx"),
  route("examples/image-gallery", "routes/examples/imagegallery.tsx"),
  route("examples/sortable-gallery", "routes/examples/sortablegallery.tsx"),
  route("examples/avatar", "routes/examples/avataruploader.tsx"),
  route("examples/file-list", "routes/examples/filelistwithactions.tsx"),
  route("examples/video", "routes/examples/videouploader.tsx"),
  route("examples/validation", "routes/examples/beforeuploadvalidation.tsx"),
  route("examples/form", "routes/examples/formintegration.tsx"),
  route("examples/root-imperative", "routes/examples/rootimperative.tsx"),
  route("examples/loading-state", "routes/examples/loadingstate.tsx"),
  route("examples/pause-resume", "routes/examples/pauseresumeresumable.tsx"),
  route("sitemap.xml", "routes/sitemap[.]xml.tsx"),
] satisfies RouteConfig;
