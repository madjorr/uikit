'use client';

import { useState } from 'react';
import { Button, DialogDefault } from '@acronis-platform/ui-react';

export function DialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DialogDefault
        variant="discard changes"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
