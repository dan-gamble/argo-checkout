import {createElement, ReactElement} from 'react';
import {render as remoteRender} from '@remote-ui/react';

import {extend} from '@shopify/argo-checkout';
import type {
  RenderExtensionPoint,
  InputForRenderExtension,
} from '@shopify/argo-checkout';

import {ExtensionInputContext} from './context';

export function render<ExtensionPoint extends RenderExtensionPoint>(
  extensionPoint: ExtensionPoint,
  render: (input: InputForRenderExtension<ExtensionPoint>) => ReactElement<any>,
) {
  // TypeScript can’t infer the type of the callback because it’s a big union
  // type. To get around it, we’ll just fake like we are rendering the
  // KitchenSink extension, since all render extensions have the same general
  // shape (`RenderExtension`).
  return extend<'Checkout::KitchenSink'>(
    extensionPoint as any,
    (root, input) => {
      remoteRender(
        createElement(
          ExtensionInputContext.Provider,
          {value: input},
          render(input as InputForRenderExtension<ExtensionPoint>),
        ),
        root,
      );

      return {};
    },
  );
}
