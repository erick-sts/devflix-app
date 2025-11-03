import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Touchable,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomInput } from "../../UI/CustomInput";
import { registerValidationSchema } from "../../validation/register";
import registerService from "../../service/user/userService";
import { useRouter } from "expo-router";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerValidationSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const router = useRouter();

  const submitForm = async (data: RegisterFormData) => {
    try {
      const user = await registerService.register(
        data.name,
        data.email,
        data.password
      );

      console.log("User registered:", user);
      router.push("/login");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/logo.png")}
            style={{ width: 150, height: 150, marginBottom: 20 }}
          />

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                placeholder="Nome"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                placeholder="Senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                placeholder="Confirme a Senha"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirmPassword?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(submitForm)}
            style={{
              width: 200,
              height: 50,
              backgroundColor: "#E50914",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 24,
              marginTop: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Cadastrar
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
});
