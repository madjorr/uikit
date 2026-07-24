import type { Meta, StoryObj } from '@storybook/react-vite';

import { ButtonIconInput } from '../button-icon-input';

const EyeIcon = () => (
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M22 13c-2.1454-2.4958-5.8766-5-10.0092-5C7.9139 8 4.1575 10.4619 2 12.8739" />
    <path d="M12 17c2.2091 0 4-1.7909 4-4s-1.7909-4-4-4-4 1.7909-4 4 1.7909 4 4 4" />
  </svg>
);

const meta = {
  title: 'UI/ButtonIconInput',
  component: ButtonIconInput,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['normal', 'error'],
      description:
        "Visual tone — mirrors the field it's embedded in. Maps to the Figma ButtonIconInput `variant` property.",
      table: {
        type: { summary: "'normal' | 'error'" },
        defaultValue: { summary: 'normal' },
        category: 'Appearance',
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button and applies the disabled token set.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    'aria-label': {
      control: 'text',
      description:
        'Accessible name for the icon-only button. Provide this (or `aria-labelledby`) so the control has a label.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    children: {
      control: false,
      description: 'The icon element rendered inside the button.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    onClick: {
      control: false,
      description: 'Click handler.',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        category: 'Events',
      },
    },
    render: {
      control: false,
      description:
        'Base UI render prop — replace the underlying `<button>` (e.g. render as an `<a>`).',
      table: { type: { summary: 'RenderProp' }, category: 'Composition' },
    },
  },
  args: {
    'aria-label': 'Show password',
    children: <EyeIcon />,
  },
} satisfies Meta<typeof ButtonIconInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: { variant: 'normal' },
};

export const Error: Story = {
  args: { variant: 'error' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ButtonIconInput aria-label="Show password">
        <EyeIcon />
      </ButtonIconInput>
      <ButtonIconInput aria-label="Show password" variant="error">
        <EyeIcon />
      </ButtonIconInput>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <ButtonIconInput aria-label="Show password">
          <EyeIcon />
        </ButtonIconInput>
        <ButtonIconInput aria-label="Show password" disabled>
          <EyeIcon />
        </ButtonIconInput>
      </div>
      <div className="flex items-center gap-3">
        <ButtonIconInput aria-label="Show password" variant="error">
          <EyeIcon />
        </ButtonIconInput>
        <ButtonIconInput aria-label="Show password" variant="error" disabled>
          <EyeIcon />
        </ButtonIconInput>
      </div>
    </div>
  ),
};
