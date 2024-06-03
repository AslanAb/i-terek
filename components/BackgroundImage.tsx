import { Image } from "expo-image";
import green_tree from "@/assets/images/green_tree.png";
import yellow_tree from "@/assets/images/yellow_tree.png";
import red_tree from "@/assets/images/red_tree.png";
import { Dimensions, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
const statusBarHeight = StatusBar.currentHeight || 0;

export default function BackgroundImage(props: { theme: string }) {
  return (
    <Image
      source={props.theme === "green" ? green_tree : props.theme === "yellow" ? yellow_tree : red_tree}
      contentFit="cover"
      contentPosition={
        props.theme === "green" ? "center" : props.theme === "yellow" ? { right: "45%" } : { right: "55%" }
      }
      cachePolicy="memory-disk"
      style={{
        width: width,
        height: height + statusBarHeight,
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        zIndex: -30,
      }}
    />
  );
}
