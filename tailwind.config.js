/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './presentation/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
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
        border: '#ffffff',

        // Border color for inputs such as <Input />, <Select />, <Textarea />
        inputBorder: '#ffffff',

        // Primary colors for <Button />
        primary: '#FFFFFF',
        primaryForeground: '#212121',

        // Secondary colors for <Button />
        secondary: 'hsl(210, 40%, 96.1%)',
        secondaryForeground: 'hsl(222, 47.4%, 11.2%)',

        // Used for accents such as hover effects on <DropdownMenuItem>, <SelectItem>...etc
        accent: 'hsl(209, 57.40%, 90.80%)',
        accentForeground: 'hsl(222, 47.4%, 11.2%)',

        // Used for destructive actions such as <Button variant="destructive">
        destructive: 'hsl(0, 84.2%, 60.2%)',
        destructiveForeground: 'hsl(210, 40%, 98%)',

        // Border radius for card, input and buttons
        radius: 20,
      },
    },
  },
  plugins: [],
};
