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

// Renders `count` slides — the footer's position indicator renders one dot
// per slide, matching CarouselDialog's own enforced [1, 5] slide range (see
// CarouselDialogFooter's behavior.md); these stories vary the total to
// exercise that range's boundaries (2 slides never reach a "middle" state).
function slides(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <CarouselItem
      key={index}
      className="flex h-48 items-center justify-center text-4xl font-semibold"
    >
      {index + 1}
    </CarouselItem>
  ));
}

export const Default: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      {slides(3)}
    </CarouselDialog>
  ),
};

// A single-slide dialog (the enforced minimum): canScrollPrev/canScrollNext
// are both false, so the footer resolves to its 'last' state (see
// CarouselDialogFooter's own SingleSlide story) — no Back, no Next, and a
// reachable Close. The dot indicator correctly renders exactly 1 dot.
export const SingleSlide: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      {slides(1)}
    </CarouselDialog>
  ),
};

// With only 2 slides, the footer never reaches its "middle" state — the very
// first navigation already lands on the last slide (Back appears, Next is
// replaced by Close).
export const TwoSlides: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      {slides(2)}
    </CarouselDialog>
  ),
};

export const FourSlides: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour" opts={{ startIndex: 1 }}>
      {slides(4)}
    </CarouselDialog>
  ),
};

// The enforced maximum (5 slides), seeded at the first slide: no Back, a
// 5-dot indicator with the first dot active, Next shown.
export const FirstSlide: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      {slides(5)}
    </CarouselDialog>
  ),
};

// The enforced maximum (5 slides), seeded at the last slide: Back shown, a
// 5-dot indicator with the last dot active, Close in place of Next.
export const LastSlide: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour" opts={{ startIndex: 4 }}>
      {slides(5)}
    </CarouselDialog>
  ),
};

// More than 5 slides is out of range — CarouselDialog renders only the
// first MAX_SLIDES (5) and dev-warns (see the browser console), rather than
// growing the dot indicator without bound.
export const TooManySlides: Story = {
  render: () => (
    <CarouselDialog open aria-label="Onboarding tour">
      {slides(8)}
    </CarouselDialog>
  ),
};
