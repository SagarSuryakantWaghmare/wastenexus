import { LoaderOne } from "@/components/ui/loader";

export function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
      <LoaderOne />
    </div>
  );
}
