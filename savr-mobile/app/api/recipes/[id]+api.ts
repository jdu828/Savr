import { getRecipeById } from "../../../src/services/recipes/getRecipeById";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await getRecipeById(params.id);

    return Response.json(recipe);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}