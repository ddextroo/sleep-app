import { Feather } from "@expo/vector-icons";

export const getIcon = (iconName) => {
  switch (iconName) {
    case "play":
      return <Feather name="play" size={18} color="white" />;
    case "book":
      return <Feather name="book" size={18} color="white" />;
    case "clock":
      return <Feather name="clock" size={18} color="white" />;
    case "brain":
      return <Feather name="activity" size={18} color="white" />;
    case "bed":
      return <Feather name="home" size={18} color="white" />;
    case "moon":
      return <Feather name="moon" size={18} color="white" />;
    default:
      return <Feather name="play" size={18} color="white" />;
  }
};
