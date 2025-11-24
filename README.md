## iTerek — запуск и сборка

### Требования

- Node.js 18+  
- npm 9+  
- Expo CLI (через `npx`, ставить глобально не обязательно)  
- Android Studio (для эмулятора и локальных Android‑сборок)  
- Для iOS — Xcode (только на macOS)

---

### Установка зависимостей

В корне проекта:

```bash
npm install
```

---

### Запуск на физическом телефоне (Expo Go)

Самый быстрый способ просто посмотреть приложение, **без dev‑клиента**:

1. Установи приложение **Expo Go** из App Store / Google Play.
2. В корне проекта запусти:
   ```bash
   npx expo start
   ```
3. Отсканируй QR‑код камерой (iOS) или через Expo Go (Android).

> Ограничение: некоторые нативные библиотеки (например, `react-native-mmkv`) в Expo Go работать не будут. Для полноценного теста используй dev‑клиент (ниже).

---

### Запуск на Android‑эмуляторе (dev‑client)

1. Установи **Android Studio** и создай AVD:
   - Android Studio → **Device Manager** → **Create device** → выбери Pixel → **Finish**.
   - Запусти эмулятор (кнопка **Play**).
2. Убедись, что настроены переменные окружения:
   - `JAVA_HOME` → путь к JDK (например, `C:\Program Files\Android\Android Studio\jbr`).
   - `ANDROID_HOME`/`sdk.dir` уже прописан в `android/local.properties`.
3. В корне проекта (при запущенном эмуляторе) собери dev‑клиент:
   ```bash
   npx expo run:android
   ```
   Это соберёт и установит приложение `iTerek` на эмулятор.
4. Запусти Metro в режиме dev‑клиента:
   ```bash
   npx expo start --dev-client
   ```
5. В терминале нажми **`a`**, либо вручную открой приложение `iTerek` на эмуляторе.

> Если видишь ошибку `Failed to create a new MMKV instance: React Native is not running on-device`, убедись, что НЕ включён remote debugger (Chrome). Наш wrapper `@/mmkv` уже подстраховывает такие случаи, но лучше дебажить on‑device.

---

### Запуск на физическом Android‑устройстве (dev‑client)

1. Включи **USB‑отладку** на телефоне и подключи его к компьютеру.
2. Убедись, что устройство видно:
   ```bash
   adb devices
   ```
3. Собери и установи dev‑клиент:
   ```bash
   npx expo run:android
   ```
4. Запусти Metro:
   ```bash
   npx expo start --dev-client
   ```
5. В терминале выбери подключённое устройство из списка, либо просто открой приложение `iTerek` на телефоне.

---

### Запуск на iOS (симулятор / устройство)

Только на macOS:

1. Установи Xcode и iOS Simulator.
2. В корне проекта:
   ```bash
   npx expo run:ios
   ```
   Это соберёт dev‑клиент и запустит его в симуляторе.
3. Затем:
   ```bash
   npx expo start --dev-client
   ```
   Открой приложение `iTerek` в симуляторе или на подключённом устройстве.

---

### Dev‑сборки vs продакшн‑сборки

#### Dev‑сборка (development build)

Используется для разработки с нативными модулями.

- Android:
  ```bash
  npx expo run:android      # собирает и ставит dev‑клиент на устройство/эмулятор
  npx expo start --dev-client
  ```
- iOS:
  ```bash
  npx expo run:ios
  npx expo start --dev-client
  ```

#### Продакшн‑сборка через EAS (рекомендуется)

1. Установи EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Войди в Expo:
   ```bash
   eas login
   ```
3. Android (AAB/APK в облаке):
   ```bash
   eas build --platform android
   ```
4. iOS (IPA в облаке):
   ```bash
   eas build --platform ios
   ```

Конфиг лежит в `eas.json`. Собранные артефакты можно скачать из Expo Dashboard или прямо из CLI.

#### Локальные продакшн‑сборки (без облака)

После того как проект уже имеет `android/` и `ios/`:

- Android (release APK/AAB):
  ```bash
  cd android
  ./gradlew assembleRelease      # APK
  # или
  ./gradlew bundleRelease        # AAB
  ```
  Артефакты будут в `android/app/build/outputs/`.

- iOS:
  - Открой `ios/*.xcworkspace` в Xcode.
  - Выбери **Any iOS Device (arm64)**.
  - Product → **Archive**, затем экспортируй через Organizer.

---

### Полезные команды

- Проверка зависимостей Expo:
  ```bash
  npx expo-doctor
  ```
- Синхронизация версий expo‑пакетов:
  ```bash
  npx expo install --check
  ```
- Пересборка dev‑клиента после изменения нативных модулей:
  ```bash
  npx expo run:android
  # или
  npx expo run:ios
  ```


