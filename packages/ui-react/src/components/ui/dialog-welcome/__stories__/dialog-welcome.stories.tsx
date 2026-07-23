import type { Meta, StoryObj } from '@storybook/react-vite';

import { DialogWelcome } from '../dialog-welcome';

// A deterministic illustration placeholder for the media slot (no remote asset,
// so visual-regression baselines stay stable).
const SampleIllustration = () => (
  <div className="flex h-full w-full items-center justify-center bg-[var(--ui-background-surface-active)] text-sm text-muted-foreground">
    Illustration
  </div>
);

const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

const meta = {
  title: 'UI/DialogWelcome',
  component: DialogWelcome,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: "Step title (the dialog's accessible name).",
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    description: {
      control: 'text',
      description: 'Supporting copy shown below the title.',
      table: { type: { summary: 'string' }, category: 'Content' },
    },
    image: {
      control: false,
      description: 'Illustration / image rendered in the media slot.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    children: {
      control: false,
      description: 'Overrides the default title + description text block.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
    size: {
      control: 'select',
      options: SIZES,
      description: 'Popup max-width (forwarded to DialogContent).',
      table: {
        type: { summary: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'" },
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
    portal: {
      control: false,
      description: 'Render inside a portal (forwarded to DialogContent).',
      table: { type: { summary: 'boolean' }, category: 'Behavior' },
    },
  },
  args: {
    title: 'Title',
    description: 'Feature description.',
  },
} satisfies Meta<typeof DialogWelcome>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <DialogWelcome {...args} image={<SampleIllustration />} defaultOpen />
  ),
};

export const Default: Story = {
  render: () => (
    <DialogWelcome
      title="Welcome to the workspace"
      description="Take a quick tour of the features available to you."
      image={<SampleIllustration />}
      defaultOpen
    />
  ),
};

export const WithoutImage: Story = {
  render: () => (
    <DialogWelcome
      title="Title"
      description="Feature description."
      defaultOpen
    />
  ),
};

export const CustomContent: Story = {
  render: () => (
    <DialogWelcome title="Title" description="Feature description." defaultOpen>
      <div className="flex w-full flex-col gap-1 px-4 text-center text-foreground">
        <p className="text-2xl font-normal leading-8">Custom heading</p>
        <p className="text-sm leading-6">
          Any custom body content can replace the default title and description
          text block while keeping the image slot and dialog chrome.
        </p>
      </div>
    </DialogWelcome>
  ),
};
