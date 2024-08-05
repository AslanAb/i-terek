import { View, Text, ScrollView, Dimensions, TextInput, Pressable } from "react-native";
import { useEffect, useRef, useState } from "react";
import { ScaledSheet, scale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import ElevationCard from "@/components/ElevationCard";
import { useMMKVObject, useMMKVString } from "react-native-mmkv";
import InputCard from "@/components/InputCard";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Input2Card from "@/components/Input2Card";
import { AntDesign } from "@expo/vector-icons";
import { INormals, IWeightOfVariables } from "@/types";
import { defaultNormals, defaultVariables } from "@/constants/settings";
const { width, height } = Dimensions.get("window");

export default function Settings() {
  const [theme, setTheme] = useMMKVString("theme");
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [variables, setVariables] = useState<IWeightOfVariables>(weightOfVariables || ({} as IWeightOfVariables));
  const [normals, setNormals] = useMMKVObject<INormals>("normals");
  const [userNormals, setUserNormals] = useState<INormals>(normals || ({} as INormals));
  const scrollViewRef = useRef<ScrollView>(null);
  const [pagePosition, setPagePosition] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (weightOfVariables) setVariables(weightOfVariables);
  }, [weightOfVariables]);

  useEffect(() => {
    if (normals) setUserNormals(normals);
  }, [normals]);

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
          <View style={styles.box}>
            <InputCard
              theme={theme}
              name="pressure"
              h={90}
              value={variables?.pressure}
              setVariables={setVariables}
              variableKey="pressure"
            />
            <InputCard
              theme={theme}
              name="pressure's changing"
              h={90}
              value={variables?.pressureChangingIn3Hours}
              setVariables={setVariables}
              variableKey="pressureChangingIn3Hours"
            />
            <InputCard
              theme={theme}
              name="solar activity"
              h={90}
              value={variables?.solar_activity}
              setVariables={setVariables}
              variableKey="solar_activity"
            />
            <InputCard
              theme={theme}
              name="magnetic field"
              h={90}
              value={variables?.kp_index}
              setVariables={setVariables}
              variableKey="kp_index"
            />
            <InputCard
              theme={theme}
              name="temperature"
              h={90}
              value={variables?.temp}
              setVariables={setVariables}
              variableKey="temp"
            />
            <InputCard
              theme={theme}
              name="air pollution"
              h={90}
              value={variables?.pm2_5}
              setVariables={setVariables}
              variableKey="pm2_5"
            />
            <InputCard
              theme={theme}
              name="wind speed"
              h={90}
              value={variables?.wind}
              setVariables={setVariables}
              variableKey="wind"
            />
            <View style={{ alignItems: "center", marginBottom: 30, width: "100%", gap: 15 }}>
              <ElevationCard
                theme={theme}
                w={"100%"}
                gradient
                elevation
                onPress={() => setWeightOfVariables(variables)}
              >
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
              <ElevationCard
                theme={theme}
                w={"100%"}
                gradient
                elevation
                onPress={() => setWeightOfVariables(defaultVariables)}
              >
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
                  Вернуть значения по умолчанию
                </Text>
              </ElevationCard>
            </View>
          </View>
          <View style={styles.box}>
            <Input2Card
              theme={theme}
              name="pressure"
              h={90}
              secondInput
              value={userNormals.pressure}
              setValue={setUserNormals}
              keyName="pressure"
            />
            <Input2Card
              theme={theme}
              name="pressure's changing"
              h={90}
              secondInput
              value={userNormals.pressureChangingIn3Hours}
              setValue={setUserNormals}
              keyName="pressureChangingIn3Hours"
            />
            <Input2Card
              theme={theme}
              name="solar activity"
              h={90}
              secondInput
              value={userNormals.solar_activity}
              setValue={setUserNormals}
              keyName="solar_activity"
            />
            <Input2Card
              theme={theme}
              name="magnetic field"
              h={90}
              secondInput
              value={userNormals.kp_index}
              setValue={setUserNormals}
              keyName="kp_index"
            />
            <Input2Card
              theme={theme}
              name="temperature"
              h={90}
              secondInput
              value={userNormals.temp}
              setValue={setUserNormals}
              keyName="temp"
            />
            <Input2Card
              theme={theme}
              name="air pollution"
              h={90}
              secondInput
              value={userNormals.pm2_5}
              setValue={setUserNormals}
              keyName="pm2_5"
            />
            <Input2Card
              theme={theme}
              name="wind speed"
              h={90}
              secondInput
              value={userNormals.wind}
              setValue={setUserNormals}
              keyName="wind"
            />
            <View style={{ alignItems: "center", marginBottom: 30, width: "100%", gap: 15 }}>
              <ElevationCard theme={theme} w={"100%"} onPress={() => setNormals(userNormals)} gradient elevation>
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
              <ElevationCard theme={theme} w={"100%"} onPress={() => setNormals(defaultNormals)} gradient elevation>
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
                  Вернуть значения по умолчанию
                </Text>
              </ElevationCard>
            </View>
          </View>
          <View style={styles.box}>
            {/* <Input2Card theme={theme} name="pressure" h={90} secondInput />
            <Input2Card theme={theme} name="pressure's changing" h={90} />
            <Input2Card theme={theme} name="solar activity" h={90} />
            <Input2Card theme={theme} name="magnetic field" h={90} />
            <Input2Card theme={theme} name="temperature" h={90} secondInput />
            <Input2Card theme={theme} name="air pollution" h={90} />
            <Input2Card theme={theme} name="wind speed" h={90} /> */}
            <Pressable style={{ alignItems: "center", marginBottom: 30, width: "100%" }}>
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
            </Pressable>
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
