import { Shadow } from "react-native-shadow-2";

export default function ShadowCard(props: {
  theme: string | undefined;
  h?: any;
  children: React.ReactNode;
  p?: number;
  mh?: any;
  w?: any;
  flex?: number;
}) {
  return (
    <Shadow
      distance={7}
      startColor={
        props.theme === "green"
          ? "rgba(0, 0, 0, 0.3)"
          : props.theme === "yellow"
          ? "rgba(0, 0, 0, 0.3)"
          : "rgba(0, 0, 0, 0.3)"
      }
      endColor={
        props.theme === "green"
          ? "rgba(0, 0, 0, 0)"
          : props.theme === "yellow"
          ? "rgba(0, 0, 0, 0)"
          : "rgba(0, 0, 0, 0)"
      }
      style={{
        height: props.h ? props.h : undefined,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 30,
        width: props.w ? props.w : undefined,
        padding: props.p ? props.p : 0,
        maxHeight: props.mh ? props.mh : undefined,
        backgroundColor:
          props.theme === "green"
            ? "rgba(72, 96, 34, 0.7)"
            : props.theme === "yellow"
            ? "rgba(253, 204, 57, 0.7)"
            : "rgba(188, 0, 0, 0.5)",
      }}
    >
      {props.children}
    </Shadow>
  );
}
