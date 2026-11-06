import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { pressHaptic } from '@/components/pressable';
import { Segmented } from '@/components/segmented';
import { FormField } from '@/features/exchange/components/form-field';
import { UNITS, useNewItemScreen } from '@/features/exchange/hooks/use-new-item-screen';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { CATEGORIES, CONDITIONS, categoryLabel, conditionLabel } from '@/features/exchange/utils/labels';

export default function NewItemScreen() {
  const f = useNewItemScreen();
  const school = useExchangeStore((s) => s.schools.find((x) => x.school_id === s.activeSchoolID));

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
        <Text className="text-3xl font-bold text-foreground">List surplus</Text>
        <Text className="text-sm text-muted">Shared from {school?.name ?? 'your school'}</Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Category</Text>
        <Segmented values={CATEGORIES} value={f.category} onChange={f.setCategory} labels={CATEGORIES.map(categoryLabel)} />
      </View>

      <FormField label="What is it?" value={f.title} onChangeText={f.setTitle} placeholder="Glue sticks, large" />
      <FormField
        label="Details"
        value={f.description}
        onChangeText={f.setDescription}
        placeholder="Brand, size, anything another school should know"
        multiline
      />

      <FormField label="Quantity" value={f.quantity} onChangeText={f.setQuantity} placeholder="12" keyboardType="number-pad" />

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Counted in</Text>
        <Segmented values={UNITS} value={f.unit} onChange={f.setUnit} />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Condition</Text>
        <Segmented values={CONDITIONS} value={f.condition} onChange={f.setCondition} labels={CONDITIONS.map(conditionLabel)} />
      </View>

      {f.error ? <Text className="text-sm text-danger">{f.error}</Text> : null}

      <Button
        size="lg"
        onPress={() => {
          pressHaptic();
          f.save();
        }}
      >
        <Button.Label>List item</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
