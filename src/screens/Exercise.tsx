import { Box, HStack, Heading, Icon, Image, ScrollView, Text, VStack, useToast } from "native-base";
import { TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from "@react-navigation/native";

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionSvg from '@assets/repetitions.svg'
import { Button } from "@components/Button";
import { useEffect, useState } from "react";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
type RouteParams = {
    id: string
}

export function Exercise() {
    const [isLoading, setIsLoading] = useState(true)
    const [sendingRegister, setSendingRegister] = useState(false)
    const [details, setDetails] = useState<ExerciseDTO>({} as ExerciseDTO)
    const toast = useToast()
    const route = useRoute()
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const { id } = route.params as RouteParams


    function handleGoBack() {
        navigation.goBack();
    }

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${id}`)
            setDetails(response.data)
            console.log(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível carrregar os detalhes do exercício.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }

    }
    async function handleExerciseHistoryRegister() {
        try {
            setSendingRegister(true)
            await api.post(`/history`, { exercise_id: details.id })

            toast.show({
                title: 'Parabéns! Execício concluido.',
                placement: 'top',
                bgColor: 'green.700'
            })
            navigation.navigate('history')
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setSendingRegister(false)
        }
    }

    useEffect(() => {
        fetchExerciseDetails();
    }, [id])

    return (
        <VStack flex={1}>

            <VStack px={8} bg={"gray.600"} pt={12}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={Feather} name={'arrow-left'} color={"green.500"} size={6} />
                </TouchableOpacity>

                <HStack justifyContent={"space-between"} mt={4} mb={8} alignItems={"center"} flexShrink={1}>
                    <Heading color={"gray.100"} fontSize={"lg"} fontFamily={'heading'}>
                        {details.name}
                    </Heading>

                    <HStack>
                        <BodySvg />
                        <Text color={"gray.200"} ml={1} textTransform={"capitalize"}>
                            {details.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>

            {isLoading ? <Loading /> :
                <ScrollView>
                    <VStack p={8}>
                        <Box rounded={"lg"} mb={3} overflow={"hidden"}>
                            <Image
                                w={"full"}
                                h={80}
                                source={{ uri: `${api.defaults.baseURL}/exercise/demo/${details.demo}` }}
                                alt="imagem do exercicios"
                                mb={3}
                                resizeMode="cover"
                                rounded={"lg"}
                                overflow={"hidden"}
                            />
                        </Box>

                        <Box bg={"gray.600"} rounded={"md"} pb={4} px={4}>
                            <HStack alignItems={"center"} justifyContent={"space-around"} mb={6} mt={5}>

                                <HStack>
                                    <SeriesSvg />
                                    <Text color={"gray.200"} ml={2}>
                                        {details.series} séries
                                    </Text>
                                </HStack>
                                <HStack>
                                    <RepetitionSvg />
                                    <Text color={"gray.200"} ml={2}>
                                        {details.repetitions} repetições
                                    </Text>
                                </HStack>

                            </HStack>

                            <Button onPress={handleExerciseHistoryRegister} title="Marcar como realizado" isLoading={sendingRegister} />

                        </Box>

                    </VStack>
                </ScrollView>}

        </VStack>
    )
}