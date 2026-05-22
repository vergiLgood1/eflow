import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  togglePinDataModel,
  toggleVisibilityDataModel,
} from "../applications/workspace.action";

export function useDiagramActions(id: string) {
  const router = useRouter();

  const handlePin = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const response = await togglePinDataModel(id);
    if (response.success) {
      router.refresh();
      return true;
    } else {
      toast.error("Failed to update pin status");
      return false;
    }
  };

  const handleVisibility = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const response = await toggleVisibilityDataModel(id);
    if (response.success) {
      toast.success(
        `Diagram is now ${response.data?.isPublic ? "public" : "private"}`,
      );
      router.refresh();
      return true;
    } else {
      toast.error("Failed to update visibility");
      return false;
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return {
    handlePin,
    handleVisibility,
    handleActionClick,
  };
}
