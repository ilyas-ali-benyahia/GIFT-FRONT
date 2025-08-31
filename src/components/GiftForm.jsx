import React, { useState, useMemo } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  Button,
  Text,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  Box,
  SimpleGrid,
  Icon,
  Badge,
  Progress
} from '@chakra-ui/react';
import { 
  Gift, 
  User, 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  MessageCircle,
  Info,
  Save,
  RefreshCw,
  X,
  Star,
  CheckCircle,
  Truck
} from 'lucide-react';
import { createGiftRequest } from '../utils/api';
const DELIVERY_FEE = 600; // Fixed delivery fee in DZD

// Form validation function
const validateForm = (form, isArabic = true) => {
  const errors = {};
  const errorMessages = isArabic ? {
    occasionRequired: 'المناسبة مطلوبة',
    budgetRequired: 'الميزانية مطلوبة',
    budgetValid: 'الميزانية يجب أن تكون أكبر من 0',
    budgetMax: 'الميزانية لا يمكن أن تتجاوز 100,000 دج',
    descriptionRequired: 'الوصف مطلوب',
    recipientNameRequired: 'اسم المستلم مطلوب',
    relationshipRequired: 'العلاقة مطلوبة',
    requesterNameRequired: 'اسمك مطلوب',
    emailRequired: 'البريد الإلكتروني مطلوب',
    emailValid: 'بريد إلكتروني صالح مطلوب',
    phoneRequired: 'رقم الهاتف مطلوب',
    phoneValid: 'رقم هاتف جزائري صالح مطلوب'
  } : {
    occasionRequired: 'Occasion is required',
    budgetRequired: 'Budget is required',
    budgetValid: 'Budget must be greater than 0',
    budgetMax: 'Budget cannot exceed 100,000 DZD',
    descriptionRequired: 'Description is required',
    recipientNameRequired: 'Recipient name is required',
    relationshipRequired: 'Relationship is required',
    requesterNameRequired: 'Your name is required',
    emailRequired: 'Email is required',
    emailValid: 'Valid email is required',
    phoneRequired: 'Phone is required',
    phoneValid: 'Valid Algerian phone number is required'
  };
  
  if (!form.occasion.trim()) errors.occasion = errorMessages.occasionRequired;
  if (!form.budget || parseFloat(form.budget) <= 0) errors.budget = errorMessages.budgetValid;
  if (form.budget && parseFloat(form.budget) > 100000) errors.budget = errorMessages.budgetMax;
  if (!form.description.trim()) errors.description = errorMessages.descriptionRequired;
  if (!form.recipient.fullName.trim()) errors.recipientName = errorMessages.recipientNameRequired;
  if (!form.recipient.relationship) errors.relationship = errorMessages.relationshipRequired;
  if (!form.requester.fullName.trim()) errors.requesterName = errorMessages.requesterNameRequired;
  if (!form.requester.email.trim()) errors.email = errorMessages.emailRequired;
  if (!form.requester.phone.trim()) errors.phone = errorMessages.phoneRequired;
  
  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (form.requester.email && !emailRegex.test(form.requester.email)) {
    errors.email = errorMessages.emailValid;
  }
  
  // Algerian phone validation
  const phoneRegex = /^(\+213|0)[5-7][0-9]{8}$/;
  if (form.requester.phone && !phoneRegex.test(form.requester.phone)) {
    errors.phone = errorMessages.phoneValid;
  }
  
  return errors;
};

// Mock API function for demonstration


