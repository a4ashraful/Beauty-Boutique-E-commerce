'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Product } from '@/types';

export function ProductInfoTabs({ product }: { product: Product }) {
  const hasDetails =
    product.description ||
    product.ingredients ||
    product.benefits ||
    product.howToUse ||
    product.skinTypes?.length ||
    product.skinConcerns?.length ||
    product.size ||
    product.countryOfOrigin;

  if (!hasDetails) return null;

  return (
    <div className="rounded-xl border bg-white p-5">
      <Tabs defaultValue="description">
        <TabsList className="w-full justify-start overflow-x-auto no-scrollbar">
          <TabsTrigger value="description">Description</TabsTrigger>
          {product.ingredients && <TabsTrigger value="ingredients">Ingredients</TabsTrigger>}
          {(product.benefits || product.howToUse) && <TabsTrigger value="howto">How to Use</TabsTrigger>}
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <div className="prose-product text-sm text-gray-700 leading-relaxed">
            {product.description || product.shortDescription || 'No description available.'}
          </div>
        </TabsContent>

        {product.ingredients && (
          <TabsContent value="ingredients">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.ingredients}
            </p>
          </TabsContent>
        )}

        {(product.benefits || product.howToUse) && (
          <TabsContent value="howto">
            {product.benefits && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-1">Benefits</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{product.benefits}</p>
              </div>
            )}
            {product.howToUse && (
              <div>
                <h4 className="text-sm font-semibold mb-1">How to Use</h4>
                <p className="text-sm text-gray-700 whitespace-pre-line">{product.howToUse}</p>
              </div>
            )}
          </TabsContent>
        )}

        <TabsContent value="details">
          <dl className="grid grid-cols-2 gap-y-3 text-sm">
            {product.brandName && <Row label="Brand" value={product.brandName} />}
            {product.categoryName && <Row label="Category" value={product.categoryName} />}
            {product.size && <Row label="Size" value={product.size} />}
            {product.sku && <Row label="SKU" value={product.sku} />}
            {product.countryOfOrigin && <Row label="Country of Origin" value={product.countryOfOrigin} />}
            {product.skinTypes?.length ? <Row label="Skin Type" value={product.skinTypes.join(', ')} /> : null}
            {product.skinConcerns?.length ? <Row label="Skin Concern" value={product.skinConcerns.join(', ')} /> : null}
            {product.expiryInfo && <Row label="Expiry / Batch" value={product.expiryInfo} />}
          </dl>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase text-gray-500 tracking-wide">{label}</dt>
      <dd className="text-gray-800 font-medium">{value}</dd>
    </div>
  );
}