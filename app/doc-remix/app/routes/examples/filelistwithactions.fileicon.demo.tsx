import {
  IoArchiveOutline,
  IoDocumentOutline,
  IoDocumentTextOutline,
  IoImageOutline,
} from "react-icons/io5";

export function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
    return <IoImageOutline className="h-5 w-5" />;
  if (ext === "pdf" || ["doc", "docx"].includes(ext || ""))
    return <IoDocumentTextOutline className="h-5 w-5" />;
  if (["zip", "rar", "7z"].includes(ext || ""))
    return <IoArchiveOutline className="h-5 w-5" />;
  return <IoDocumentOutline className="h-5 w-5" />;
}
