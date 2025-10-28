import * as yup from 'yup';

export const registerValidationSchema = yup.object().shape({
    name: yup
        .string()
        .min(2, "Nome precisa ter pelo menos 2 caracteres")
        .max(100, "Nome deve ter no máximo 100 caracteres")
        .required("Nome é obrigatório"),
    email: yup
        .string()
        .email("Formato de email inválido")
        .required("Email é obrigatório"),
    password: yup
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .required("Senha é obrigatória"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "As senhas devem coincidir")
        .required("A confirmação da senha é obrigatória"),
});
