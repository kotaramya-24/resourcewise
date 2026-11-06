import { router } from 'expo-router';
import { Button, Label } from 'heroui-native';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { Icon } from '@/components/icon';
import { Image } from '@/components/image';
import { Pressable, pressHaptic } from '@/components/pressable';
import { Segmented } from '@/components/segmented';
import { FormField } from '@/features/exchange/components/form-field';
import { SelectField } from '@/features/exchange/components/select-field';
import { FORM_CONDITIONS, UNITS, useNewItemScreen } from '@/features/exchange/hooks/use-new-item-screen';
import { useTokenColor } from '@/features/exchange/hooks/use-token-color';
import type { Category } from '@/features/exchange/types/exchange';
import { CATEGORIES, categoryLabel, conditionLabel } from '@/features/exchange/utils/labels';

export default function NewItemScreen() {
  const f = useNewItemScreen();
  const muted = useTokenColor('--color-muted');

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-5 pt-6 pb-safe-offset-4 gap-6"
      bottomOffset={24}
    >
      <View className="flex-row items-center justify-between">
        <Button variant="ghost" size="sm" onPress={() => router.back()}>
          <Button.Label>Cancel</Button.Label>
        </Button>
      </View>
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Add item</Text>
        <Text className="text-sm text-muted">New items are submitted for review before other schools can claim them.</Text>
      </View>

      <View className="gap-2">
        <Label>Photo</Label>
        {f.photoURI ? (
          <View className="gap-2">
            <Image source={{ uri: f.photoURI }} className="aspect-square w-full rounded-2xl bg-surface-secondary" contentFit="cover" />
            <View className="flex-row gap-3">
              <Button variant="secondary" size="sm" onPress={f.pickPhoto}>
                <Button.Label>Choose another</Button.Label>
              </Button>
              <Button variant="ghost" size="sm" onPress={f.clearPhoto}>
                <Button.Label>Remove photo</Button.Label>
              </Button>
            </View>
          </View>
        ) : (
          <Pressable
            onPress={f.pickPhoto}
            accessibilityRole="button"
            accessibilityLabel="Upload photo"
            className="aspect-video w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border"
          >
            <Icon sf="photo.badge.plus" ion="image-outline" size={32} color={muted} />
            <Text className="text-base font-medium text-foreground">Upload photo</Text>
            <Text className="text-sm text-muted">Optional · from your photo library</Text>
          </Pressable>
        )}
      </View>

      <SelectField
        label="School"
        placeholder="Choose a school"
        options={f.schools.map((s) => ({ value: s.school_id, label: s.name }))}
        value={f.schoolID}
        onChange={f.setSchoolID}
      />

      <SelectField
        label="Category"
        placeholder="Choose a category"
        options={CATEGORIES.map((c) => ({ value: c, label: categoryLabel(c) }))}
        value={f.category}
        onChange={(v) => f.setCategory(v as Category)}
      />

      <FormField label="Title" value={f.title} onChangeText={f.setTitle} placeholder="Glue sticks, large" />
      <FormField
        label="Description"
        value={f.description}
        onChangeText={f.setDescription}
        placeholder="Brand, size, anything another school should know"
        multiline
      />

      <FormField label="Quantity" value={f.quantity} onChangeText={f.setQuantity} placeholder="12" keyboardType="number-pad" />

      <View className="gap-2">
        <Label>Unit</Label>
        <Segmented values={UNITS} value={f.unit} onChange={f.setUnit} />
      </View>

      <View className="gap-2">
        <Label>Condition</Label>
        <Segmented values={FORM_CONDITIONS} value={f.condition} onChange={f.setCondition} labels={FORM_CONDITIONS.map(conditionLabel)} />
      </View>

      {f.error ? <Text className="text-sm text-danger">{f.error}</Text> : null}

      <Button
        size="lg"
        onPress={() => {
          pressHaptic();
          f.save();
        }}
      >
        <Button.Label>Submit item</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
