import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Text,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Progress,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import {
  CalendarIcon,
  TimeIcon,
  CheckCircleIcon,
  WarningIcon,
  StarIcon,
  TriangleUpIcon  // Changed from TrendUpIcon to TriangleUpIcon
} from '@chakra-ui/icons';
import { getStats, formatCurrency } from '../utils/api';

// Status color mapping
const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    'in-progress': 'purple',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'gray';
};

function StatsPage({ refreshTrigger }) {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await getStats();
      setStats(res.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Center py={12}>
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color="gray.500">Loading dashboard statistics...</Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error" rounded="lg">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold">Failed to Load Statistics</Text>
          <Text fontSize="sm">{error}</Text>
        </VStack>
      </Alert>
    );
  }

  const totalRequests = stats.totalRequests || 0;
  const completionRate = totalRequests > 0 
    ? Math.round((stats.completedRequests / totalRequests) * 100) 
    : 0;
  
  const activeRequests = (stats.pendingRequests || 0) + (stats.inProgressRequests || 0);
  
  return (
    <VStack spacing={8} align="stretch">
      {/* Header */}
      <Box textAlign="center">
        <Heading size="xl" color="teal.700" mb={2}>
          📊 Dashboard Overview
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Track your gift request management at a glance
        </Text>
      </Box>

      {/* Key Metrics */}
      <SimpleGrid columns={[1, 2, 4]} spacing={6}>
        <Card bg="gradient-to-br from-blue-50 to-blue-100" borderColor="blue.200" borderWidth={1}>
          <CardBody textAlign="center">
            <VStack spacing={2}>
              <Icon as={CalendarIcon} boxSize={8} color="blue.500" />
              <Stat>
                <StatNumber fontSize="2xl" color="blue.700">
                  {totalRequests}
                </StatNumber>
                <StatLabel color="blue.600">Total Requests</StatLabel>
                {stats.recentRequests !== undefined && (
                  <StatHelpText color="blue.500">
                    {stats.recentRequests} this week
                  </StatHelpText>
                )}
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gradient-to-br from-orange-50 to-orange-100" borderColor="orange.200" borderWidth={1}>
          <CardBody textAlign="center">
            <VStack spacing={2}>
              <Icon as={TimeIcon} boxSize={8} color="orange.500" />
              <Stat>
                <StatNumber fontSize="2xl" color="orange.700">
                  {activeRequests}
                </StatNumber>
                <StatLabel color="orange.600">Active Requests</StatLabel>
                <StatHelpText color="orange.500">
                  Pending & In Progress
                </StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gradient-to-br from-green-50 to-green-100" borderColor="green.200" borderWidth={1}>
          <CardBody textAlign="center">
            <VStack spacing={2}>
              <Icon as={CheckCircleIcon} boxSize={8} color="green.500" />
              <Stat>
                <StatNumber fontSize="2xl" color="green.700">
                  {stats.completedRequests || 0}
                </StatNumber>
                <StatLabel color="green.600">Completed</StatLabel>
                <StatHelpText color="green.500">
                  {completionRate}% success rate
                </StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        <Card bg="gradient-to-br from-purple-50 to-purple-100" borderColor="purple.200" borderWidth={1}>
          <CardBody textAlign="center">
            <VStack spacing={2}>
              <Icon as={StarIcon} boxSize={8} color="purple.500" />
              <Stat>
                <StatNumber fontSize="2xl" color="purple.700">
                  {formatCurrency(stats.averageBudget || 0)}
                </StatNumber>
                <StatLabel color="purple.600">Average Budget</StatLabel>
                <StatHelpText color="purple.500">
                  Per request
                </StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Detailed Breakdown */}
      <SimpleGrid columns={[1, 1, 2]} spacing={8}>
        {/* Status Breakdown */}
        <Card variant="outline">
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={TriangleUpIcon} color="teal.500" />
                <Heading size="md" color="teal.700">Request Status Breakdown</Heading>
              </HStack>
              
              <VStack spacing={3} w="100%">
                {stats.statusBreakdown && Object.entries(stats.statusBreakdown).map(([status, count]) => (
                  <Box key={status} w="100%">
                    <Flex justify="space-between" align="center" mb={1}>
                      <HStack>
                        <Badge colorScheme={getStatusColor(status)} size="sm">
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </Badge>
                      </HStack>
                      <Text fontWeight="bold" fontSize="sm">
                        {count} ({totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0}%)
                      </Text>
                    </Flex>
                    <Progress 
                      value={totalRequests > 0 ? (count / totalRequests) * 100 : 0}
                      colorScheme={getStatusColor(status)}
                      size="sm"
                      rounded="md"
                    />
                  </Box>
                ))}
                
                {(!stats.statusBreakdown || Object.keys(stats.statusBreakdown).length === 0) && (
                  <Alert status="info" size="sm">
                    <AlertIcon />
                    <Text fontSize="sm">No data available</Text>
                  </Alert>
                )}
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Quick Insights */}
        <Card variant="outline">
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack>
                <Icon as={WarningIcon} color="teal.500" />
                <Heading size="md" color="teal.700">Quick Insights</Heading>
              </HStack>
              
              <VStack spacing={4} w="100%">
                {/* Completion Rate Insight */}
                <Box w="100%">
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" fontSize="sm">Completion Rate</Text>
                    <Badge 
                      colorScheme={completionRate >= 75 ? 'green' : completionRate >= 50 ? 'orange' : 'red'}
                      fontSize="xs"
                    >
                      {completionRate}%
                    </Badge>
                  </Flex>
                  <Progress 
                    value={completionRate} 
                    colorScheme={completionRate >= 75 ? 'green' : completionRate >= 50 ? 'orange' : 'red'}
                    size="sm"
                    rounded="md"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {completionRate >= 75 
                      ? '🎉 Excellent completion rate!' 
                      : completionRate >= 50 
                      ? '👍 Good progress, keep it up!' 
                      : '📈 Focus on completing pending requests'
                    }
                  </Text>
                </Box>

                <Divider />

                {/* Average Budget Insight */}
                <Box w="100%">
                  <Text fontWeight="semibold" fontSize="sm" mb={1}>Budget Analysis</Text>
                  <Text fontSize="sm" color="gray.600">
                    Average gift budget: <strong>{formatCurrency(stats.averageBudget || 0)}</strong>
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {stats.averageBudget >= 200 
                      ? '💎 Premium gift range' 
                      : stats.averageBudget >= 100 
                      ? '🎁 Standard gift range' 
                      : '💝 Budget-friendly gifts'
                    }
                  </Text>
                </Box>

                <Divider />

                {/* Activity Insight */}
                <Box w="100%">
                  <Text fontWeight="semibold" fontSize="sm" mb={1}>Recent Activity</Text>
                  <Text fontSize="sm" color="gray.600">
                    {stats.recentRequests || 0} new requests this week
                  </Text>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {(stats.recentRequests || 0) >= 5 
                      ? '🔥 High activity period!' 
                      : (stats.recentRequests || 0) >= 2 
                      ? '📊 Steady activity' 
                      : '🌱 Room for growth'
                    }
                  </Text>
                </Box>

                {/* Tips */}
                <Box w="100%" bg="blue.50" p={3} rounded="md">
                  <Text fontSize="xs" color="blue.700" fontWeight="semibold" mb={1}>
                    💡 Pro Tips:
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xs" color="blue.600">
                      • Update request statuses regularly for better tracking
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      • Focus on completing pending requests first
                    </Text>
                    <Text fontSize="xs" color="blue.600">
                      • Use the search feature to find specific requests quickly
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Footer */}
      <Box textAlign="center" pt={4}>
        <Text fontSize="sm" color="gray.500">
          Dashboard updates automatically • Last refreshed: {new Date().toLocaleTimeString()}
        </Text>
      </Box>
    </VStack>
  );
}

export default StatsPage;