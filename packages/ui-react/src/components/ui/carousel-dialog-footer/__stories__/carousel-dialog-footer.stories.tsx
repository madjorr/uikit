import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel, CarouselContent, CarouselItem } from '../../carousel';
import { Dialog } from '../../dialog';
import { CarouselDialogFooter } from '../carousel-dialog-footer';

// Rendered inside a real <Carousel> with `opts.startIndex` seeding the slide —
// in an actual browser (Storybook/VR), Embla measures real box metrics, so
// canScrollPrev/canScrollNext (and therefore the footer's first/middle/last
// state) come out correctly, unlike jsdom/happy-dom in Vitest (see the test
// file for why that environment needs a mocked useCarousel() instead).
//
// Also wrapped in a bare `<Dialog open>` root (no DialogContent/Portal) —
// the last-state Close control composes with `DialogClose`, which needs a
// Dialog context to destructure even outside its own Popup.
function FooterAtIndex({ startIndex }: { startIndex: number }) {
  return (
    <Dialog open>
      <Carousel opts={{ startIndex }} className="w-full max-w-[464px] border border-border">
        <CarouselContent>
          <CarouselItem className="flex h-40 items-center justify-center">
            Slide 1
          </CarouselItem>
          <CarouselItem className="flex h-40 items-center justify-center">
            Slide 2
          </CarouselItem>
          <CarouselItem className="flex h-40 items-center justify-center">
            Slide 3
          </CarouselItem>
        </CarouselContent>
        <CarouselDialogFooter />
      </Carousel>
    </Dialog>
  );
}

// A single-slide dialog: canScrollPrev/canScrollNext are both false, which
// getFooterState special-cases to 'last' so Close renders (see its own
// comment) instead of leaving no reachable way to close the dialog. The dot
// indicator correctly renders exactly 1 dot (one per real slide), not a
// fixed count.
function SingleSlideFooter() {
  return (
    <Dialog open>
      <Carousel className="w-full max-w-[464px] border border-border">
        <CarouselContent>
          <CarouselItem className="flex h-40 items-center justify-center">
            Only slide
          </CarouselItem>
        </CarouselContent>
        <CarouselDialogFooter />
      </Carousel>
    </Dialog>
  );
}

// Renders `count` slides, seeded at `startIndex` — the position indicator
// renders one dot per real slide (capped at 5) and marks the real
// `selectedScrollSnap()` active (see behavior.md); these stories vary the
// total to exercise that across boundary counts. Pairing the footer directly
// with a bare `<Carousel>` (bypassing `<CarouselDialog>`) is only done here
// to demonstrate the footer's own [1, 5] contract in isolation.
function FooterWithSlideCount({ count, startIndex }: { count: number; startIndex: number }) {
  return (
    <Dialog open>
      <Carousel opts={{ startIndex }} className="w-full max-w-[464px] border border-border">
        <CarouselContent>
          {Array.from({ length: count }, (_, index) => (
            <CarouselItem key={index} className="flex h-40 items-center justify-center">
              Slide {index + 1} of {count}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDialogFooter />
      </Carousel>
    </Dialog>
  );
}

const meta = {
  title: 'UI/CarouselDialogFooter',
  component: CarouselDialogFooter,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof CarouselDialogFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {
  render: () => <FooterAtIndex startIndex={0} />,
};

export const Middle: Story = {
  render: () => <FooterAtIndex startIndex={1} />,
};

export const Last: Story = {
  render: () => <FooterAtIndex startIndex={2} />,
};

export const SingleSlide: Story = {
  render: () => <SingleSlideFooter />,
};

// With only 2 slides, the footer never reaches its "middle" state — the very
// first navigation already lands on the last slide (Back appears, Next is
// replaced by Close).
export const TwoSlides: Story = {
  render: () => <FooterWithSlideCount count={2} startIndex={0} />,
};

export const FourSlides: Story = {
  render: () => <FooterWithSlideCount count={4} startIndex={1} />,
};

// A slide count above the footer's own enforced maximum, paired directly
// with a bare `<Carousel>` (bypassing `<CarouselDialog>`'s children slice) —
// the dot indicator still caps at 5 (the first active) and a development-mode
// console warning is logged, exactly like CarouselDialog's own TooManySlides
// story.
export const TooManySlides: Story = {
  render: () => <FooterWithSlideCount count={11} startIndex={0} />,
};

// Demonstrates that Back/Next/Close and the position list's accessible name
// are localizable via props, not baked into the component.
export const CustomLabels: Story = {
  render: () => (
    <Dialog open>
      <Carousel opts={{ startIndex: 1 }} className="w-full max-w-[464px] border border-border">
        <CarouselContent>
          <CarouselItem className="flex h-40 items-center justify-center">
            Diapositive 1
          </CarouselItem>
          <CarouselItem className="flex h-40 items-center justify-center">
            Diapositive 2
          </CarouselItem>
          <CarouselItem className="flex h-40 items-center justify-center">
            Diapositive 3
          </CarouselItem>
        </CarouselContent>
        <CarouselDialogFooter
          backLabel="Précédent"
          nextLabel="Suivant"
          closeLabel="Fermer"
          positionLabel="Position de la diapositive"
        />
      </Carousel>
    </Dialog>
  ),
};
