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
      <Carousel opts={{ startIndex }} className="w-80 border border-border">
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

// A single-slide dialog: canScrollPrev/canScrollNext are both false, a case
// getFooterState has no dedicated branch for (see its own comment). It falls
// back to the 'first' state, so this renders a non-disabled "Next" whose
// scrollNext has nothing to scroll to, and no "Close" is ever reachable —
// documented current behavior, not a fix.
function SingleSlideFooter() {
  return (
    <Dialog open>
      <Carousel className="w-80 border border-border">
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

// Demonstrates that Back/Next/Close and the position list's accessible name
// are localizable via props, not baked into the component.
export const CustomLabels: Story = {
  render: () => (
    <Dialog open>
      <Carousel opts={{ startIndex: 1 }} className="w-80 border border-border">
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
