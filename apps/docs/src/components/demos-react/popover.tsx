'use client';

import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@acronis-platform/ui-react';

export function PopoverDemo() {
  return (
    <Popover defaultOpen>
      <PopoverTrigger render={<Button variant="secondary">Open popover</Button>} />
      <PopoverContent>
        <PopoverBody>
          <h4 className="font-medium leading-none">Dimensions</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
