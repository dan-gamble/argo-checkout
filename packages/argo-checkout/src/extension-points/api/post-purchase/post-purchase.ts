import type {StandardApi} from '../standard';
import type {ValueOrPromise} from '../shared';

/** input given to the ShouldRender extension point (Checkout::PostPurchase::ShouldRender) */
export interface PostPurchaseShouldRenderApi
  extends StandardApi<'Checkout::PostPurchase::ShouldRender'> {
  /** current cart being checked out */
  checkout: Checkout;

  /** general purpose storage for extensions */
  storage: Storage;
}

/** output expected from the ShouldRender extension point (Checkout::PostPurchase::ShouldRender) */
export type PostPurchaseShouldRenderResult = ValueOrPromise<{
  /** whether or not to render the post-purchase page */
  render: boolean;
}>;

/** input given to the render extension point (Checkout::PostPurchase::Render) */
export interface PostPurchaseRenderApi
  extends StandardApi<'Checkout::PostPurchase::Render'> {
  /** initial purchase */
  order: Order;

  /** general purpose storage for extensions */
  storage: Storage;

  /**
   * signals that the extension is finished running
   * essentially redirects buyers to the thank you page
   */
  done(): Promise<void>;
}

/** general-purpose, key-value browser storage for extensions */
interface Storage {
  /** data in the storage during the first load (read-only) */
  initialData: unknown;

  /** updates the storage to the value that it's given */
  update(data: any): Promise<void>;
}

/**
 * kept small for development
 * many more attributes will be added before making it available to partners
 */
interface Order {
  id: number;
  token: string;

  /** shop where the checkout/order is from */
  shop: Shop;

  /** items being purchased */
  lineItems: LineItem[];
}

type Checkout = Order;

interface Shop {
  id: number;

  /**
   * only public listed metafields are available
   * https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api
   */
  metafields: {[key: string]: string};
}

interface LineItem {
  /** product being purchased */
  product: Product;
}

interface Product {
  id: number;
  title: string;

  /** variant being purchased */
  variant: Variant;

  /**
   * only public listed metafields are available
   * https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api
   */
  metafields: {[key: string]: string};
}

interface Variant {
  id: number;
  title: string;

  /**
   * only public listed metafields are available
   * https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api
   */
  metafields: {[key: string]: string};
}
