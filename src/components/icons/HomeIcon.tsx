import Svg, { Path } from "react-native-svg";

export const HomeIcon = ({ color, size, filled }) => {
  // Function to darken a color by a percentage
  const darkenColor = (color, percent = 30) => {
    // For hex colors like #954CE9
    if (color.startsWith("#")) {
      // Convert hex to RGB
      let r = Number.parseInt(color.slice(1, 3), 16);
      let g = Number.parseInt(color.slice(3, 5), 16);
      let b = Number.parseInt(color.slice(5, 7), 16);

      // Darken each component
      r = Math.max(0, Math.floor((r * (100 - percent)) / 100));
      g = Math.max(0, Math.floor((g * (100 - percent)) / 100));
      b = Math.max(0, Math.floor((b * (100 - percent)) / 100));

      // Convert back to hex
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    }

    return color === "#954CE9" ? "#171717" : color;
  };

  // Get a darker version of the color for the door
  const doorColor = darkenColor(color, 100);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <Path
          d="M3 9.5L12 2L21 9.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.5Z"
          fill={color}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <Path
          d="M3 9.5L12 2L21 9.5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.5Z"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {filled && (
        <Path
          d="M9 21V12H15V21"
          fill={doorColor}
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {!filled && (
        <Path
          d="M9 21V12H15V21"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
};
