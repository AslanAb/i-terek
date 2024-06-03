import { View, Text, ScrollView, Dimensions, TextInput } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import ElevationCard from "@/components/ElevationCard";
import { useMMKVString } from "react-native-mmkv";
import InputCard from "@/components/InputCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input2Card from "@/components/Input2Card";

const { width, height } = Dimensions.get("window");

export default function Settings() {
  const [theme, setTheme] = useMMKVString("theme");

  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (event: any) => {
    const position = event.nativeEvent.contentOffset.x;
    const currentPage = Math.round(position / width);
    setScrollPosition(currentPage);
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
              <Text
                style={[
                  styles.font22,
                  { padding: scrollPosition === i ? 10 : 5, lineHeight: scrollPosition === i ? undefined : 0 },
                ]}
              >
                {scrollPosition === i
                  ? i === 0
                    ? "Вес показателей"
                    : i === 1
                    ? "Норм. значения"
                    : "Экстремумы"
                  : "   "}
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
          <View style={styles.box}>
            <InputCard theme={theme} name="pressure" h={90}/>
            <InputCard theme={theme} name="pressure's changing" h={90} />
            <InputCard theme={theme} name="solar activity" h={90} />
            <InputCard theme={theme} name="magnetic field" h={90} />
            <InputCard theme={theme} name="temperature" h={90} />
            <InputCard theme={theme} name="air pollution" h={90} />
            <InputCard theme={theme} name="wind speed" h={90} />
            <View style={{ alignItems: "center", marginBottom: 30, width: "100%" }}>
              <ElevationCard theme={theme} w={"100%"} onPress={() => {}} gradient elevation>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Podkova-Regular",
                    fontSize: scale(22),
                    textAlign: "center",
                    padding: 10,
                    width: width - 60,
                  }}
                >
                  Сохранить
                </Text>
              </ElevationCard>
            </View>
          </View>
          <View style={styles.box}>
            <Input2Card theme={theme} name="pressure" h={90} secondInput />
            <Input2Card theme={theme} name="pressure's changing" h={90} secondInput />
            <Input2Card theme={theme} name="solar activity" h={90} secondInput />
            <Input2Card theme={theme} name="magnetic field" h={90} secondInput />
            <Input2Card theme={theme} name="temperature" h={90} secondInput />
            <Input2Card theme={theme} name="air pollution" h={90} secondInput />
            <Input2Card theme={theme} name="wind speed" h={90} secondInput />
            <View style={{ alignItems: "center", marginBottom: 30, width: "100%" }}>
              <ElevationCard theme={theme} w={"100%"} onPress={() => {}} gradient elevation>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Podkova-Regular",
                    fontSize: scale(22),
                    textAlign: "center",
                    padding: 10,
                    width: width - 60,
                  }}
                >
                  Сохранить
                </Text>
              </ElevationCard>
            </View>
          </View>
          <View style={styles.box}>
            <Input2Card theme={theme} name="pressure" h={90} secondInput />
            <Input2Card theme={theme} name="pressure's changing" h={90} />
            <Input2Card theme={theme} name="solar activity" h={90} />
            <Input2Card theme={theme} name="magnetic field" h={90} />
            <Input2Card theme={theme} name="temperature" h={90} secondInput />
            <Input2Card theme={theme} name="air pollution" h={90} />
            <Input2Card theme={theme} name="wind speed" h={90} />
            <View style={{ alignItems: "center", marginBottom: 30, width: "100%" }}>
              <ElevationCard theme={theme} w={"100%"} onPress={() => {}} gradient elevation>
                <Text
                  style={{
                    color: "white",
                    fontFamily: "Podkova-Regular",
                    fontSize: scale(22),
                    textAlign: "center",
                    padding: 10,
                    width: width - 60,
                  }}
                >
                  Сохранить
                </Text>
              </ElevationCard>
            </View>
          </View>
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
