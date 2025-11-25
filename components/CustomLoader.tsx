import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const CustomLoader = () => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Бесконечное вращение
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000, // Ускорил до 1 секунды для более динамичного вращения
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const SIZE = scale(60);
  const STROKE_WIDTH = 4;
  const RADIUS = (SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const ONE_THIRD = CIRCUMFERENCE / 3;

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          width: SIZE,
          height: SIZE,
          transform: [{ rotate: spin }],
        }}
      >
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Зеленый сегмент (0 - 120 градусов) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#477304"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${ONE_THIRD} ${CIRCUMFERENCE - ONE_THIRD}`}
            strokeDashoffset={0}
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
          
          {/* Желтый сегмент (120 - 240 градусов) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#FFD700"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${ONE_THIRD} ${CIRCUMFERENCE - ONE_THIRD}`}
            strokeDashoffset={0}
            rotation={30} // -90 + 120
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />

          {/* Красный сегмент (240 - 360 градусов) */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="#9d0208"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${ONE_THIRD} ${CIRCUMFERENCE - ONE_THIRD}`}
            strokeDashoffset={0}
            rotation={150} // -90 + 240
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>
      </Animated.View>
      
      <View style={[styles.centerDot, { backgroundColor: '#477304' }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    inset: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  centerDot: {
    position: 'absolute',
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    opacity: 0.8,
  }
});

export default CustomLoader;
