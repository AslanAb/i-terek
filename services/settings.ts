import { defaultNormals, defaultVariables } from "@/constants/settings";
import { INormals, IWeightOfVariables } from "@/types";
import { useMMKVObject } from "react-native-mmkv";

const setDefaultSettings = () => {
  const [weightOfVariables, setWeightOfVariables] = useMMKVObject<IWeightOfVariables>("weightOfVariables");
  const [normals, setNormals] = useMMKVObject<INormals>("normals");

  if (!weightOfVariables) {
    setWeightOfVariables(defaultVariables);
  }

  if (!normals) {
    setNormals(defaultNormals);
  }
};

export { setDefaultSettings };
