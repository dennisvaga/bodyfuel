import { ENTITY_TYPES } from "#types/entities";

// Helper function to get the capitalized label
export function getEntityLabel(type: ENTITY_TYPES): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
