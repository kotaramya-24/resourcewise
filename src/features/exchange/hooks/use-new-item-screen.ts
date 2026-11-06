import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Presets } from 'react-native-pulsar';

import { useExchangeStore } from '@/features/exchange/store/exchange-store';
import type { Category, Condition } from '@/features/exchange/types/exchange';
import { savePickedPhoto } from '@/features/exchange/utils/photo-storage';

export const UNITS = ['each', 'pack', 'box', 'ream', 'set'] as const;
export type Unit = (typeof UNITS)[number];

/** Worst to best, as the form lists them. */
export const FORM_CONDITIONS: Condition[] = ['needs_repair', 'usable', 'good', 'new'];

export function useNewItemScreen() {
  const addItem = useExchangeStore((s) => s.addItem);
  const schools = useExchangeStore((s) => s.schools);
  const activeSchoolID = useExchangeStore((s) => s.activeSchoolID);

  const [schoolID, setSchoolID] = useState(activeSchoolID);
  const [category, setCategory] = useState<Category | null>(null);
  const [condition, setCondition] = useState<Condition>('good');
  const [unit, setUnit] = useState<Unit>('each');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setPhotoURI(result.assets[0].uri);
  };

  const save = () => {
    const qty = Number(quantity);
    if (!schools.some((s) => s.school_id === schoolID)) return setError('Pick the school listing this item.');
    if (!category) return setError('Pick a category.');
    if (title.trim().length < 3) return setError('Give the item a title, like "Glue sticks, large".');
    if (!Number.isInteger(qty) || qty < 1) return setError('Quantity must be a whole number of 1 or more.');
    if (qty > 10000) return setError('That quantity looks too large. Check the number.');

    let photoFile = '';
    if (photoURI) {
      try {
        photoFile = savePickedPhoto(photoURI);
      } catch {
        return setError("That photo couldn't be saved. Try picking it again.");
      }
    }
    addItem({
      school_id: schoolID,
      category,
      condition,
      unit,
      title: title.trim(),
      description: description.trim(),
      quantity: qty,
      photo_file: photoFile,
    });
    Presets.System.notificationSuccess();
    router.back();
  };

  const clearing = <T,>(setter: (v: T) => void) => (v: T) => {
    setError(null);
    setter(v);
  };

  return {
    schools,
    schoolID,
    setSchoolID: clearing(setSchoolID),
    category,
    setCategory: clearing(setCategory),
    condition,
    setCondition,
    unit,
    setUnit,
    title,
    setTitle: clearing(setTitle),
    description,
    setDescription,
    quantity,
    setQuantity: clearing(setQuantity),
    photoURI, pickPhoto, clearPhoto: () => setPhotoURI(null), error, save,
  };
}
