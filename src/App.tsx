import { Flex, Box, Heading } from "@chakra-ui/react";

import { ColorModeButton } from "@/components/ui/color-mode";

function App() {
  return (
    <>
      <Box position="sticky" top="0" zIndex="10" boxShadow="md" p={4}>
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Dah Qada?
          </Heading>
          <Flex>
            <ColorModeButton />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

export default App;
