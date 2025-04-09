import { Feather } from '@expo/vector-icons';
import { cssInterop } from 'nativewind';

export function iconWithClassName(icon: typeof Feather) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: {
        color: 'color',
      },
    },
  });
}
