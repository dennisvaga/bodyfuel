/**
 * Standardized Prisma include configurations for products
 * Used across all repositories that need product data
 */
export declare const PRODUCT_BASIC_INCLUDE: {
    readonly images: true;
    readonly options: {
        readonly include: {
            readonly optionValues: true;
        };
    };
    readonly variants: {
        readonly include: {
            readonly variantOptionValues: {
                readonly include: {
                    readonly optionValue: true;
                };
            };
        };
    };
};
export declare const PRODUCT_FULL_INCLUDE: {
    readonly collections: true;
    readonly category: true;
    readonly images: true;
    readonly options: {
        readonly include: {
            readonly optionValues: true;
        };
    };
    readonly variants: {
        readonly include: {
            readonly variantOptionValues: {
                readonly include: {
                    readonly optionValue: true;
                };
            };
        };
    };
};
export declare const PRODUCT_MINIMAL_INCLUDE: {
    readonly images: true;
};
//# sourceMappingURL=product-includes.d.ts.map