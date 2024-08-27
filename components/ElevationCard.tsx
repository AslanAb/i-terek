import { useState } from "react";
import { Pressable, View } from "react-native";
// @ts-ignore
import { LinearGradient } from "expo-linear-gradient";
import { ScaledSheet } from "react-native-size-matters";

export default function ElevationCard(props: {
  theme: string | undefined;
  h?: any;
  children: React.ReactNode;
  p?: number;
  mh?: any;
  w?: any;
  flex?: number;
  transparency?: number;
  onPress?: () => void;
  elevation?: boolean;
  gradient?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  return (
    <>
      <Pressable
        onPress={props.onPress && props.onPress}
        disabled={!props.onPress}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            top: pressed ? 3 : 0,
            right: pressed ? -3 : 0,
          },
        ]}
      >
        {props.elevation && (
          <View
            style={[
              styles.elevation,
              {
                height: height,
                width: width,
              },
            ]}
          />
        )}
        {props.gradient && (
          <LinearGradient
            colors={
              props.theme === "green"
                ? ["#bdef7c", "#477304"]
                : props.theme === "yellow"
                ? ["#EC9704", "#9C4A1A"]
                : props.theme === "red"
                ? ["#e85d04", "#9d0208"]
                : ["transparent", "transparent"]
            }
            locations={[0.1, 1]}
            start={{ x: 0.4, y: -0.6 }}
            style={[
              styles.gradient,
              {
                height: height,
                width: width,
              },
            ]}
          />
        )}
        <View
          onLayout={(event) => {
            setWidth(event.nativeEvent.layout.width);
            setHeight(event.nativeEvent.layout.height);
          }}
          style={{
            height: props.h ? props.h : undefined,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
            width: props.w ? props.w : undefined,
            padding: props.p ? props.p : 0,
            maxHeight: props.mh ? props.mh : undefined,
            backgroundColor: props.gradient
              ? "transparent"
              : props.theme === "green"
              ? `rgba(71, 115, 4, ${props.transparency ? props.transparency : 0.7})`
              : props.theme === "yellow"
              ? `rgba(156, 74, 26, ${props.transparency ? props.transparency : 0.7})`
              : props.theme === "red"
              ? `rgba(157, 2, 8, ${props.transparency ? props.transparency : 0.7})`
              : "transparent",
            zIndex: 1,
          }}
        >
          {props.children}
        </View>
      </Pressable>
    </>
  );
}

const styles = ScaledSheet.create({
  elevation: {
    overflow: "hidden",
    borderRadius: 30,
    position: "absolute",
    top: 3,
    right: -3,
    backgroundColor: "#1D0F0F",
    zIndex: -1,
  },
  gradient: {
    overflow: "hidden",
    borderRadius: 30,
    position: "absolute",
    zIndex: -1,
  },
});
