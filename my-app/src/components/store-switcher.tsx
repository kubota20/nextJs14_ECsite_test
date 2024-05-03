"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

import { Store } from "@prisma/client";

import { useStoreModal } from "@/hooks/use-store-modal";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
  CommandSeparator,
} from "./ui/command";

// Icon
import { Check, ChevronsUpDownIcon, PlusCircle, StoreIcon } from "lucide-react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const storeModal = useStoreModal();

  const params = useParams();
  const router = useRouter();

  const fromattedItems = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  const [open, setOpen] = useState(false);

  // find 条件の一致すれば
  // つまりPrismaで作ったStoreのIDとparamsの[storeId]が一致すればイベントが起こる
  const currentStore = fromattedItems.find(
    (item) => item.value === params.storeId
  );

  // 作成されてあるストアのリンクに飛びます
  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  // ストア作成するためのモーダルが出てきます
  const onStoreCreate = () => {
    setOpen(false);
    storeModal.onOpen();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {fromattedItems.map((store) => (
                // <div key={store.value} className="flex items-center px-3">
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                >
                  <StoreIcon className="mr-2 h-4 w-4" />

                  {store.label}

                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentStore?.value === store.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={onStoreCreate}>
                <PlusCircle className="mr-2 h-5 w-5" />
                ストアを作成
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
