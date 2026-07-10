import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Save } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

export const Route = createFileRoute("/admin/perusahaan")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/admin/perusahaan"!</div>;
}
