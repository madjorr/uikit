// AUTO-GENERATED from @acronis-platform/ui-spec — DO NOT EDIT.
// Regenerate: pnpm --filter @acronis-platform/ui-spec generate:stories

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';

const meta = {
  title: 'UI/Button/All States (generated)',
  component: Button,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS = ['default', 'secondary', 'ghost', 'destructive', 'ai', 'inverted'] as const;
const SIZES = ['default', 'sm', 'lg'] as const;

export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZES.length + 1}, max-content)`,
        gap: 12,
        alignItems: 'center',
      }}
    >
      <span />
      {SIZES.map((s) => (
        <span key={s} style={{ fontSize: 12, opacity: 0.6 }}>
          {s}
        </span>
      ))}
      {VARIANTS.flatMap((v) => [
        <span key={`${v}-label`} style={{ fontSize: 12, opacity: 0.6 }}>
          {v}
        </span>,
        ...SIZES.map((s) => (
          <Button key={`${v}-${s}`} variant={v} size={s}>Label</Button>
        )),
      ])}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {VARIANTS.map((v) => (
        <Button key={v} variant={v} disabled>Label</Button>
      ))}
    </div>
  ),
};