function GiftForm({ isEdit = false, initialData = null, onSubmit, onCancel, isArabic = true }) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(
    initialData || {
      occasion: '',
      budget: '',
      description: '',
      customRequirements: '',
      recipient: { fullName: '', relationship: '', gender: 'prefer-not-to-say' },
      requester: { 
        fullName: '', 
        phone: '', 
        email: '',
        location: { city: 'Oran', address: '' }
      },
      neededBy: ''
    }
  );

  // Calculate total budget (gift budget + delivery fee)
  const totalBudget = useMemo(() => {
    const giftBudget = parseFloat(form.budget) || 0;
    return giftBudget > 0 ? giftBudget + DELIVERY_FEE : 0;
  }, [form.budget]);

  // Calculate form completion percentage
  const calculateProgress = () => {
    const requiredFields = [
      form.occasion,
      form.budget,
      form.description,
      form.recipient.fullName,
      form.recipient.relationship,
      form.requester.fullName,
      form.requester.phone,
      form.requester.email
    ];
    const completed = requiredFields.filter(field => field && field.toString().trim()).length;
    return (completed / requiredFields.length) * 100;
  };

  const text = {
    ar: {
      title: isEdit ? 'تحديث طلب الهدية' : 'إنشاء طلب هدية جديد',
      instruction: 'املأ هذا النموذج لإنشاء طلب هدية جديد. جميع الحقول المطلوبة محددة بـ *',
      progress: 'مدى الإكمال',
      giftDetails: 'تفاصيل الهدية',
      occasion: 'المناسبة',
      selectOccasion: 'اختر المناسبة',
      budget: 'ميزانية الهدية (دج)',
      budgetPlaceholder: 'أدخل ميزانية الهدية (مثال: 5000)',
      budgetHelp: 'ميزانية الهدية يجب أن تكون بين 100 و 100,000 دج',
      deliveryFee: 'رسوم التوصيل',
      totalBudget: 'إجمالي الميزانية',
      description: 'الوصف',
      descriptionPlaceholder: 'اوصف الهدية التي تبحث عنها، اهتمامات المستلم، التفضيلات، أو أي متطلبات محددة...',
      customRequirements: 'متطلبات إضافية',
      customRequirementsPlaceholder: 'أي متطلبات أو تفضيلات خاصة...',
      recipientInfo: 'معلومات المستلم',
      recipientName: 'اسم المستلم',
      recipientNamePlaceholder: 'لمن هذه الهدية؟',
      recipientGender: 'جنس المستلم',
      relationship: 'علاقتك به/بها',
      selectRelationship: 'اختر علاقتك',
      yourInfo: 'معلوماتك',
      yourName: 'اسمك',
      yourNamePlaceholder: 'أدخل اسمك الكامل',
      phone: 'رقم الهاتف',
      phonePlaceholder: 'أدخل رقم هاتفك (+213XXXXXXXXX)',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'your.email@example.com',
      city: 'المدينة',
      address: 'العنوان',
      addressPlaceholder: 'عنوانك (اختياري)',
      neededBy: 'مطلوب بحلول',
      neededByPlaceholder: 'متى تحتاج الهدية؟',
      createButton: isEdit ? 'تحديث الطلب' : 'إنشاء الطلب',
      clearButton: 'مسح النموذج',
      cancelButton: 'إلغاء',
      creating: 'جاري الإنشاء...',
      updating: 'جاري التحديث...',
      characters: 'حرف',
      dzd: 'دج'
    },
    en: {
      title: isEdit ? 'Update Gift Request' : 'Create New Gift Request',
      instruction: 'Fill out this form to create a new gift request. All fields marked with * are required.',
      progress: 'Completion Progress',
      giftDetails: 'Gift Details',
      occasion: 'Occasion',
      selectOccasion: 'Select occasion',
      budget: 'Gift Budget (DZD)',
      budgetPlaceholder: 'Enter gift budget (e.g., 5000)',
      budgetHelp: 'Gift budget should be between 100 and 100,000 DZD',
      deliveryFee: 'Delivery Fee',
      totalBudget: 'Total Budget',
      description: 'Description',
      descriptionPlaceholder: 'Describe the gift you\'re looking for, recipient\'s interests, preferences, or any specific requirements...',
      customRequirements: 'Custom Requirements',
      customRequirementsPlaceholder: 'Any special requirements or preferences...',
      recipientInfo: 'Recipient Information',
      recipientName: 'Recipient Name',
      recipientNamePlaceholder: 'Who is this gift for?',
      recipientGender: 'Recipient Gender',
      relationship: 'Relationship to You',
      selectRelationship: 'Select your relationship',
      yourInfo: 'Your Information',
      yourName: 'Your Name',
      yourNamePlaceholder: 'Enter your full name',
      phone: 'Phone Number',
      phonePlaceholder: 'Enter your phone number (+213XXXXXXXXX)',
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      city: 'City',
      address: 'Address',
      addressPlaceholder: 'Your address (optional)',
      neededBy: 'Needed By',
      neededByPlaceholder: 'When do you need the gift?',
      createButton: isEdit ? 'Update Request' : 'Create Request',
      clearButton: 'Clear Form',
      cancelButton: 'Cancel',
      creating: 'Creating...',
      updating: 'Updating...',
      characters: 'characters',
      dzd: 'DZD'
    }
  };

  const currentText = isArabic ? text.ar : text.en;

  const occasions = [
    { value: 'Birthday', label: isArabic ? 'عيد ميلاد' : 'Birthday' },
    { value: 'Wedding', label: isArabic ? 'زفاف' : 'Wedding' },
    { value: 'Anniversary', label: isArabic ? 'ذكرى سنوية' : 'Anniversary' },
    { value: 'Graduation', label: isArabic ? 'تخرج' : 'Graduation' },
    { value: 'Holiday', label: isArabic ? 'عطلة' : 'Holiday' },
    { value: "Valentine's Day", label: isArabic ? 'عيد الحب' : "Valentine's Day" },
    { value: "Mother's Day", label: isArabic ? 'عيد الأم' : "Mother's Day" },
    { value: "Father's Day", label: isArabic ? 'عيد الأب' : "Father's Day" },
    { value: 'Christmas', label: isArabic ? 'عيد الميلاد' : 'Christmas' },
    { value: 'Eid', label: isArabic ? 'العيد' : 'Eid' },
    { value: 'Other', label: isArabic ? 'أخرى' : 'Other' }
  ];

  const relationships = [
    { value: 'spouse', label: isArabic ? 'زوج/زوجة' : 'Spouse' },
    { value: 'parent', label: isArabic ? 'والد/والدة' : 'Parent' },
    { value: 'child', label: isArabic ? 'طفل' : 'Child' },
    { value: 'sibling', label: isArabic ? 'شقيق/شقيقة' : 'Sibling' },
    { value: 'friend', label: isArabic ? 'صديق' : 'Friend' },
    { value: 'colleague', label: isArabic ? 'زميل عمل' : 'Colleague' },
    { value: 'relative', label: isArabic ? 'قريب' : 'Relative' },
    { value: 'other', label: isArabic ? 'أخرى' : 'Other' }
  ];

  const genders = [
    { value: 'male', label: isArabic ? 'ذكر' : 'Male' },
    { value: 'female', label: isArabic ? 'أنثى' : 'Female' },
    { value: 'other', label: isArabic ? 'أخرى' : 'Other' },
    { value: 'prefer-not-to-say', label: isArabic ? 'أفضل عدم الذكر' : 'Prefer not to say' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (name.includes('recipient.')) {
      const field = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        recipient: { ...prev.recipient, [field]: value }
      }));
      
      // Clear recipient-specific errors
      if (field === 'fullName' && errors.recipientName) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.recipientName;
          return newErrors;
        });
      }
      if (field === 'relationship' && errors.relationship) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.relationship;
          return newErrors;
        });
      }
    } else if (name.includes('requester.')) {
      const field = name.split('.')[1];
      if (field === 'city' || field === 'address') {
        setForm(prev => ({
          ...prev,
          requester: { 
            ...prev.requester, 
            location: { ...prev.requester.location, [field]: value }
          }
        }));
      } else {
        setForm(prev => ({
          ...prev,
          requester: { ...prev.requester, [field]: value }
        }));
      }
      
      // Clear requester-specific errors
      if (field === 'fullName' && errors.requesterName) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.requesterName;
          return newErrors;
        });
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(form, isArabic);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: isArabic ? 'خطأ في التحقق' : 'Validation Error',
        description: isArabic ? 'يرجى إصلاح الأخطاء في النموذج' : 'Please fix the errors in the form',
        status: 'error',
        duration: 3000
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Create form data with total budget (including delivery fee)
      const formDataWithTotal = {
        ...form,
        budget: totalBudget // Send total budget to backend
      };

      if (isEdit && onSubmit) {
        await onSubmit(formDataWithTotal);
        toast({
          title: isArabic ? 'تم بنجاح!' : 'Success!',
          description: isArabic ? 'تم تحديث طلب الهدية بنجاح' : 'Gift request updated successfully',
          status: 'success',
          duration: 3000
        });
      } else {
        const response = await createGiftRequest(formDataWithTotal);
        toast({
          title: isArabic ? 'تم بنجاح!' : 'Success!',
          description: isArabic ? 'تم إنشاء طلب الهدية بنجاح' : 'Gift request created successfully',
          status: 'success',
          duration: 3000
        });
        
        // Reset form after successful creation
        setForm({
          occasion: '', 
          budget: '', 
          description: '',
          customRequirements: '',
          recipient: { fullName: '', relationship: '', gender: 'prefer-not-to-say' },
          requester: { 
            fullName: '', 
            phone: '', 
            email: '',
            location: { city: 'Oran', address: '' }
          },
          neededBy: ''
        });
        
        // Call onSubmit if provided (for parent component actions)
        if (onSubmit) {
          onSubmit();
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      toast({
        title: isArabic ? 'خطأ' : 'Error',
        description: err.message || (isArabic ? 'فشل في حفظ طلب الهدية' : 'Failed to save gift request'),
        status: 'error',
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      occasion: '', 
      budget: '', 
      description: '',
      customRequirements: '',
      recipient: { fullName: '', relationship: '', gender: 'prefer-not-to-say' },
      requester: { 
        fullName: '', 
        phone: '', 
        email: '',
        location: { city: 'Oran', address: '' }
      },
      neededBy: ''
    });
    setErrors({});
  };

  const progressValue = calculateProgress();

  return (
    <Box 
      maxW="1000px" 
      mx="auto" 
      p={6}
      bg="gradient-to-br from-white to-gray-50"
      minH="100vh"
    >
      {/* Header */}
      <Box textAlign="center" mb={8}>
        <HStack justify="center" spacing={3} mb={4}>
          <Icon as={Gift} w={8} h={8} color="teal.500" />
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">
            {currentText.title}
          </Text>
        </HStack>
        
        {/* Progress Bar */}
        <Box mb={6}>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" color="gray.600">{currentText.progress}</Text>
            <Badge colorScheme="teal" variant="subtle">
              {Math.round(progressValue)}%
            </Badge>
          </HStack>
          <Progress 
            value={progressValue} 
            colorScheme="teal" 
            size="lg" 
            borderRadius="full"
            bg="gray.100"
          />
        </Box>
        
        {/* Instructions */}
        <Alert 
          status="info" 
          borderRadius="xl" 
          bg="blue.50" 
          borderColor="blue.200"
          border="2px solid"
          borderStyle="dashed"
        >
          <AlertIcon color="blue.500"/>
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            {currentText.instruction}
          </Text>
        </Alert>
      </Box>

      <Box 
        as="form" 
        onSubmit={handleSubmit}
        bg="white"
        p={8}
        borderRadius="2xl"
        boxShadow="xl"
        border="1px solid"
        borderColor="gray.200"
      >
        <VStack spacing={8}>
          {/* Gift Details Section */}
          <Box w="100%">
            <HStack mb={6} spacing={3}>
              <Icon as={Gift} w={6} h={6} color="teal.500" />
              <Text fontSize="xl" fontWeight="bold" color="teal.600">
                {currentText.giftDetails}
              </Text>
              <Divider flex={1} />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.occasion} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={Calendar} w={4} h={4} />
                    <Text>{currentText.occasion} *</Text>
                  </HStack>
                </FormLabel>
                <Select
                  name="occasion"
                  placeholder={currentText.selectOccasion}
                  value={form.occasion}
                  onChange={handleChange}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                >
                  {occasions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.occasion}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.budget} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={DollarSign} w={4} h={4} />
                    <Text>{currentText.budget} *</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="budget"
                  placeholder={currentText.budgetPlaceholder}
                  type="number"
                  min="100"
                  max="100000"
                  step="100"
                  value={form.budget}
                  onChange={handleChange}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
                <FormErrorMessage>{errors.budget}</FormErrorMessage>
                <Text fontSize="xs" color="gray.500" mt={2}>
                  <Icon as={Info} w={3} h={3} display="inline" mr={1} />
                  {currentText.budgetHelp}
                </Text>
              </FormControl>
            </SimpleGrid>

            {/* Budget Summary */}
            {form.budget && parseFloat(form.budget) > 0 && (
              <Box mt={6} p={4} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={3}>
                  <Icon as={DollarSign} w={5} h={5} display="inline" mr={2} />
                  {isArabic ? 'ملخص الميزانية' : 'Budget Summary'}
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text color="gray.600">{isArabic ? 'ميزانية الهدية:' : 'Gift Budget:'}</Text>
                    <Text fontWeight="semibold">{parseFloat(form.budget).toLocaleString()} {currentText.dzd}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={Truck} w={4} h={4} color="blue.500" />
                      <Text color="gray.600">{currentText.deliveryFee}:</Text>
                    </HStack>
                    <Text fontWeight="semibold">{DELIVERY_FEE.toLocaleString()} {currentText.dzd}</Text>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="bold" color="teal.600">{currentText.totalBudget}:</Text>
                    <Text fontSize="lg" fontWeight="bold" color="teal.600">
                      {totalBudget.toLocaleString()} {currentText.dzd}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            )}

            <FormControl isInvalid={errors.description} isRequired mt={6}>
              <FormLabel color="gray.700" fontWeight="semibold">
                <HStack>
                  <Icon as={MessageCircle} w={4} h={4} />
                  <Text>{currentText.description} *</Text>
                </HStack>
              </FormLabel>
              <Textarea
                name="description"
                placeholder={currentText.descriptionPlaceholder}
                value={form.description}
                onChange={handleChange}
                resize="vertical"
                minH="120px"
                maxLength={1000}
                borderColor="gray.300"
                focusBorderColor="teal.400"
                borderRadius="lg"
                size="lg"
              />
              <HStack justify="space-between" mt={2}>
                <FormErrorMessage>{errors.description}</FormErrorMessage>
                <Text fontSize="xs" color="gray.500">
                  {form.description.length}/1000 {currentText.characters}
                </Text>
              </HStack>
            </FormControl>

            <FormControl mt={6}>
              <FormLabel color="gray.700" fontWeight="semibold">
                <HStack>
                  <Icon as={Star} w={4} h={4} />
                  <Text>{currentText.customRequirements}</Text>
                </HStack>
              </FormLabel>
              <Textarea
                name="customRequirements"
                placeholder={currentText.customRequirementsPlaceholder}
                value={form.customRequirements}
                onChange={handleChange}
                resize="vertical"
                minH="100px"
                maxLength={500}
                borderColor="gray.300"
                focusBorderColor="teal.400"
                borderRadius="lg"
                size="lg"
              />
              <Text fontSize="xs" color="gray.500" mt={2} textAlign={isArabic ? "right" : "left"}>
                {form.customRequirements.length}/500 {currentText.characters}
              </Text>
            </FormControl>
          </Box>

          {/* Recipient Information Section */}
          <Box w="100%">
            <HStack mb={6} spacing={3}>
              <Icon as={Heart} w={6} h={6} color="pink.500" />
              <Text fontSize="xl" fontWeight="bold" color="pink.600">
                {currentText.recipientInfo}
              </Text>
              <Divider flex={1} />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.recipientName} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={User} w={4} h={4} />
                    <Text>{currentText.recipientName} *</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="recipient.fullName"
                  placeholder={currentText.recipientNamePlaceholder}
                  value={form.recipient.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
                <FormErrorMessage>{errors.recipientName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.relationship} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={Heart} w={4} h={4} />
                    <Text>{currentText.relationship} *</Text>
                  </HStack>
                </FormLabel>
                <Select
                  name="recipient.relationship"
                  placeholder={currentText.selectRelationship}
                  value={form.recipient.relationship}
                  onChange={handleChange}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                >
                  {relationships.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.relationship}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700" fontWeight="semibold">
                  {currentText.recipientGender}
                </FormLabel>
                <Select
                  name="recipient.gender"
                  value={form.recipient.gender}
                  onChange={handleChange}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                >
                  {genders.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Your Information Section */}
          <Box w="100%">
            <HStack mb={6} spacing={3}>
              <Icon as={User} w={6} h={6} color="blue.500" />
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                {currentText.yourInfo}
              </Text>
              <Divider flex={1} />
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <FormControl isInvalid={errors.requesterName} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={User} w={4} h={4} />
                    <Text>{currentText.yourName} *</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="requester.fullName"
                  placeholder={currentText.yourNamePlaceholder}
                  value={form.requester.fullName}
                  onChange={handleChange}
                  maxLength={100}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
                <FormErrorMessage>{errors.requesterName}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.phone} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={Phone} w={4} h={4} />
                    <Text>{currentText.phone} *</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="requester.phone"
                  placeholder={currentText.phonePlaceholder}
                  value={form.requester.phone}
                  onChange={handleChange}
                  maxLength={20}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.email} isRequired>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={Mail} w={4} h={4} />
                    <Text>{currentText.email} *</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="requester.email"
                  placeholder={currentText.emailPlaceholder}
                  type="email"
                  value={form.requester.email}
                  onChange={handleChange}
                  maxLength={100}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={Calendar} w={4} h={4} />
                    <Text>{currentText.neededBy}</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="neededBy"
                  placeholder={currentText.neededByPlaceholder}
                  type="date"
                  value={form.neededBy}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
              <FormControl>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={MapPin} w={4} h={4} />
                    <Text>{currentText.city}</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="requester.city"
                  value={form.requester.location?.city || 'Oran'}
                  onChange={handleChange}
                  maxLength={50}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700" fontWeight="semibold">
                  <HStack>
                    <Icon as={MapPin} w={4} h={4} />
                    <Text>{currentText.address}</Text>
                  </HStack>
                </FormLabel>
                <Input
                  name="requester.address"
                  placeholder={currentText.addressPlaceholder}
                  value={form.requester.location?.address || ''}
                  onChange={handleChange}
                  maxLength={200}
                  borderColor="gray.300"
                  focusBorderColor="teal.400"
                  borderRadius="lg"
                  size="lg"
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          {/* Action Buttons */}
          <Box w="100%" pt={6}>
            <Divider mb={6} />
            
            <SimpleGrid columns={{ base: 1, md: isEdit || onCancel ? 3 : 2 }} spacing={4}>
              <Button
                leftIcon={<Icon as={isEdit ? Save : CheckCircle} />}
                colorScheme="teal"
                type="submit"
                isLoading={loading}
                loadingText={isEdit ? currentText.updating : currentText.creating}
                size="lg"
                borderRadius="xl"
                py={6}
                fontSize="lg"
                fontWeight="bold"
                boxShadow="lg"
                _hover={{ 
                  transform: "translateY(-2px)",
                  boxShadow: "xl"
                }}
                transition="all 0.2s"
              >
                {currentText.createButton}
              </Button>
              
              {!isEdit && (
                <Button
                  leftIcon={<Icon as={RefreshCw} />}
                  variant="outline"
                  colorScheme="gray"
                  onClick={resetForm}
                  size="lg"
                  borderRadius="xl"
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  isDisabled={loading}
                  borderWidth="2px"
                  _hover={{ 
                    bg: "gray.50",
                    transform: "translateY(-1px)"
                  }}
                  transition="all 0.2s"
                >
                  {currentText.clearButton}
                </Button>
              )}
              
              {onCancel && (
                <Button 
                  leftIcon={<Icon as={X} />}
                  variant="outline" 
                  colorScheme="red"
                  onClick={onCancel} 
                  size="lg"
                  borderRadius="xl"
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  isDisabled={loading}
                  borderWidth="2px"
                  _hover={{ 
                    bg: "red.50",
                    transform: "translateY(-1px)"
                  }}
                  transition="all 0.2s"
                >
                  {currentText.cancelButton}
                </Button>
              )}
            </SimpleGrid>

            {/* Success Message */}
            {progressValue === 100 && (
              <Alert 
                status="success" 
                mt={6} 
                borderRadius="lg"
                border="2px solid"
                borderColor="green.200"
              >
                <AlertIcon />
                <Text fontWeight="medium">
                  {isArabic ? 'جميع الحقول المطلوبة مكتملة!' : 'All required fields are completed!'}
                </Text>
              </Alert>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default GiftForm;