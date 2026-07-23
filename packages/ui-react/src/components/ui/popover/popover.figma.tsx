// Figma Code Connect — status: COMPLETE
// Mapped to the "Popover" component (node 6364:17907) in the ui-react Figma
// file. Its only exposed property is the `Body` slot; the `FooterDefault`
// (variant=default) footer is fixed content on this node, not a variant, so
// the example reproduces it verbatim via `PopoverFooter` + two `Button`s.
import * as React from 'react';
import figma from '@figma/code-connect';

import { Button } from '../button/button';
import { Popover, PopoverBody, PopoverContent, PopoverFooter, PopoverTrigger } from './popover';

figma.connect(
  Popover,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6364-17907',
  {
    props: {
      body: figma.children('Body'),
    },
    example: ({ body }: { body: React.ReactNode }) => (
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverBody>{body}</PopoverBody>
          <PopoverFooter>
            <Button variant="secondary">Cancel</Button>
            <Button>Apply</Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    ),
  }
);
