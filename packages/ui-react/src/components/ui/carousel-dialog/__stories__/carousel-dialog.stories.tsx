import type { Meta, StoryObj } from '@storybook/react-vite';

import { CarouselItem } from '../../carousel';
import { CarouselDialog, type CarouselDialogProps } from '../carousel-dialog';

const meta = {
  title: 'UI/CarouselDialog',
  component: CarouselDialog,
  // The story opens by default (a portaled, fixed-position modal). Autodocs
  // mounts the primary story's canvas twice on one Docs page (once as the
  // top preview, once again under "Stories") — two simultaneously-open
  // Dialogs stack their backdrops and fight over Base UI's modal manager, so
  // only the last one is interactive. `inline: false` renders each instance
  // in its own iframe on Docs, avoiding the collision.
  parameters: {
    layout: 'centered',
    docs: { story: { inline: false, height: '500px' } },
  },
  tags: ['autodocs'],
  // `children` is required (one `<CarouselItem>` per slide); the story
  // drives it via `render`, so satisfy the args type with an empty cast.
  args: {} as CarouselDialogProps,
  argTypes: {
    opts: {
      control: false,
      description: 'Forwarded to the inner Carousel (e.g. `{ startIndex }`).',
      table: { type: { summary: 'EmblaOptionsType' }, category: 'Behavior' },
    },
    setApi: {
      control: false,
      description: 'Forwarded to the inner Carousel; called once with the Embla API instance.',
      table: { type: { summary: '(api: CarouselApi) => void' }, category: 'Behavior' },
    },
    children: {
      control: false,
      description: 'One `<CarouselItem>` per slide — same shape as `<Carousel>`’s own children.',
      table: { type: { summary: 'ReactNode' }, category: 'Content' },
    },
  },
} satisfies Meta<typeof CarouselDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      <CarouselItem className="flex h-48 items-center justify-center text-4xl font-semibold">
        1
      </CarouselItem>
      <CarouselItem className="flex h-48 items-center justify-center text-4xl font-semibold">
        2
      </CarouselItem>
      <CarouselItem className="flex h-48 items-center justify-center text-4xl font-semibold">
        3
      </CarouselItem>
    </CarouselDialog>
  ),
};
