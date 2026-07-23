'use client';

import { useState } from 'react';

import { Button, CarouselDialog, CarouselItem } from '@acronis-platform/ui-react';

// CarouselDialogFooter (the Back/dots/Next/Close bar) is composed inside
// CarouselDialog and reads its state from the ambient <Carousel> context —
// that context provider isn't part of the public API on its own, so this is
// the supported way to see it render. See its own docs page for its props.
export function CarouselDialogFooterDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open
      </Button>
      <CarouselDialog open={open} onOpenChange={setOpen} aria-label="Footer demo">
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselDialog>
    </>
  );
}
