import {
  Play,
  BookOpen,
  Clock,
  Brain,
  BedDouble,
  Moon,
} from "lucide-react-native";

export const getIcon = (iconName) => {
  switch (iconName) {
    case "play":
      return <Play size={18} color="white" />;
    case "book":
      return <BookOpen size={18} color="white" />;
    case "clock":
      return <Clock size={18} color="white" />;
    case "brain":
      return <Brain size={18} color="white" />;
    case "bed":
      return <BedDouble size={18} color="white" />;
    case "moon":
      return <Moon size={18} color="white" />;
    default:
      return <Play size={18} color="white" />;
  }
};
