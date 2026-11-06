import { router } from 'expo-router';
import { Button } from 'heroui-native';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { pressHaptic } from '@/components/pressable';
import { Segmented } from '@/components/segmented';
import { FormField } from '@/features/exchange/components/form-field';
import { MIN_CONDITIONS, useNewNeedScreen } from '@/features/exchange/hooks/use-new-need-screen';
import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import { CATEGORIES, categoryLabel, conditionLabel } from '@/features/exchange/utils/labels';

export default function NewNeedScreen() {
  const f = useNewNeedScreen();
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
        <Text className="text-3xl font-bold text-foreground">Post a need</Text>
        <Text className="text-sm text-muted">For {school?.name ?? 'your school'}</Text>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Category</Text>
        <Segmented values={CATEGORIES} value={f.category} onChange={f.setCategory} labels={CATEGORIES.map(categoryLabel)} />
      </View>

      <FormField label="What do you need?" value={f.description} onChangeText={f.setDescription} placeholder="Fraction tiles" />
      <FormField label="How many?" value={f.quantity} onChangeText={f.setQuantity} placeholder="10" keyboardType="number-pad" />
      <FormField label="Needed by" value={f.neededBy} onChangeText={f.setNeededBy} placeholder="2026-12-15" />

      <View className="gap-2">
        <Text className="text-sm font-medium text-foreground">Lowest condition you'll accept</Text>
        <Segmented
          values={MIN_CONDITIONS}
          value={f.minCondition}
          onChange={f.setMinCondition}
          labels={MIN_CONDITIONS.map(conditionLabel)}
        />
      </View>

      {f.error ? <Text className="text-sm text-danger">{f.error}</Text> : null}

      <Button
        size="lg"
        onPress={() => {
          pressHaptic();
          f.save();
        }}
      >
        <Button.Label>Post need</Button.Label>
      </Button>
    </KeyboardAwareScrollView>
  );
}
