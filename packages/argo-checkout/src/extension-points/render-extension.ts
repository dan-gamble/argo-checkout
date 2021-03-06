import {RemoteRoot, RemoteComponentType} from '@remote-ui/core';

interface RenderResult<Input> {
  update?(input: Partial<Input>): void;
}

/**
 * A type of extension point that is capable of rendering UI into Checkout
 * natively. This type of extension point receives an object to manipulate
 * the UI as its first argument, and additional data and methods as a second
 * argument. The object that can manipulate the UI is referred to as a `RemoteRoot`,
 * and is provided by the [remote-ui library](https://github.com/Shopify/remote-ui/tree/main/packages/core)
 * on which Argo’s rendering capabilities are built.
 */
export interface RenderExtension<
  Input,
  AllowedComponents extends RemoteComponentType<string, any, any>
> {
  (root: RemoteRoot<AllowedComponents, true>, input: Input): RenderResult<
    Input
  > | void;
}
