# cards-gallery

Custom **cards** block. Purpose: photo gallery (Galleria "twelve" look): a black stage showing the current photo with prev / next arrows and autoplay, a bar with thumbnails toggle, play / pause, "n / total" counter and caption, popout lightbox and fullscreen buttons, and a thumbnail grid overlay. Bar/nav sprites (*.png) are copied from the source theme.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: one row per photo: image cell + optional caption cell. The lightbox viewer, caption bar, counter and buttons are runtime UI drawn by the block, not authored.

## Supported variations

No variations.

## Universal Editor fields

- Content fields derived from the block's decorate contract.
