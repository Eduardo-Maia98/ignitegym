
import { HistoryDTO } from "@dtos/HistoryDTO";
import { HStack, Heading, Text, VStack } from "native-base";

type Props = {
    exercise:HistoryDTO;
}
export function HistoryCard({ exercise}: Props) {
    return (
        <HStack w={"full"} px={5} py={4} mb={3} bg={"gray.600"} rounded={"md"} alignItems={"center"} justifyContent={"space-between"}>
            <VStack mr={5} flex={1}>
                <Heading color={"white"} fontSize={"md"} textTransform={"capitalize"} fontFamily={'heading'}>
                    {exercise.group}
                </Heading>
                <Text color={"gray.100"} fontSize={"lg"} numberOfLines={1}>
                    {exercise.name}
                </Text>
            </VStack>

            <Text color={"gray.300"} fontSize={"md"}>
               {exercise.hour}
            </Text>
        </HStack>
    )
}