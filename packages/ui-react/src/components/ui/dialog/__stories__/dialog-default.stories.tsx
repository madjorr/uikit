import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialogDefault } from '../dialog';

const VARIANTS = [
  'default',
  'rename',
  'save changes',
  'reset password',
  'discard changes',
  'accept',
  'read-only',
] as const;

const meta = {
  title: 'UI/DialogDefault',
  component: DialogDefault,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description: 'Selects the canned title / body / footer preset.',
      table: {
        type: { summary: VARIANTS.map((v) => `'${v}'`).join(' | ') },
        defaultValue: { summary: "'default'" },
        category: 'Appearance',
      },
    },
    hasLoading: {
      control: 'boolean',
      description: 'Show a spinner overlay across the body + footer.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
        category: 'State',
      },
    },
    size: {
      control: 'select',
      options: ['sm'],
      description:
        'Popup max-width (forwarded to DialogContent). Only `sm` is defined today.',
      table: {
        type: { summary: "'sm'" },
        defaultValue: { summary: "'sm'" },
        category: 'Appearance',
      },
    },
    defaultOpen: {
      control: 'boolean',
      description: 'Open on mount, uncontrolled.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    open: {
      control: 'boolean',
      description: 'Controlled open state. Pair with `onOpenChange`.',
      table: { type: { summary: 'boolean' }, category: 'State' },
    },
    modal: {
      control: 'boolean',
      description: 'Modal behavior — focus trap and scroll lock while open.',
      table: {
        type: { summary: "boolean | 'trap-focus'" },
        defaultValue: { summary: 'true' },
        category: 'Behavior',
      },
    },
    onOpenChange: {
      control: false,
      description: 'Fires when the dialog opens or closes.',
      table: {
        type: { summary: '(open, eventDetails) => void' },
        category: 'Events',
      },
    },
    children: {
      control: false,
      description: "Overrides the variant's default body content.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    title: {
      control: 'text',
      description: "Overrides the variant's default title.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    secondaryLabel: {
      control: 'text',
      description:
        "Overrides the variant's default secondary (dismiss) button label. Passing this on a variant with no secondary button by default also makes the button appear.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    primaryLabel: {
      control: 'text',
      description: "Overrides the variant's default primary button label.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    closeLabel: {
      control: 'text',
      description: "Overrides the close button's accessible name.",
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Close'" },
        category: 'Content',
      },
    },
    portal: {
      control: false,
      description: 'Render inside a portal (forwarded to DialogContent).',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
  args: { variant: 'default', hasLoading: false },
} satisfies Meta<typeof DialogDefault>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <DialogDefault {...args} defaultOpen />,
};

export const Default: Story = {
  render: () => <DialogDefault variant="default" defaultOpen />,
};

export const Rename: Story = {
  render: () => <DialogDefault variant="rename" defaultOpen />,
};

export const SaveChanges: Story = {
  render: () => <DialogDefault variant="save changes" defaultOpen />,
};

export const ResetPassword: Story = {
  render: () => <DialogDefault variant="reset password" defaultOpen />,
};

export const DiscardChanges: Story = {
  render: () => <DialogDefault variant="discard changes" defaultOpen />,
};

export const Accept: Story = {
  render: () => <DialogDefault variant="accept" defaultOpen />,
};

export const ReadOnly: Story = {
  render: () => <DialogDefault variant="read-only" defaultOpen />,
};

export const Loading: Story = {
  render: () => <DialogDefault variant="save changes" hasLoading defaultOpen />,
};

export const CustomContent: Story = {
  render: () => (
    <DialogDefault variant="default" defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        Any custom body content can be dropped into the slot, replacing the
        preset copy while keeping the header and footer chrome.
      </p>
    </DialogDefault>
  ),
};
