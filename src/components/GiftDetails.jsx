import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Badge,
  SimpleGrid,
  Select,
  Button,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Card,
  CardBody,
  Flex,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import {
  CalendarIcon,
  AtSignIcon,
  PhoneIcon,
  InfoIcon,
  EditIcon
} from '@chakra-ui/icons';
import { getGiftRequest, updateGiftStatus, formatCurrency, formatDate } from '../utils/api';

// Status color mapping
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    reviewing: 'blue',
    'in-progress': 'purple',
    ready: 'cyan',
    delivered: 'green',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'gray';
};

// Status options with descriptions
const statusOptions = [
  { value: 'pending', label: 'Pending', description: 'Request submitted, waiting for review' },
  { value: 'reviewing', label: 'Reviewing', description: 'Request is being reviewed' },
  { value: 'in-progress', label: 'In Progress', description: 'Gift is being prepared/purchased' },
  { value: 'ready', label: 'Ready', description: 'Gift is ready for pickup/delivery' },
  { value: 'delivered', label: 'Delivered', description: 'Gift has been delivered' },
  { value: 'completed', label: 'Completed', description: 'Request fulfilled successfully' },
  { value: 'cancelled', label: 'Cancelled', description: 'Request was cancelled' }
];

function GiftDetails({ giftId, onClose, onUpdate }) {
  const [gift, setGift] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const toast = useToast();

  const fetchGift = async () => {
    if (!giftId) {
      setLoading(false);
      return;
    }

    try {
      const res = await getGiftRequest(giftId);
      setGift(res.data.data);
      setStatus(res.data.data.status);
    } catch (err) {
      console.error('Error fetching gift:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to load gift details',
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGift();
  }, [giftId]);

  const handleStatusUpdate = async () => {
    if (!giftId || status === gift.status) return;

    setUpdating(true);
    try {
      await updateGiftStatus(giftId, { status });
      toast({
        title: 'Success!',
        description: 'Status updated successfully',
        status: 'success',
        duration: 3000
      });
      
      // Update local state
      setGift(prev => ({ ...prev, status }));
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Status update error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to update status',
        status: 'error',
        duration: 3000
      });
      // Revert status on error
      setStatus(gift.status);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusDescription = (statusValue) => {
    const option = statusOptions.find(opt => opt.value === statusValue);
    return option ? option.description : '';
  };

  if (loading) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color="gray.500">Loading gift details...</Text>
        </VStack>
      </Center>
    );
  }

  if (!gift) {
    return (
      <Alert status="error" rounded="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">Gift Request Not Found</Text>
          <Text fontSize="sm">The requested gift details could not be loaded.</Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box>
        <Flex justify="space-between" align="start" mb={4}>
          <VStack align="start" spacing={1}>
            <Heading size="xl" color="teal.700">
              {gift.recipient.fullName}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Created on {formatDate(gift.createdAt)}
              {gift.updatedAt && gift.updatedAt !== gift.createdAt && (
                <> • Updated on {formatDate(gift.updatedAt)}</>
              )}
            </Text>
          </VStack>
          
          <Badge 
            colorScheme={getStatusColor(gift.status)} 
            size="lg"
            px={3}
            py={1}
            rounded="full"
            fontSize="sm"
          >
            {statusOptions.find(opt => opt.value === gift.status)?.label || gift.status}
          </Badge>
        </Flex>
        
        <Text color="gray.600" fontSize="sm">
          {getStatusDescription(gift.status)}
        </Text>
      </Box>

      <Divider />

      {/* Gift Information */}
      <SimpleGrid columns={[1, 2]} spacing={6}>
        <Card variant="outline">
          <CardBody>
            <VStack align="start" spacing={3}>
              
                   

              <HStack>
                <Icon as={CalendarIcon} color="teal.500" />
                <Text fontWeight="bold" color="teal.700">Gift Details</Text>
              </HStack>
              <Box>
                <Text fontSize="sm" color="gray.600">Reciver</Text>
                <Text fontWeight="semibold">{gift.recipient.fullName}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Occasion</Text>
                <Text fontWeight="semibold">{gift.occasion}</Text>
              </Box>
              
              <Box>
                <Text fontSize="sm" color="gray.600">Budget</Text>
                <Text fontWeight="semibold" color="green.600" fontSize="lg">
                  {formatCurrency(gift.budget)}
                </Text>
              </Box>
              
              <Box>
                <Text fontSize="sm" color="gray.600">Relationship</Text>
                <Text fontWeight="semibold" textTransform="capitalize">
                  {gift.recipient.relationship}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">Needed by</Text>
                <Text fontWeight="semibold" textTransform="capitalize">
                  {new Date(gift.neededBy).toISOString().split("T")[0]}
                </Text>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card variant="outline">
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={InfoIcon} color="teal.500" />
                <Text fontWeight="bold" color="teal.700">Contact Information</Text>
              </HStack>
              
              <Box>
                <Text fontSize="sm" color="gray.600">Requester</Text>
                <Text fontWeight="semibold">{gift.requester.fullName}</Text>
              </Box>
              
              <HStack>
                <Icon as={AtSignIcon} color="gray.400" boxSize={4} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">Email</Text>
                  <Text fontWeight="semibold" fontSize="sm">
                    {gift.requester.email}
                  </Text>
                </VStack>
              </HStack>
              
              <HStack>
                <Icon as={PhoneIcon} color="gray.400" boxSize={4} />
                <VStack align="start" spacing={0}>
                  <Text fontSize="sm" color="gray.600">Phone</Text>
                  <Text fontWeight="semibold" fontSize="sm">
                    {gift.requester.phone}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Description */}
      <Card variant="outline">
        <CardBody>
          <VStack align="start" spacing={3}>
            <Text fontWeight="bold" color="teal.700">Description</Text>
            <Text 
              bg="gray.50" 
              p={4} 
              rounded="md" 
              lineHeight="1.6"
              whiteSpace="pre-wrap"
            >
              {gift.description}
            </Text>
            <Text fontWeight="bold" color="teal.700">Custom Requirements</Text>
            <Text 
              bg="gray.50" 
              p={4} 
              rounded="md" 
              lineHeight="1.6"
              whiteSpace="pre-wrap"
            >
              {gift.customRequirements}
            </Text>
          </VStack>
        </CardBody>
      </Card>

      <Divider />

      {/* Status Update Section */}
      <Card variant="outline" bg="blue.50" borderColor="blue.200">
        <CardBody>
          <VStack align="start" spacing={4}>
            <HStack>
              <Icon as={EditIcon} color="blue.500" />
              <Text fontWeight="bold" color="blue.700">Update Status</Text>
            </HStack>
            
            <Text fontSize="sm" color="blue.600">
              Change the status to track the progress of this gift request.
            </Text>
            
            <HStack spacing={4} w="100%">
              <Box flex={1}>
                <Text fontSize="sm" color="gray.600" mb={2}>Current Status</Text>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  bg="white"
                  borderColor="blue.300"
                  _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                {status && status !== gift.status && (
                  <Text fontSize="xs" color="blue.600" mt={1}>
                    {getStatusDescription(status)}
                  </Text>
                )}
              </Box>
              
              <VStack spacing={2}>
                <Button
                  onClick={handleStatusUpdate}
                  colorScheme="blue"
                  isLoading={updating}
                  loadingText="Updating..."
                  isDisabled={status === gift.status}
                  size="md"
                >
                  Update Status
                </Button>
                {status !== gift.status && (
                  <Text fontSize="xs" color="orange.600" textAlign="center">
                    Changes not saved
                  </Text>
                )}
              </VStack>
            </HStack>
            
            {/* Status Timeline/History could go here in future */}
            <Box w="100%" pt={2}>
              <Text fontSize="xs" color="gray.500">
                💡 Tip: Keep the requester informed by updating the status as you progress with their request.
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Additional Actions */}
      <HStack justify="flex-end" spacing={3} pt={2}>
        <Tooltip label="Feature coming soon">
          <Button 
            variant="outline" 
            size="sm"
            isDisabled
            leftIcon={<EditIcon />}
          >
            Edit Request
          </Button>
        </Tooltip>
        
        {onClose && (
          <Button 
            colorScheme="teal" 
            onClick={onClose}
            size="sm"
          >
            Close
          </Button>
        )}
      </HStack>
    </VStack>
  );
}

export default GiftDetails;