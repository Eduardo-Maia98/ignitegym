import { useState } from "react";

import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";

import { Alert, TouchableOpacity } from "react-native";
import { Center, Heading, ScrollView, Skeleton, Text, VStack, useToast } from "native-base";

import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { yupResolver } from '@hookform/resolvers/yup'

import * as yup from "yup"
import * as FileSystem from "expo-file-system";
import * as ImagePicker from 'expo-image-picker'

import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";

const PHOTO_SIZE = 33


type FormDataProps = yup.InferType<typeof profileSchema>

const profileSchema = yup.object({
    name: yup.string().required('Informe o nome.'),
    password: yup
        .string()
        .min(6, 'A senha deve ter pelo menos 6 digitos.')
        .nullable()
        .transform((value) => !!value ? value : null),
    confirm_password: yup
        .string()
        .nullable()
        .transform((value) => !!value ? value : null)
        .oneOf([yup.ref('password')], 'As senhas não batem.')
        .when('password', {
            is: (Field: any) => Field,
            then: (schema) => schema.nullable().required('Informe a confirmação da senha.').transform((value) => !!value ? value : null)
        }),

})
    .shape({
        email: yup.string().nonNullable(),
        old_password: yup.string().nullable(),
    });

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false)
    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [userPhoto, setUserPhoto] = useState('https://github.com/eduardo-maia98.png')

    const toast = useToast()
    const { user, updateUserProfile } = useAuth()
    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: user.name,
            email: user.email,
        },
        resolver: yupResolver(profileSchema)
    })

    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true)
        try {

            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            })

            if (photoSelected.canceled) {
                return
            }
            if (photoSelected.assets[0].uri) {
                console.log('qui')
                const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri)


                if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 3) {
                    return toast.show({
                        title: 'Essa imagem é muito pesada. Escolha uma de até 3MB.',
                        placement: 'top',
                        bgColor: 'red.500'
                    })

                }

                setUserPhoto(photoSelected.assets[0].uri)
            }

        } catch (error) {

        } finally {
            setPhotoIsLoading(false)
        }
    }

    async function handleProfileUpdate(data: FormDataProps) {
        try {
            setIsUpdating(true)

            await api.put('/users', data)

            const userUpdated = user
            userUpdated.name = data.name

            await updateUserProfile(userUpdated)

            toast.show({
                title: 'Perfil atualizado com sucesso.',
                placement: 'top',
                bgColor: 'green.500'
            })
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente Novamente mais tarde.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title='Perfil' />

            <ScrollView>
                <Center mt={6} px={10}>
                    {
                        photoIsLoading ?
                            <Skeleton
                                w={PHOTO_SIZE}
                                h={PHOTO_SIZE}
                                rounded="full"
                                startColor="gray.500"
                                endColor="gray.400"
                            />

                            :
                            <UserPhoto source={{ uri: userPhoto }}
                                alt="Foto do usuario"
                                size={PHOTO_SIZE}
                            />
                    }

                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text color={"green.500"} fontWeight={"bold"} fontSize={"md"} mt={2} mb={8}>
                            Alterar foto
                        </Text>
                    </TouchableOpacity>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { value, onChange } }) => (

                            <Input
                                bg='gray.600'
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value } }) => (

                            <Input
                                bg='gray.600'
                                placeholder="Email"
                                value={value}
                                isDisabled
                            />
                        )}
                    />

                </Center>
                

                <VStack px={10} mt={12} mb={9}>
                    <Heading color={"gray.200"} fontSize={"md"} mb={2} fontFamily={'heading'}>
                        Alterar senha
                    </Heading>
                    <Controller
                        control={control}
                        name="old_password"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg='gray.600'
                                placeholder="Senha antiga"
                                value={value as string}
                                onChangeText={onChange}
                                secureTextEntry
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg='gray.600'
                                placeholder="Nova senha"
                                value={value as string}
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                                secureTextEntry
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="confirm_password"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                bg='gray.600'
                                placeholder="Confime a nova senha"
                                value={value as string}
                                onChangeText={onChange}
                                errorMessage={errors.confirm_password?.message}
                                secureTextEntry
                            />
                        )}
                    />


                    <Button title="Atualizar" mt={4} onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating} />
                </VStack>

            </ScrollView>

        </VStack>
    )
}