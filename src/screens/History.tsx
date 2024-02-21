import { useCallback, useState } from "react";
import { Heading, VStack, SectionList, Text, useToast } from "native-base";

import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useFocusEffect } from "@react-navigation/native";
import { HistoryByDayDTO } from "@dtos/HistoryByDayDTO";

export function Historiy() {
    const [isLoading, setIsLoading] = useState(true)

    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

    const toast = useToast()

    async function fetchHistory() {
        try {
            setIsLoading(true)
            const response = await api.get('/history')
            setExercises(response.data)
            console.log(response.data)

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : 'Não foi possível carrregar o histórico.'

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false)
        }
    }
    useFocusEffect(useCallback(() => {
        fetchHistory()
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title='Histórico' />

            <SectionList
                sections={exercises}
                keyExtractor={(item) => item.id}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
                renderSectionHeader={({ section }) => (
                    <Heading color={"gray.200"} fontSize={"md"} mt={10} mb={3} fontFamily={'heading'}>
                        {section.title}
                    </Heading>
                )}
                renderItem={({ item }) => (
                    <HistoryCard exercise={item}/>
                )}
                ListEmptyComponent={() => (
                    <Text color={"gray.100"} textAlign={"center"}>
                        Não há exercícios registrados ainda. {'\n'}
                        Vamos treinar hoje?
                    </Text>
                )}

                px={8}
                showsVerticalScrollIndicator={false}
            />

        </VStack>
    )
}