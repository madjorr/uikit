// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories

import type { Meta, StoryObj } from '@storybook/react-vite';
import { PlusIcon } from '@acronis-platform/icons-react/stroke-mono';
import { ButtonIcon } from '../button-icon';

const meta = {
  title: 'UI/ButtonIcon/All States (generated)',
  component: ButtonIcon,
} satisfies Meta<typeof ButtonIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <ButtonIcon aria-label="Action"><PlusIcon /></ButtonIcon>
      <ButtonIcon aria-label="Action" disabled><PlusIcon /></ButtonIcon>
    </div>
  ),
};
