"use client";
import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";

import { StoreModal } from "@/components/modals/store-modal";

const SteupPage = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
};

export default SteupPage;
