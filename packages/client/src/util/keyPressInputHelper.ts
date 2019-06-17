import * as React from 'react';

export default function handleKeys(event: React.KeyboardEvent, escape: () => void, enter: () => void): void {
  if (event.key === 'Enter') {
    enter();
  }

  if (event.key === 'Escape') {
    escape();
  }
}
