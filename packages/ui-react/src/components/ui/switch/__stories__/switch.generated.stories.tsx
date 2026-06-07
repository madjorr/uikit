// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '../switch';

const meta = {
  title: 'UI/Switch/All States (generated)',
  component: Switch,
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
      <Switch aria-label="Off" />
      <Switch aria-label="On" defaultChecked />
      <Switch aria-label="Disabled off" disabled />
      <Switch aria-label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
