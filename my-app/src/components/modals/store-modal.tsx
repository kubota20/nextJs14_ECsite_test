"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="aaaaa"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      StoreModal.tsx
    </Modal>
  );
};
