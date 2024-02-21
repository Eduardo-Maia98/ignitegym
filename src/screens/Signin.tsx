import { Center, Heading, Image, KeyboardAvoidingView, ScrollView, Text, VStack, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { AuthNavigatorRoutesProps } from "@routes/auth.routes";

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from "@assets/background.png";


import { useForm, Controller } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Platform } from "react-native";
import { api } from "@services/api";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormDataProps = {
    email: string;
    password: string;
}
const signUpSchema = yup.object({
    email: yup.string().required('Informe o email.').email('Email inválido.'),
    password: yup.string().required('Informe a senha.').min(6, 'A senha deve conter pelo menos 6 dígitos.'),
})



export function SignIn() {
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth()
    const toast = useToast()
    const navigation = useNavigation<AuthNavigatorRoutesProps>();

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });



    async function handleSignIn({ email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            await signIn(email, password)



        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarte!'

            setIsLoading(false)
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }

    }
    function handleNewAccount() {
        navigation.navigate('signUp');
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
                            Acesse sua conta
                        </Heading>

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
                            render={({ field: { onChange, value } }) => (
                                <Input
                                    placeholder="Senha"
                                    secureTextEntry
                                    errorMessage={errors.password?.message}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        <Button title="Acessar" onPress={handleSubmit(handleSignIn)} isLoading={isLoading} />

                    </Center>

                    <Center mt={24}>
                        <Text color={"gray.100"} fontSize={"sm"} mb={3} fontFamily={'body'}>
                            Ainda não tem acesso?
                        </Text>

                        <Button
                            title="Criar conta"
                            variant={"outline"}
                            onPress={handleNewAccount}
                        />
                    </Center>

                </VStack>
            </ScrollView>
        </KeyboardAvoidingView>


    );

}