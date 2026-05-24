import { useEffect } from 'react';
import { View, Text } from 'react-native';

import { getRecipeIngredients } from '../src/services/recipes/recipeIngredients.service';

export default function TestScreen() {
  useEffect(() => {
    async function test() {
      try {
        const data = await getRecipeIngredients(
          'faf0d427-b6a0-4e0f-8d29-9f13c5f9ea74'
        );

        console.log('INGREDIENTS:', data);
      } catch (error) {
        console.error(error);
      }
    }

    test();
  }, []);

  return (
    <View>
      <Text>Servie Layer Testing...</Text>
    </View>
  );
}