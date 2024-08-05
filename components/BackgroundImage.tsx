import { Image } from "expo-image";
import { Dimensions, StatusBar } from "react-native";
import mainBg from "@/assets/images/main_bg.jpg";
import greenTree from "@/assets/images/g_1.png";
import yellowTree from "@/assets/images/y_1.png";
import redTree from "@/assets/images/r_2.png";

const { width, height } = Dimensions.get("window");
const statusBarHeight = StatusBar.currentHeight || 0;

export default function BackgroundImage(props: { theme: string | undefined }) {
  return (
    <>
      <Image
        source={mainBg}
        contentFit="cover"
        cachePolicy="memory-disk"
        style={{
          width: width,
          height: (height + statusBarHeight)*1.1,
          position: "absolute",
          top: -90,
          right: 0,
          left: 0,
          zIndex: -30,
        }}
      />
      <Image
        source={props.theme === "green" ? greenTree : props.theme === "yellow" ? yellowTree : props.theme === "red" ? redTree : undefined}
        contentFit="contain"
        cachePolicy="memory-disk"
        style={{
          width: "50%",
          aspectRatio: 1,
          position: "absolute",
          bottom: ((height + statusBarHeight) / 4) + 20,
          right: "25%",
          zIndex: -20,
        }}
      />
    </>
  );
}
