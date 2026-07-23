import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CarouselItem } from '../../carousel';
import { CarouselDialog } from '../carousel-dialog';

// Embla reports zero-size scroll snaps under jsdom/happy-dom regardless of
// slide count or position (see Carousel's own tests and
// CarouselDialogFooter's), so the last-slide/Close scenario below drives
// CarouselDialogFooter's boundary state through a mocked useCarousel(),
// while keeping Carousel/CarouselContent/CarouselItem real — this exercises
// the actual composition (Dialog + Carousel + CarouselDialogFooter wiring),
// not just the footer in isolation.
const mockCarousel = {
  canScrollPrev: false,
  canScrollNext: false,
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
};

vi.mock('../../carousel', async () => {
  const actual = await vi.importActual<typeof import('../../carousel')>('../../carousel');
  return { ...actual, useCarousel: () => mockCarousel };
});

beforeEach(() => {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  mockCarousel.scrollPrev = vi.fn();
  mockCarousel.scrollNext = vi.fn();
});

function Slides() {
  return (
    <>
      <CarouselItem>Slide 1</CarouselItem>
      <CarouselItem>Slide 2</CarouselItem>
      <CarouselItem>Slide 3</CarouselItem>
    </>
  );
}

describe('CarouselDialog', () => {
  it('renders its slides and footer inside the dialog', () => {
    render(
      <CarouselDialog open aria-label="Onboarding tour">
        <Slides />
      </CarouselDialog>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('has an accessible name when aria-label is passed', () => {
    render(
      <CarouselDialog open aria-label="Onboarding tour">
        <Slides />
      </CarouselDialog>
    );
    expect(
      screen.getByRole('dialog', { name: 'Onboarding tour' })
    ).toBeInTheDocument();
  });

  it('has an accessible name when aria-labelledby references slide content', () => {
    render(
      <CarouselDialog open aria-labelledby="tour-heading">
        <CarouselItem>
          <h2 id="tour-heading">Welcome</h2>
        </CarouselItem>
      </CarouselDialog>
    );
    expect(screen.getByRole('dialog', { name: 'Welcome' })).toBeInTheDocument();
  });

  it('forwards setApi and opts to the inner Carousel', () => {
    const setApi = vi.fn();
    render(
      <CarouselDialog
        open
        aria-label="Onboarding tour"
        setApi={setApi}
        opts={{ startIndex: 1 }}
      >
        <Slides />
      </CarouselDialog>
    );
    expect(setApi).toHaveBeenCalled();
  });

  it('closes the whole dialog when Close is activated on the last slide', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = false;
    render(
      <CarouselDialog open aria-label="Onboarding tour" onOpenChange={onOpenChange}>
        <Slides />
      </CarouselDialog>
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('forwards footer label overrides to CarouselDialogFooter', () => {
    render(
      <CarouselDialog
        open
        aria-label="Onboarding tour"
        nextLabel="Suivant"
        positionLabel="Position de la diapositive"
      >
        <Slides />
      </CarouselDialog>
    );
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: 'Position de la diapositive' })
    ).toBeInTheDocument();
  });
});
