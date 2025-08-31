import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  Badge,
  IconButton,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  Box,
  InputGroup,
  InputLeftElement,
  Button,
  Flex,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from '@chakra-ui/react';
import {
  SearchIcon,
  ViewIcon,
  DeleteIcon,
  EditIcon,
  ChevronDownIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import { getGiftRequests, deleteGiftRequest, formatCurrency, formatDate } from '../utils/api';

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

// Status display names
const getStatusDisplayName = (status) => {
  const names = {
    'in-progress': 'In Progress',
    pending: 'Pending',
    reviewing: 'Reviewing',
    ready: 'Ready',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled'
  };
  return names[status] || status;
};

function GiftList({ onViewGift, onRefresh, refreshTrigger }) {
  const [gifts, setGifts] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim(),
        status: statusFilter,
        sortBy,
        order: sortOrder
      };
      
      const res = await getGiftRequests(params);
      setGifts(res.data.data);
    } catch (err) {
      console.error('Error fetching gifts:', err);
      toast({
        title: 'Error',
        description: 'Failed to load gift requests',
        status: 'error',
        duration: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts and when dependencies change
  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sortBy, sortOrder]);

  // Refresh when parent component triggers refresh
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  const handleDeleteClick = (giftId) => {
    setDeleteId(giftId);
    onOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      await deleteGiftRequest(deleteId);
      toast({
        title: 'Success',
        description: 'Gift request deleted successfully',
        status: 'success',
        duration: 3000
      });
      fetchData(); // Refresh the list
      if (onRefresh) onRefresh(); // Notify parent component
    } catch (err) {
      console.error('Delete error:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete gift request',
        status: 'error',
        duration: 3000
      });
    } finally {
      setDeleteId(null);
      onClose();
    }
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to descending for new sort field
    }
  };

  const getSortLabel = () => {
    const labels = {
      createdAt: 'Date Created',
      budget: 'Budget',
      status: 'Status',
      'recipient.fullName': 'Recipient Name'
    };
    return `${labels[sortBy]} (${sortOrder === 'asc' ? '↑' : '↓'})`;
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Filters and Search */}
      <Box bg="gray.50" p={4} rounded="lg">
        <VStack spacing={4}>
          <Flex w="100%" direction={["column", "row"]} gap={4}>
            <Box flex={2}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by recipient, occasion, description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  bg="white"
                />
              </InputGroup>
            </Box>
            
            <Box flex={1}>
              <Select
                placeholder="All Statuses"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                bg="white"
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="in-progress">In Progress</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Box>
          </Flex>

          <Flex w="100%" justify="space-between" align="center">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="outline">
                Sort by: {getSortLabel()}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleSortChange('createdAt')}>
                  Date Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('budget')}>
                  Budget {sortBy === 'budget' && (sortOrder === 'asc' ? '↑' : '↓')}
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('status')}>
                  Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </MenuItem>
                <MenuItem onClick={() => handleSortChange('recipient.fullName')}>
                  Recipient {sortBy === 'recipient.fullName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </MenuItem>
              </MenuList>
            </Menu>

            <Button
              leftIcon={<RepeatIcon />}
              onClick={fetchData}
              size="sm"
              variant="outline"
              isLoading={loading}
            >
              Refresh
            </Button>
          </Flex>
        </VStack>
      </Box>

      {/* Results */}
      {loading ? (
        <Center py={12}>
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" />
            <Text color="gray.500">Loading gift requests...</Text>
          </VStack>
        </Center>
      ) : gifts.length === 0 ? (
        <Alert status="info" rounded="lg">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {search || statusFilter ? 'No matches found' : 'No gift requests yet'}
            </Text>
            <Text fontSize="sm">
              {search || statusFilter 
                ? 'Try adjusting your search or filter criteria.' 
                : 'Create your first gift request to get started!'
              }
            </Text>
          </VStack>
        </Alert>
      ) : (
        <Box>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Showing {gifts.length} gift request{gifts.length !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
            {statusFilter && ` with status "${getStatusDisplayName(statusFilter)}"`}
          </Text>
          
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {gifts.map((gift) => (
              <Card 
                key={gift._id} 
                variant="outline" 
                _hover={{ shadow: 'md', borderColor: 'teal.200' }}
                transition="all 0.2s"
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    {/* Header */}
                    <Flex w="100%" justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size="sm" noOfLines={1} color="teal.700">
                          {gift.recipient.fullName}
                        </Heading>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(gift.createdAt)}
                        </Text>
                      </VStack>
                      <Badge 
                        colorScheme={getStatusColor(gift.status)}
                        fontSize="xs"
                        px={2}
                        py={1}
                        rounded="md"
                      >
                        {getStatusDisplayName(gift.status)}
                      </Badge>
                    </Flex>

                    {/* Details */}
                    <VStack align="start" spacing={2} w="100%">
                      <HStack justify="space-between" w="100%">
                        <Text fontSize="sm" color="gray.600">
                          <strong>Occasion:</strong> {gift.occasion}
                        </Text>
                        <Text fontSize="sm" color="teal.600" fontWeight="bold">
                          {formatCurrency(gift.budget)}
                        </Text>
                      </HStack>
                      
                      <Text fontSize="sm" color="gray.600">
                        <strong>Relationship:</strong> {gift.recipient.relationship}
                      </Text>
                      
                      <Text fontSize="sm" color="gray.600">
                        <strong>Requester:</strong> {gift.requester.fullName}
                      </Text>
                      
                      <Text fontSize="sm" noOfLines={2} color="gray.600">
                        {gift.description}
                      </Text>
                    </VStack>

                    {/* Actions */}
                    <HStack spacing={2} pt={2} w="100%">
                      <Tooltip label="View Details">
                        <IconButton
                          icon={<ViewIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => onViewGift(gift._id)}
                          flex={1}
                        />
                      </Tooltip>
                      <Tooltip label="Delete">
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeleteClick(gift._id)}
                          flex={1}
                        />
                      </Tooltip>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Gift Request
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this gift request? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirm} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
}

export default GiftList;