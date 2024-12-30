/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#ffffff',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  myTheme: {
    // Default background color of <screens />...etc
    background: '#002e5d',
    foreground: 'hsl(0, 0.00%, 100.00%)',

    // Muted backgrounds such as <TabsList />, <Skeleton /> and <Switch />
    muted: 'hsl(210, 40%, 96.1%)',
    mutedForeground: 'hsl(215, 16.3%, 46.9%)',

    // Background color for <Card />
    card: 'hsl(0, 0%, 100%)',
    cardForeground: 'hsl(222, 84%, 4.9%)',

    // Background color for popovers such as <DropdownMenu />, <HoverCard />, <Popover />
    popover: 'hsl(0, 0%, 100%)',
    popoverForeground: 'hsl(222, 84%, 4.9%)',

    // Border color
    border: 'hsl(214, 31.8%, 91.4%)',

    // Border color for inputs such as <Input />, <Select />, <Textarea />
    inputBorder: 'hsl(214, 31.8%, 91.4%)',

    // Primary colors for <Button />
    primary: 'hsl(221, 83.2%, 53.3%)',
    primaryForeground: 'hsl(210, 40%, 98%)',

    // Secondary colors for <Button />
    secondary: 'hsl(210, 40%, 96.1%)',
    secondaryForeground: 'hsl(222, 47.4%, 11.2%)',

    // Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc
    accent: 'hsl(210, 40%, 96.1%)',
    accentForeground: 'hsl(222, 47.4%, 11.2%)',

    // Used for destructive actions such as <Button variant="destructive">
    destructive: 'hsl(0, 84.2%, 60.2%)',
    destructiveForeground: 'hsl(210, 40%, 98%)',

    // Border radius for card, input and buttons
    radius: '20px',
  },
};
