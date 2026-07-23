'use client';

import { useState } from 'react';

import { Button, CarouselDialog, CarouselItem } from '@acronis-platform/ui-react';

export function CarouselDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Start tour
      </Button>
      <CarouselDialog open={open} onOpenChange={setOpen} aria-label="Product tour">
        <CarouselItem>Welcome to the new dashboard.</CarouselItem>
        <CarouselItem>Here&apos;s where your alerts live now.</CarouselItem>
        <CarouselItem>You&apos;re all set.</CarouselItem>
      </CarouselDialog>
    </>
  );
}
