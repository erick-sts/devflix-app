import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CustomInput } from "../../UI/CustomInput";
import { loginValidationSchema } from "../../validation/login";
import loginService from "../../service/auth/authService";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";

interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Tela de Login
 * Agora integrada com o AuthContext para gerenciar o estado de autenticação
 */
export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginValidationSchema),
    defaultValues: { email: "", password: "" },
  });

  const router = useRouter();

  // Obtém a função para atualizar o estado de autenticação do contexto
  const { setAuthenticated } = useAuth();

  /**
   * Função executada ao submeter o formulário de login
   */
  const submitForm = async (data: LoginFormData) => {
    try {
      // 1. Chama o serviço de login que salva o token no secure store
      const user = await loginService.login(data.email, data.password);

      if (user) {
        console.log("Login successful:", user);

        // 2. IMPORTANTE: Atualiza o contexto para marcar o usuário como autenticado
        // Isso permite que o AuthContext saiba que o usuário está logado
        // e não o redirecione de rotas protegidas
        setAuthenticated(true);

        // 3. Redireciona para a tela principal (dash)
        router.replace("/dash");
      }
    } catch (error) {
      console.error(error);
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
                placeholder="Password"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity
            onPress={handleSubmit(submitForm)}
            style={{
              width: 200,
              height: 50,
              backgroundColor: "#E50914",
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
              Login
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 15,
              width: 300,
            }}
          >
            <Text style={{ color: "#888" }}>Esqueceu a senha?</Text>
            <Text style={{ color: "#fff" }}>Criar conta</Text>
          </View>
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
    backgroundColor: "#000",
  },
});
