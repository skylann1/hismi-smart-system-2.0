import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./alert";

export function SuccessAlert({ title, description, className }: { title?: string; description?: string; className?: string }) {
  return (
    <div className={`w-80 max-w-xl items-start gap-4 z-[10000] fixed top-20 -right-96 transition-all ease-in-out duration-700 opacity-0 ${className}`}>
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle>{title ?? "Success! Your changes have been saved"}</AlertTitle>
        <AlertDescription>
          {description ?? "This is an alert with icon, title and description."}
        </AlertDescription>
      </Alert>

    </div>
  );
}

export function FailAlert({ title, description, className }: { title?: string; description?: string; className?: string }) {
  return (
    <div className={`w-80 max-w-xl items-start gap-4 z-[10000] fixed top-20 -right-96 transition-all ease-in-out duration-700 opacity-0 ${className}`}>
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>{title ?? "Error! Your changes have not been saved"}</AlertTitle>
        <AlertDescription>
          {description ?? "This is an alert with icon, title and description."}
        </AlertDescription>
      </Alert>
    </div>
  );
}