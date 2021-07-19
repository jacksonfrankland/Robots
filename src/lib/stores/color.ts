import { writable} from 'svelte/store';
import tailwindTheme from 'tailwindcss/defaultTheme';
import * as colors from 'tailwindcss/colors';

// colors

export default writable(tailwindTheme.colors);
