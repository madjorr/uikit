import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Dialog, DialogContent } from '../../dialog';
import { CarouselDialogFooter } from '../carousel-dialog-footer';

// Embla reports zero-size scroll snaps under jsdom/happy-dom regardless of
// slide count (see Carousel's own tests, which work around this with
// `opts.loop`), so canScrollPrev/canScrollNext can't be driven through real
// navigation here. CarouselDialogFooter's contract is "reads these four
// values from useCarousel()" — mocking that hook tests exactly that contract,
// independent of Embla's DOM measurement.
const mockCarousel = {
  canScrollPrev: false,
  canScrollNext: false,
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
};

vi.mock('../../carousel', () => ({
  useCarousel: () => mockCarousel,
}));

beforeEach(() => {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  mockCarousel.scrollPrev = vi.fn();
  mockCarousel.scrollNext = vi.fn();
});

function renderFirst() {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = true;
  return render(<CarouselDialogFooter />);
}

function renderMiddle() {
  mockCarousel.canScrollPrev = true;
  mockCarousel.canScrollNext = true;
  return render(<CarouselDialogFooter />);
}

function renderLast(onOpenChange?: (open: boolean) => void) {
  mockCarousel.canScrollPrev = true;
  mockCarousel.canScrollNext = false;
  return render(
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <CarouselDialogFooter />
      </DialogContent>
    </Dialog>
  );
}

// canScrollPrev/canScrollNext both false: a single-slide dialog, or the
// pre-measurement instant before Embla's first `select`. getFooterState has
// no dedicated case for this — it falls back to 'first', which is a correct
// flash for a 3+ slide dialog but, for a genuine single slide, leaves no
// working Close (Next renders but scrollNext is a no-op with nothing to
// scroll to). Asserted here as documented current behavior, not a fix.
function renderBothDisabled() {
  mockCarousel.canScrollPrev = false;
  mockCarousel.canScrollNext = false;
  return render(<CarouselDialogFooter />);
}

function dotStates() {
  return screen.getAllByRole('listitem').map((dot) => dot.getAttribute('aria-current') === 'true');
}

describe('CarouselDialogFooter', () => {
  it('first state: no Back, shows Next, dot 1 active', () => {
    renderFirst();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(dotStates()).toEqual([true, false, false]);
  });

  it('middle state: shows Back and Next, dot 2 active', () => {
    renderMiddle();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(dotStates()).toEqual([false, true, false]);
  });

  it('last state: shows Back and Close (no Next), dot 3 active', () => {
    renderLast();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    expect(dotStates()).toEqual([false, false, true]);
  });

  it('always renders exactly 3 dot slots', () => {
    renderMiddle();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('both-disabled state (single slide): falls back to first, with no Close reachable', () => {
    renderBothDisabled();
    expect(screen.queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(dotStates()).toEqual([true, false, false]);
  });

  it('calls scrollPrev when Back is activated', async () => {
    const user = userEvent.setup();
    renderMiddle();
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockCarousel.scrollPrev).toHaveBeenCalledTimes(1);
  });

  it('calls scrollNext when Next is activated', async () => {
    const user = userEvent.setup();
    renderFirst();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockCarousel.scrollNext).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog when Close is activated, via Base UI compose (not a manual onClick)', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    renderLast(onOpenChange);
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it('overrides Back/Next/Close labels and the position list name via props', () => {
    mockCarousel.canScrollPrev = true;
    mockCarousel.canScrollNext = true;
    render(
      <CarouselDialogFooter
        backLabel="Précédent"
        nextLabel="Suivant"
        closeLabel="Fermer"
        positionLabel="Position de la diapositive"
      />
    );
    expect(screen.getByRole('button', { name: 'Précédent' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Suivant' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Position de la diapositive' })).toBeInTheDocument();
  });
});
