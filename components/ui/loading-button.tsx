// components/ui/loading-button.tsx
import { Button, ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "./loading-spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
}

export const LoadingButton = ({
  isLoading,
  children,
  ...props
}: LoadingButtonProps) => {
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <Button
      disabled={isLoading}
      className={cn(
        "transition-all",
        theme === "dark" ? "bg-primary/90 hover:bg-primary" : "",
        props.className
      )}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
