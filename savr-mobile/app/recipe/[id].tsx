import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useRecipeDetails } from '../../src/hooks/useRecipeDetails';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    recipeDetails,
    loading,
    error,
  } = useRecipeDetails(id);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!recipeDetails) {
    return (
      <View>
        <Text>No recipe found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      >
        {recipeDetails.recipe.title}
      </Text>

      {/* Description */}
      <Text style={{ marginBottom: 20 }}>
        {recipeDetails.recipe.description}
      </Text>

      {/* Skill Level */}
      <Text style={{ marginBottom: 20 }}>
        Skill Level: {recipeDetails.recipe.skill_level}
      </Text>

      {/* Prep Time*/}
      <Text style={{ marginBottom: 20 }}>
        Prep Time: {recipeDetails.recipe.prep_time_minutes} minutes
      </Text>

      {/* Cook Time */}
      <Text style={{ marginBottom: 20 }}>
        Cook Time: {recipeDetails.recipe.cook_time_minutes} minutes
      </Text>

      {/* Total Time */}
      <Text style={{ marginBottom: 20 }}>
        Total Time: {recipeDetails.recipe.total_time_minutes} minutes
      </Text>

      {/* Servings */}
      <Text style={{ marginBottom: 20 }}>
        Servings: {recipeDetails.recipe.servings}
      </Text>

      {/* Ingredients */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      >
        Ingredients
      </Text>

      {recipeDetails.ingredients.map((ingredient) => (
        <Text key={ingredient.recipeIngredientId}>
          • {ingredient.quantity} {ingredient.unit} {ingredient.isOptional ? '(optional) ' : ''}{ingredient.name}
        </Text>
      ))}

      {/* Equipment */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 8,
        }}
      >
        Equipment
      </Text>

      {recipeDetails.equipment.map((equipment) => (
        <Text key={equipment.recipeEquipmentId}>
          • {equipment.name}
        </Text>
      ))}

      {/* Steps */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 8,
        }}
      >
        Steps
      </Text>

      {recipeDetails.steps.map((step) => (
        <Text
          key={step.stepId}
          style={{ marginBottom: 8 }}
        >
          {step.order}. {step.instruction}
        </Text>
      ))}

      {/* Tags */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 8,
        }}
      >
        Tags
      </Text>

      {recipeDetails.tags.map((tag) => (
        <Text key={tag.recipeTagId}>
          • {tag.name}
        </Text>
      ))}
    </ScrollView>
  );
}
