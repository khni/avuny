import DynamicFields, {
  DynamicField,
} from "@workspace/ui/blocks/form/dynamic-fields";
import DynamicGrid, {
  DynamicGridItem,
} from "@workspace/ui/blocks/grid/dynamic-grid";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

type DynamicGridFieldsProps<T extends FieldValues, E> = {
  form: UseFormReturn<T>;
  fields?: DynamicGridItem<DynamicField<T, E>>[];
  getLabel?: (name: Path<T>) => string;
};

export function DynamicGridFields<T extends FieldValues, E>({
  form,
  fields,
  getLabel,
}: DynamicGridFieldsProps<T, E>) {
  if (!fields?.length) return null;

  return (
    <DynamicGrid
      items={fields}
      contentMapper={(content: any) => (
        <DynamicFields fields={[{ ...content, getLabel, form }]} />
      )}
    />
  );
}
