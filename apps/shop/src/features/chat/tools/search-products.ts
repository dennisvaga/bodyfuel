import { tool } from 'ai';
import { z } from 'zod';

// Define the product search tool
export const searchProducts = tool({
  description: 'Search for products in the BodyFuel catalog by name or description',
  parameters: z.object({
    query: z.string().describe('The search query for finding products'),
  }),
  execute: async ({ query }) => {
    try {
      // Call the existing product search API
      const response = await fetch(`http://localhost:5001/api/products/search?search=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to search products: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data || result.data.length === 0) {
        return { products: [], message: 'No products found matching your query.' };
      }

      // Format the products for the chatbot response
      const formattedProducts = result.data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || 'No description available',
        price: `$${product.price.toFixed(2)}`,
        category: product.category?.name || 'Uncategorized',
        imageUrl: product.images && product.images.length > 0 ? product.images[0].url : null,
      }));

      return {
        products: formattedProducts,
        message: `Found ${formattedProducts.length} products matching your query.`,
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return {
        products: [],
        message: 'Sorry, there was an error searching for products. Please try again later.',
      };
    }
  },
});
