import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  Divider,
  Switch,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

// Import components
import GiftForm from './components/GiftForm';
import GiftList from './components/GiftList';
import GiftDetails from './components/GiftDetails';
import StatsPage from './components/StatsPage';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [refreshList, setRefreshList] = useState(0);
  const [selectedGiftId, setSelectedGiftId] = useState(null);
  const [isArabic, setIsArabic] = useState(true); // Default to Arabic
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleViewGift = (giftId) => {
    setSelectedGiftId(giftId);
    onOpen();
  };

  const handleRefreshList = () => {
    setRefreshList(prev => prev + 1);
  };

  const handleFormSubmit = () => {
    handleRefreshList();
    setActiveTab(1); // Switch to list tab after creating
  };

  const handleCloseModal = () => {
    onClose();
    handleRefreshList(); // Refresh list when modal closes (in case status was updated)
  };

  const text = {
    ar: {
      title: 'نظام إدارة الهدايا',
      subtitle: 'نظم وتتبع طلبات الهدايا بسهولة',
      dashboard: 'لوحة التحكم',
      giftRequests: 'طلبات الهدايا',
      newRequest: 'طلب جديد',
      allGiftRequests: 'جميع طلبات الهدايا',
      createNewRequest: 'إنشاء طلب هدية جديد',
      giftRequestDetails: 'تفاصيل طلب الهدية',
      language: 'اللغة'
    },
    en: {
      title: 'Gift Management System',
      subtitle: 'Organize and track your gift requests effortlessly',
      dashboard: 'Dashboard',
      giftRequests: 'Gift Requests',
      newRequest: 'New Request',
      allGiftRequests: 'All Gift Requests',
      createNewRequest: 'Create New Gift Request',
      giftRequestDetails: 'Gift Request Details',
      language: 'Language'
    }
  };

  const currentText = isArabic ? text.ar : text.en;

  return (
    <Box dir={isArabic ? 'rtl' : 'ltr'}>
      <Container maxW="6xl" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={4}>
            <HStack justify="space-between" mb={4}>
              <Box />
              <VStack>
                <Heading size="xl" color="teal.600" mb={2}>
                  {isArabic ? '🎁' : '🎁'} {currentText.title}
                </Heading>
                <Text color="gray.600" fontSize="lg">
                  {currentText.subtitle}
                </Text>
              </VStack>
              <FormControl display="flex" alignItems="center" maxW="200px">
                <FormLabel htmlFor="language-switch" mb="0" fontSize="sm">
                  {currentText.language}
                </FormLabel>
                <Switch
                  id="language-switch"
                  isChecked={isArabic}
                  onChange={(e) => setIsArabic(e.target.checked)}
                  colorScheme="teal"
                />
                <Text fontSize="sm" ml={2}>
                  {isArabic ? 'ع' : 'En'}
                </Text>
              </FormControl>
            </HStack>
            <Divider />
          </Box>

          {/* Main Content */}
          <Tabs 
            index={activeTab} 
            onChange={setActiveTab} 
            variant="enclosed" 
            colorScheme="teal"
            isLazy
          >
            <TabList>
              <Tab>{isArabic ? '📊' : '📊'} {currentText.dashboard}</Tab>
              <Tab>{isArabic ? '📋' : '📋'} {currentText.giftRequests}</Tab>
              <Tab>{isArabic ? '➕' : '➕'} {currentText.newRequest}</Tab>
            </TabList>

            <TabPanels>
              {/* Dashboard Tab */}
              <TabPanel>
                <StatsPage 
                  refreshTrigger={refreshList} 
                  isArabic={isArabic}
                />
              </TabPanel>

              {/* Gift List Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Heading size="md">{currentText.allGiftRequests}</Heading>
                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="teal"
                      onClick={() => setActiveTab(2)}
                      size="sm"
                    >
                      {currentText.newRequest}
                    </Button>
                  </HStack>
                  <GiftList 
                    onViewGift={handleViewGift} 
                    refreshTrigger={refreshList}
                    onRefresh={handleRefreshList}
                    isArabic={isArabic}
                  />
                </VStack>
              </TabPanel>

              {/* New Request Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Heading size="md">{currentText.createNewRequest}</Heading>
                  <Box 
                    bg="white" 
                    p={6} 
                    rounded="lg" 
                    shadow="md" 
                    border="1px" 
                    borderColor="gray.200"
                  >
                    <GiftForm 
                      onSubmit={handleFormSubmit}
                      isArabic={isArabic}
                    />
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        {/* Gift Details Modal */}
        <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader color="teal.600">
              {currentText.giftRequestDetails}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedGiftId && (
                <GiftDetails 
                  giftId={selectedGiftId} 
                  onClose={handleCloseModal}
                  onUpdate={handleRefreshList}
                  isArabic={isArabic}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}

export default App;
