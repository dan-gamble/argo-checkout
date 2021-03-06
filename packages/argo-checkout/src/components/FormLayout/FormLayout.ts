import {createRemoteComponent} from '@remote-ui/core';

export interface FormLayoutProps {}

/**
 * Use a form layout to arrange fields within a form using standard spacing. Every
 * nested field or group will stack along the block axis. If you want visually group
 * fields nested in a form layout, use a form layout group.
 */
export const FormLayout = createRemoteComponent<'FormLayout', FormLayoutProps>(
  'FormLayout',
);

export interface FormLayoutGroupProps {}

/**
 * Use a form layout group to group fields within a form layout. Grouped fields will
 * appear inline with one another when possible, with each field taking up equal
 * spacing.
 */
export const FormLayoutGroup = createRemoteComponent<
  'FormLayoutGroup',
  FormLayoutGroupProps
>('FormLayoutGroup');
