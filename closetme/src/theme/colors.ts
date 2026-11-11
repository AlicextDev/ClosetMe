export const colors = {
  primary: {
    default: "#6D3AE0",
    pressed: "#5528B8",
    subtle: "#EDE5FD",
  },
  accent: {
    default: "#C8267F",
    pressed: "#A31C68",
    subtle: "#FCE4F1",
  },
  background: "#FBF8FF",
  surface: "#FFFFFF",
  surfaceAlt: "#F1EAFE",
  line: "#E2D6F7",
  outline: "#857AA3",
  text: {
    primary: "#1B1033",
    secondary: "#4A3F66",
    tertiary: "#6B6285",
    inverse: "#FFFFFF",
  },
  semantic: {
    success: {
      text: "#1F7A4D",
      background: "#E3F5EC",
    },
    warning: {
      text: "#8A5A00",
      background: "#FFF1CC",
    },
    error: {
      text: "#B3261E",
      background: "#FDE7E5",
    },
  },
  gradient: {
    primary: ["#C8267F", "#6D3AE0"] as const,
  },
} as const;
