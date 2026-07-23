// Figma Code Connect — status: COMPLETE
// Mapped to the "DialogWelcome" frame in the ui-react Figma file
// (node 6353:6164). Verified via get_context_for_code_connect: the frame has no
// component properties (title/description are plain TEXT nodes), so the mapping
// is the static image/title/description composition. The footer carousel shown
// in the frame is out of scope for DialogWelcome — it is a separate
// Carousel / CarouselDialogFooter component set.
import figma from '@figma/code-connect';

import { DialogWelcome } from './dialog-welcome';

figma.connect(
  DialogWelcome,
  'https://www.figma.com/design/lrU3ydIyvPYQNE6ixdsKtJ/ui-react?node-id=6353-6164',
  {
    example: () => (
      <DialogWelcome
        title="Title"
        description="Feature description."
        defaultOpen
      />
    ),
  }
);
