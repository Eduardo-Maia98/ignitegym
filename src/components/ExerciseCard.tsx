import { HStack, Heading, Icon, Image, Text, VStack } from "native-base";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";

type Props = TouchableOpacityProps & {
    exercise: ExerciseDTO
}

export function ExerciseCard({ exercise, ...rest }: Props) {
    
    return (
        <TouchableOpacity {...rest} >
            <HStack bg={"gray.500"} alignItems={"center"} p={2} pr={4} rounded={"md"} mb={3}>

                <Image
                    source={{ uri: `${api.defaults.baseURL}/exercise/thumb/${exercise.thumb}` }}
                    alt='Exercicio remada unilateral'
                    w={16}
                    h={16}
                    mr={4}
                    rounded={"md"}
                    resizeMode="cover"
                />

                <VStack flex={1} >
                    <Heading fontSize={"lg"} color={"white"} fontFamily={'heading'}>
                        {exercise.name}
                    </Heading>

                    <Text fontSize={"sm"} color={"gray.200"} mt={1} numberOfLines={2}>
                        {exercise.series} séries x {exercise.repetitions} repetições
                    </Text>
                </VStack>
                <Icon as={Entypo} name="chevron-thin-right" color={"gray.300"} />
            </HStack>



        </TouchableOpacity>
    );
}