import {createRemoteComponent} from '@remote-ui/core';

export interface ButtonGroupProps {}

/**
 * A button group is meant to wrap around two or more buttons, passed as
 * children. The button group will stack these buttons along the inline
 * axis, and add the necessary spacing between them.
 */
export const ButtonGroup = createRemoteComponent<
  'ButtonGroup',
  ButtonGroupProps
>('ButtonGroup');
