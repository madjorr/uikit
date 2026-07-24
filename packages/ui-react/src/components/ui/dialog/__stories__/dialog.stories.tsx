import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../button';
import { Dialog, DialogClose } from '../dialog';

const VARIANTS = [
  'default',
  'rename',
  'save changes',
  'reset password',
  'discard changes',
  'accept',
  'read-only',
  'wide',
] as const;

const meta = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: VARIANTS,
      description:
        "Selects the canned title / body / footer preset. `wide` is a legacy escape hatch (no canned preset) kept for backward compatibility.",
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
      options: ['sm', 'large'],
      description:
        'Popup max-width (forwarded to DialogContent). `large` is a legacy backward-compatibility size with no design token.',
      table: {
        type: { summary: "'sm' | 'large'" },
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
    objectName: {
      control: 'text',
      description:
        "The real name of the object being acted on. Interpolated into the rename/discard changes/accept variants' canned title/body in place of the generic placeholder; ignored by other variants.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    secondaryLabel: {
      control: 'text',
      description:
        "Overrides the variant's default secondary (dismiss) button label. Passing this on a variant with no secondary button by default also makes the button appear. Ignored when `footer` is provided.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    primaryLabel: {
      control: 'text',
      description:
        "Overrides the variant's default primary button label. Ignored when `footer` is provided.",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    footer: {
      control: false,
      description:
        "Replaces the footer's action content entirely with free-form buttons — the escape hatch the `wide` variant is meant to be paired with.",
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
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
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Dialog {...args} defaultOpen />,
};

export const Default: Story = {
  render: () => <Dialog variant="default" defaultOpen />,
};

export const Rename: Story = {
  render: () => <Dialog variant="rename" defaultOpen />,
};

// `objectName` interpolates the real object's name into the rename/discard
// changes/accept variants' canned title/body, in place of the generic
// "object name" placeholder — no need to override title/children by hand.
export const WithObjectName: Story = {
  render: () => (
    <Dialog variant="rename" objectName="Q3 Report.xlsx" defaultOpen />
  ),
};

export const SaveChanges: Story = {
  render: () => <Dialog variant="save changes" defaultOpen />,
};

export const ResetPassword: Story = {
  render: () => <Dialog variant="reset password" defaultOpen />,
};

export const DiscardChanges: Story = {
  render: () => <Dialog variant="discard changes" defaultOpen />,
};

export const Accept: Story = {
  render: () => <Dialog variant="accept" defaultOpen />,
};

export const ReadOnly: Story = {
  render: () => <Dialog variant="read-only" defaultOpen />,
};

export const Loading: Story = {
  render: () => <Dialog variant="save changes" hasLoading defaultOpen />,
};

export const CustomContent: Story = {
  render: () => (
    <Dialog variant="default" defaultOpen>
      <p className="text-sm leading-6 text-foreground">
        Any custom body content can be dropped into the slot, replacing the
        preset copy while keeping the header and footer chrome.
      </p>
    </Dialog>
  ),
};

// The `wide` variant is a legacy escape hatch with no canned preset — kept for
// backward compatibility with pre-Figma call sites that used a wider popup and
// fully custom footer buttons. Pair it with `size="large"` (832px) and the
// `footer` prop for free-form action content.
export const Large: Story = {
  render: () => (
    <Dialog
      variant="wide"
      size="large"
      title="Configure discovery agent"
      defaultOpen
      footer={
        <>
          <DialogClose render={<Button variant="ghost">Cancel</Button>} />
          <Button>Configure</Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-foreground">
        The discovery agent will obtain the neighbor IP addresses by using
        NetBIOS discovery, Web Service Discovery (WSD), and Address Resolution
        Protocol (ARP) table.
      </p>
    </Dialog>
  ),
};
