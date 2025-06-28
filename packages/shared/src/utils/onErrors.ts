export async function onErrors(error: any) {
  Object.entries(error).forEach(([field, details]) => {
    console.log(`Validation Error in ${field}:`, details);
  });
}
