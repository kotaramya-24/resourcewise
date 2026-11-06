import { Input, Label, TextArea, TextField } from 'heroui-native';
import type { KeyboardTypeOptions } from 'react-native';

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export function FormField({ label, value, onChangeText, placeholder, multiline, keyboardType }: FormFieldProps) {
  return (
    <TextField>
      <Label>{label}</Label>
      {multiline ? (
        <TextArea value={value} onChangeText={onChangeText} placeholder={placeholder} />
      ) : (
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
          className="leading-none"
        />
      )}
    </TextField>
  );
}
