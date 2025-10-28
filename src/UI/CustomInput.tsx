import { View, TextInput, Text, TextInputProps } from "react-native";
import { forwardRef } from "react";

export interface CustomInputProps extends TextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  errorMessage?: string;
}

export const CustomInput = forwardRef<TextInput, CustomInputProps>(
  ({ placeholder, secureTextEntry, errorMessage, ...rest }, ref) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          placeholderTextColor={"#fff"}
          secureTextEntry={secureTextEntry}
          style={{
            width: 300,
            height: 50,
            backgroundColor: "#222",
            borderRadius: 10,
            paddingHorizontal: 15,
            color: "#fff",
          }}
          {...rest}
        />
        {errorMessage && (
          <Text style={{ color: "red", marginTop: 5 }}>{errorMessage}</Text>
        )}
      </View>
    );
  }
);
