import Svg, { Path } from "react-native-svg";

export const ChartIcon = ({ color, size, filled }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {filled ? (
        <>
          <Path
            d="M18 20V10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
          />
          <Path
            d="M12 20V4"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
          />
          <Path
            d="M6 20V14"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={color}
          />
          <Path d="M18 10V20" fill={color} />
          <Path d="M12 4V20" fill={color} />
          <Path d="M6 14V20" fill={color} />
        </>
      ) : (
        <>
          <Path
            d="M18 20V10"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M12 20V4"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M6 20V14"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </Svg>
  );
};
