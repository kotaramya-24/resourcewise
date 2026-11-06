import { Label, Select } from 'heroui-native';
import { View } from 'react-native';

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  placeholder: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
}

/** A labeled dropdown. Dialog presentation: the form is a native modal, where popovers mis-position. */
export function SelectField({ label, placeholder, options, value, onChange }: SelectFieldProps) {
  const selected = options.find((o) => o.value === value);
  return (
    <View className="gap-2">
      <Label>{label}</Label>
      <Select
        presentation="dialog"
        value={selected}
        onValueChange={(v) => {
          const next = Array.isArray(v) ? v[0] : v;
          if (next) onChange(next.value);
        }}
      >
        <Select.Trigger>
          <Select.Value placeholder={placeholder} />
          <Select.TriggerIndicator />
        </Select.Trigger>
        <Select.Portal>
          <Select.Overlay />
          <Select.Content presentation="dialog">
            <Select.ListLabel>{label}</Select.ListLabel>
            {options.map((o) => (
              <Select.Item key={o.value} value={o.value} label={o.label} />
            ))}
          </Select.Content>
        </Select.Portal>
      </Select>
    </View>
  );
}
