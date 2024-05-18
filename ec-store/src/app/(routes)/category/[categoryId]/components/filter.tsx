"use client";

import Button from "@/components/ui/button";

import { useSearchParams, useRouter } from "next/navigation";
import qs from "query-string";
import { cn } from "@/lib/utils";

import { Size, Color } from "@/types/types";

interface FilterProps {
  valueKey: string;
  name: string;
  data: (Size | Color)[];
}

const Filter: React.FC<FilterProps> = ({ valueKey, name, data }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    // URLのクエリ文字列をJavaScriptオブジェクトに変換
    const current = qs.parse(searchParams.toString());

    // valueKeyに対応する値を新しい値(id)に更新
    const query = {
      ...current,
      [valueKey]: id,
    };

    // 現在のクエリパラメータの値が選択されたフィルターの値と同じであれば、そのフィルターを解除
    // 同じフィルターが再度クリックされた場合は、そのフィルターを無効
    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    // 新しいクエリパラメータを元に、現在のURLを更新します。
    // qs.stringifyUrl URLとクエリオブジェクトを組み合わせて新しいURL文字列を生成します。
    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      // 値がnullのキーはクエリパラメータに含まれません
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">{name}</h3>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <Button
              className={cn(
                "rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300",
                selectedValue === filter.id && "bg-black text-white"
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
