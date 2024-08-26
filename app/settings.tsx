import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { useRef, useState } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import ElevationCard from "@/components/ElevationCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import VariablesSettings from "@/components/VariablesSettings";
import NormalsSettings from "@/components/NormalsSettings";
import RedSettings from "@/components/ExtremesSettings";
import { useMMKVString } from "react-native-mmkv";
const { width, height } = Dimensions.get("window");

export default function Settings() {
  const [theme, setTheme] = useMMKVString("theme");
  const scrollViewRef = useRef<ScrollView>(null);
  const [pagePosition, setPagePosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.x;
    setPagePosition(position);
    const currentPage = Math.round(position / width);
    setScrollPosition(currentPage);
  };

  const handleScrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: pagePosition - width, animated: true });
  };

  const handleScrollRight = () => {
    scrollViewRef.current?.scrollTo({ x: pagePosition + width, animated: true });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex: -10,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        }}
      />
      <View style={styles.indicatorContainer}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ justifyContent: "center" }}>
            <ElevationCard theme={theme} transparency={1}>
              <Text style={[styles.font22, { padding: 10, alignItems: "center", justifyContent: "center" }]}>
                {scrollPosition === i ? (i === 0 ? "Вес показателей" : i === 1 ? "Норм. значения" : "Экстремумы") : ""}
                {scrollPosition !== i ? (
                  i < scrollPosition ? (
                    <Pressable onPress={handleScrollLeft} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <AntDesign name="left" size={scale(15)} color="white" />
                    </Pressable>
                  ) : (
                    <Pressable onPress={handleScrollRight} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <AntDesign name="right" size={scale(15)} color="white" />
                    </Pressable>
                  )
                ) : null}
              </Text>
            </ElevationCard>
          </View>
        ))}
      </View>
      <KeyboardAwareScrollView>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={{ minHeight: height }}
        >
          <VariablesSettings />
          <NormalsSettings />
          <RedSettings />
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = ScaledSheet.create({
  font14: {
    color: "white",
    fontFamily: "Podkova-Regular",
    fontSize: scale(20),
  },
  font22: {
    color: "white",
    fontFamily: "Podkova-Bold",
    fontSize: scale(24),
  },
  box: {
    width: width,
    alignItems: "center",
    paddingHorizontal: 30,
    gap: 15,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 50,
    marginBottom: 20,
    gap: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#C9DBFA",
    margin: 5,
  },
  activeIndicator: {
    backgroundColor: "#704DFF",
  },
});
