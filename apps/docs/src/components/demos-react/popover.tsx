'use client';

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@acronis-platform/ui-react';

export function PopoverDemo() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
      <PopoverContent>
        <div className="grid gap-2">
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
