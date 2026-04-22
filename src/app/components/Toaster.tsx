import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      offset={20}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "!bg-white !border !border-[#E2E8F0] !rounded-xl !text-[#0F172A] !px-4 !py-3",
          description: "!text-[#475569]",
          actionButton: "!bg-[#2563EB] !text-white !rounded-md",
          cancelButton: "!bg-[#F1F5F9] !text-[#0F172A] !rounded-md",
        },
      }}
    />
  );
}
