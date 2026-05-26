import { getRecipeEquipment } from '../recipeEquipment/getRecipeEquipment.service';
import { supabase } from '../../lib/supabase';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('getRecipeEquipment', () => {
const eqMock = jest.fn() as jest.Mock;
const selectMock = jest.fn() as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    selectMock.mockReturnValue({
      eq: eqMock,
    });

    (supabase as any).from = jest.fn().mockReturnValue({
      select: selectMock,
    });
  });

  it('should fetch and map recipe equipment correctly', async () => {
    const mockData = [
      {
        id: 're1',
        recipe_id: 'r1',
        equipment_id: 'eq1',
        quantity: 2,
        is_optional: true,
        notes: 'Cast iron preferred',
        size: '12 inch',
        equipment: [{ name: 'Pan' }],
      },
    ];

    eqMock.mockImplementation(async () => ({
        data: mockData,
        error: null,
    }));

    const result = await getRecipeEquipment('r1');

    expect(supabase.from).toHaveBeenCalledWith('recipe_equipment');

    expect(selectMock).toHaveBeenCalledWith(`
      id,
      recipe_id,
      equipment_id,
      quantity,
      is_optional,
      notes,
      size,
      equipment ( name )
    `);

    expect(eqMock).toHaveBeenCalledWith('recipe_id', 'r1');

    expect(result).toEqual([
      {
        recipeEquipmentId: 're1',
        recipeId: 'r1',
        equipmentId: 'eq1',
        quantity: 2,
        isOptional: true,
        notes: 'Cast iron preferred',
        size: '12 inch',
        name: 'Pan',
      },
    ]);
  });

  it('should apply fallback defaults for nullable fields', async () => {
    const mockData = [
      {
        id: 're1',
        recipe_id: null,
        equipment_id: null,
        quantity: null,
        is_optional: null,
        notes: null,
        size: null,
        equipment: [],
      },
    ];

    eqMock.mockImplementation(async () => ({
        data: mockData,
        error: null,
    }));

    const result = await getRecipeEquipment('r1');

    expect(result).toEqual([
      {
        recipeEquipmentId: 're1',
        recipeId: '',
        equipmentId: '',
        quantity: 0,
        isOptional: false,
        notes: '',
        size: '',
        name: '',
      },
    ]);
  });

  it('should return empty array when no data exists', async () => {
    eqMock.mockImplementation(async () => ({
        data: [],
        error: null,
    }));

    const result = await getRecipeEquipment('r1');

    expect(result).toEqual([]);
  });

  it('should throw when supabase returns an error', async () => {
    eqMock.mockImplementation(async () => ({
        data: [],
        error: { message: 'oops' },
    }));

    await expect(getRecipeEquipment('r1')).rejects.toThrow('oops');
  });
});