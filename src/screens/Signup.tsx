import { Center, Heading, Image, KeyboardAvoidingView, ScrollView, Text, VStack, useToast } from "native-base";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from "@assets/background.png";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from "@services/api";
import axios from "axios";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}
const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    email: yup.string().required('Informe o email.').email('Email inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve conter pelo menos 6 dígitos.'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'As senhas não batem.')

})



export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const { signIn } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });
    const toast = useToast()

    const navigation = useNavigation();

    function handleGoBack() {
        navigation.goBack()
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {

        try {
            setIsLoading(true)
            await api.post('/users', { name, email, password })
            signIn(email, password)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarte.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'

            })
        }

    }


    return (
        <KeyboardAvoidingView flex={1}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}


            >
                <VStack flex={1} px={10} pb={16}>
                    <Image
                        source={BackgroundImg}
                        defaultSource={BackgroundImg}
                        alt="Pessoas treinando"
                        resizeMode="contain"
                        position={"absolute"}
                    />
                    <Center my={24}>
                        <LogoSvg />

                        <Text color={"gray.100"} fontSize={"sm"}>
                            Treine sua mente e seu corpo
                        </Text>

                    </Center>

                    <Center>

                        <Heading color={"gray.100"} fontSize={"xl"} mb={6} fontFamily={"heading"} >
                            Crie sua conta
                        </Heading>

                        <Controller
                            control={control}
                            name={'name'}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Nome"
                                    errorMessage={errors.name?.message}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name={'email'}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    errorMessage={errors.email?.message}
                                    onChangeText={onChange}
                                    value={value}


                                />
                            )}
                        />


                        <Controller
                            control={control}
                            name={'password'}
                            render={({ field: { onChange, value = '' } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    errorMessage={errors.password?.message}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name={'password_confirm'}
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Confirme a senha"
                                    secureTextEntry
                                    errorMessage={errors.password_confirm?.message}
                                    onChangeText={onChange}
                                    onSubmitEditing={handleSubmit(handleSignUp)}
                                    returnKeyType="send"
                                    value={value}
                                />
                            )}
                        />


                        <Button title="Criar e acessar" onPress={handleSubmit(handleSignUp)} isLoading={isLoading} />

                    </Center>




                    <Button
                        title="Voltar para o login"
                        variant={"outline"}
                        mt={12}
                        onPress={handleGoBack}
                    />


                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>


    );

}