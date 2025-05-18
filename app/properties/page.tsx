'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table, { Column } from '../components/ui/Table';
import { Property, PropertyFormData, PropertyType, PropertyStatus, PropertyFeature, PropertyMarketType } from './types';
import {
  PlusIcon,
  ArrowPathIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  MapIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { usePropertyStorage } from './usePropertyStorage';
import { scrapeDrivenProperties } from '../services/firecrawlService';

// Default feature options
const defaultFeatures: PropertyFeature[] = [
  { name: 'Air Conditioning', value: false },
  { name: 'Heating', value: false },
  { name: 'Pool', value: false },
  { name: 'Garden', value: false },
  { name: 'Security System', value: false },
  { name: 'Garage', value: false },
];

// Property type and status options
const propertyTypes: PropertyType[] = ['Villa', 'Penthouse', 'Apartment', 'Duplex', 'Townhouses'];
const propertyStatuses: PropertyStatus[] = ['available', 'sold', 'pending', 'rented'];
const propertyMarketTypes: PropertyMarketType[] = ['offplan', 'second market'];

// Helper function to generate demo property data
const generateDemoData = (): PropertyFormData => {
  // UAE address components
  const streets = ['Al Reem Street', 'Corniche Road', 'Sheikh Zayed Road', 'Jumeirah Beach Road', 'Al Wasl Road', 'Al Falah Street'];
  const areas = ['Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Al Reem Island', 'Yas Island', 'Saadiyat Island', 'Business Bay', 'Jumeirah Village Circle'];
  const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah'];
  const poBox = ['12345', '54321', '98765', '45678', '23456'];
  
  // Random property names
  const propertyPrefixes = ['Modern', 'Luxury', 'Exclusive', 'Elegant', 'Spacious', 'Contemporary', 'Premium'];
  const propertyDescriptors = ['Apartment', 'House', 'Condo', 'Villa', 'Townhouse', 'Penthouse', 'Estate'];
  
  // Generate random values - ensure we use the correct type enums
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const propertyStatus = propertyStatuses[Math.floor(Math.random() * propertyStatuses.length)];
  const propertyMarketType = propertyMarketTypes[Math.floor(Math.random() * propertyMarketTypes.length)];
  const bedrooms = Math.floor(Math.random() * 6) + 1;
  const bathrooms = Math.floor(Math.random() * 5) + 1;
  const price = Math.floor(Math.random() * 9000000) + 100000;
  const size = Math.floor(Math.random() * 5000) + 50;
  const yearBuilt = Math.floor(Math.random() * 20) + 2000; // More recent builds for UAE
  
  // Generate random UAE address
  const street = streets[Math.floor(Math.random() * streets.length)];
  const buildingNumber = Math.floor(Math.random() * 900) + 100;
  const area = areas[Math.floor(Math.random() * areas.length)];
  const emirate = emirates[Math.floor(Math.random() * emirates.length)];
  const po = poBox[Math.floor(Math.random() * poBox.length)];
  const address = `${buildingNumber} ${street}, ${area}, ${emirate}, UAE, P.O. Box ${po}`;
  
  // Generate random reference ID
  const randomRef = `PROP-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  // Generate random title
  const prefix = propertyPrefixes[Math.floor(Math.random() * propertyPrefixes.length)];
  const descriptor = propertyDescriptors[Math.floor(Math.random() * propertyDescriptors.length)];
  const title = `${prefix} ${descriptor} in ${area}, ${emirate}`;
  
  // Generate random description
  const descriptions = [
    `Beautiful ${descriptor.toLowerCase()} located in ${area}, ${emirate}. This property features ${bedrooms} bedrooms and ${bathrooms} bathrooms with stunning views.`,
    `Gorgeous ${descriptor.toLowerCase()} in the heart of ${area}, ${emirate}. Perfect for families with ${bedrooms} spacious bedrooms and ${bathrooms} modern bathrooms.`,
    `Luxurious ${descriptor.toLowerCase()} with high-end finishes throughout. This ${bedrooms}-bedroom, ${bathrooms}-bathroom residence offers elegant living in ${emirate}.`,
    `Charming ${descriptor.toLowerCase()} in a prestigious neighborhood of ${area}, ${emirate}. Featuring ${bedrooms} bedrooms, ${bathrooms} bathrooms, and excellent amenities.`,
  ];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Generate UAE coordinates (approximate)
  // Dubai: 25.2048, 55.2708
  // Abu Dhabi: 24.4539, 54.3773
  // Sharjah: 25.3463, 55.4209
  const lat = 24.2 + Math.random() * 1.5; // UAE latitude range
  const lng = 54.0 + Math.random() * 1.8; // UAE longitude range
  
  // Generate random features
  const randomFeatures = defaultFeatures.map(feature => ({
    name: feature.name,
    value: Math.random() > 0.3, // 70% chance of having a feature
  }));
  
  return {
    reference: randomRef,
    type: propertyType,
    status: propertyStatus,
    market_type: propertyMarketType,
    title: title,
    description: description,
    address: address,
    location_coordinates: `(${lat}, ${lng})`,
    price: price,
    size_sqm: size,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    parking_spots: '',
    year_built: yearBuilt,
    features: randomFeatures,
    images: [],
    documents: [],
  };
};

// Fonction utilitaire pour nettoyer les champs avant envoi à Supabase ou localStorage
function cleanPropertyFormData(property: Partial<PropertyFormData>): PropertyFormData {
  const cleaned: any = {};
  Object.entries(property).forEach(([key, value]) => {
    if (['features', 'images', 'documents'].includes(key)) {
      if (Array.isArray(value)) {
        cleaned[key] = value.length > 0 ? value : null;
      } else {
        cleaned[key] = null;
      }
    } else if (value === '') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned as PropertyFormData;
}

// Fonction utilitaire pour décoder les entités HTML dans l'adresse
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

// Carrousel d'images avec miniatures
function PropertyCarousel({ images = [] }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  if (!images.length) {
    return <div className="text-gray-400 text-center py-8">No images available</div>;
  }
  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);
  return (
    <div>
      <div className="relative flex items-center justify-center">
        <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70" aria-label="Previous image">
          &lt;
        </button>
        <img
          src={images[current]}
          alt={`Property image ${current + 1}`}
          className="w-full max-h-[400px] object-contain rounded shadow-lg"
        />
        <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70" aria-label="Next image">
          &gt;
        </button>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            className={`h-16 w-24 object-cover rounded cursor-pointer border-2 ${idx === current ? 'border-blue-600' : 'border-transparent'}`}
            onClick={() => goTo(idx)}
          />
        ))}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const { properties, loading: apiLoading, error: apiError, fetchProperties, addProperty, editProperty, removeProperty } = usePropertyStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);
  const [filters, setFilters] = useState<{
    type?: PropertyType[];
    status?: PropertyStatus[];
    priceRange?: { min?: number; max?: number };
    bedrooms?: number[];
    agent_id?: string[];
  }>({});
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importPlatform, setImportPlatform] = useState('Driven Properties');
  
  // Check if we're on client side
  useEffect(() => {
    setIsClientSide(true);
  }, []);
  
  // Load properties on component mount
  useEffect(() => {
    if (isClientSide) {
      loadProperties();
    }
  }, [isClientSide]);

  // Form state for property modal
  const [formData, setFormData] = useState<PropertyFormData>({
    reference: '',
    type: 'Apartment',
    status: 'available',
    market_type: 'second market',
    title: '',
    description: '',
    address: '',
    location_coordinates: '(0, 0)',
    price: 0,
    size_sqm: 0,
    bedrooms: 0,
    bathrooms: 0,
    parking_spots: '',
    year_built: new Date().getFullYear(),
    features: [...defaultFeatures],
    images: [],
    documents: [],
  });

  // Function to load properties
  const loadProperties = async () => {
    setIsLoading(true);
    try {
      await fetchProperties();
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form with property data when editing
  const handleOpenModal = async (property?: Property) => {
    if (property) {
      setFormData({ ...property });
      setSelectedProperty(property);
    } else {
      // Reset to default when adding new
      setFormData({
        reference: '',
        type: 'Apartment',
        status: 'available',
        market_type: 'second market',
        title: '',
        description: '',
        address: '',
        location_coordinates: '(0, 0)',
        price: 0,
        size_sqm: 0,
        bedrooms: 0,
        bathrooms: 0,
        parking_spots: '',
        year_built: new Date().getFullYear(),
        features: [...defaultFeatures],
        images: [],
        documents: [],
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['price', 'size_sqm'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } 
    // Handle integer inputs
    else if (['bedrooms', 'bathrooms', 'year_built'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseInt(value, 10) || 0,
      });
    }
    // Handle coordinates inputs
    else if (name === 'location_lat' || name === 'location_lng') {
      // Extraire les valeurs actuelles
      const match = formData.location_coordinates.match(/\(([^,]+),\s*([^\)]+)\)/);
      let lat = 0, lng = 0;
      if (match) {
        lat = parseFloat(match[1]);
        lng = parseFloat(match[2]);
      }
      if (name === 'location_lat') lat = parseFloat(value) || 0;
      if (name === 'location_lng') lng = parseFloat(value) || 0;
      setFormData({
        ...formData,
        location_coordinates: `(${lat}, ${lng})`,
      });
    }
    // Handle string inputs
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle feature toggle
  const handleFeatureToggle = (index: number) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = {
      ...updatedFeatures[index],
      value: !updatedFeatures[index].value,
    };
    
    setFormData({
      ...formData,
      features: updatedFeatures,
    });
  };

  // Handle creating/updating properties
  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      const cleanedProperty = cleanPropertyFormData(formData);
      if (selectedProperty) {
        await editProperty(selectedProperty.id, cleanedProperty);
      } else {
        await addProperty(cleanedProperty);
      }
      setIsModalOpen(false);
      setSelectedProperty(undefined);
    } catch (error) {
      console.error("Failed to save property:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle viewing a property
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleViewProperty = async (property: Property) => {
    setViewingProperty(property);
    setIsViewModalOpen(true);
  };

  // Handle editing a property
  const handleEditProperty = (property: Property) => {
    handleOpenModal(property);
  };

  // Handle deleting a property
  const handleDeleteProperty = (property: Property) => {
    setPropertyToDelete(property);
    setShowDeleteConfirm(true);
  };

  // Confirm property deletion
  const confirmDeleteProperty = async () => {
    if (propertyToDelete) {
      setIsLoading(true);
      try {
        await removeProperty(propertyToDelete.id);
      } catch (error) {
        console.error("Failed to delete property:", error);
      } finally {
        setIsLoading(false);
        setShowDeleteConfirm(false);
        setPropertyToDelete(null);
      }
    }
  };

  // Open filter modal
  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  // Apply filters
  const applyFilters = async (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
    
    setIsLoading(true);
    try {
      await fetchProperties();
    } catch (error) {
      console.error("Failed to apply filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = async () => {
    setFilters({});
    setIsFilterModalOpen(false);
    await fetchProperties();
  };

  // Filter properties based on search and filter criteria
  const filteredProperties = properties.filter(property => {
    // First apply search term
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.status.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    // Then apply filters
    if (filters.type && filters.type.length > 0 && !filters.type.includes(property.type)) {
      return false;
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(property.status)) {
      return false;
    }

    if (filters.priceRange) {
      if (filters.priceRange.min !== undefined && property.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== undefined && property.price > filters.priceRange.max) {
        return false;
      }
    }

    if (filters.bedrooms && filters.bedrooms.length > 0 && !filters.bedrooms.includes(property.bedrooms)) {
      return false;
    }

    return true;
  });

  // Function to get property type icon
  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Villa':
        return <HomeIcon className="h-5 w-5 text-blue-500" />;
      case 'Penthouse':
        return <BuildingOfficeIcon className="h-5 w-5 text-purple-500" />;
      case 'Apartment':
        return <BuildingStorefrontIcon className="h-5 w-5 text-amber-500" />;
      case 'Duplex':
        return <HomeIcon className="h-5 w-5 text-green-500" />;
      case 'Townhouses':
        return <BuildingOfficeIcon className="h-5 w-5 text-indigo-500" />;
      default:
        return <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rented':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to get market type badge color
  const getMarketTypeBadgeColor = (marketType: PropertyMarketType) => {
    switch (marketType) {
      case 'offplan':
        return 'bg-indigo-100 text-indigo-800';
      case 'second market':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Fonction pour gérer l'import
  const handleImportProperty = async () => {
    setImportLoading(true);
    setImportError(null);
    setImportSuccess(null);
    try {
      const scraped = await scrapeDrivenProperties(importUrl);
      let html = scraped.html || '';
      // 1. Debug : afficher le HTML scrapé
      console.log('Scraped HTML:', html);
      // Extraction des champs
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const priceMatch = html.match(/AED\s*([\d,]+)/i);
      const referenceMatch = html.match(/Reference ID\s*:\s*<\/span><span[^>]*>(DP-[A-Z]-\d+)<\/span>/i)
        || html.match(/Reference ID\s*:\s*<\/span><span[^>]*>(DP-[A-Z0-9-]+)<\/span>/i)
        || html.match(/(DP-[A-Z]-\d{5,})/i);
      const addressMatch = html.match(/<span class=\"mx-2 text-\[13px\] !text-black\">(.*?)<\/span><\/a>/i);
      const featuresArr = Array.from(html.matchAll(/<li[^>]*>\s*([A-Za-z0-9 ,\-]+)\s*<\/li>/g)).map(m => (m as RegExpMatchArray)[1].trim());
      console.log('featuresArr:', featuresArr);
      const features = featuresArr.length > 0 ? featuresArr.map(f => ({ name: f, value: true })) : [];
      const images = (Array.from(html.matchAll(/<img src=\"(https:\/\/crm\.drivenproperties\.com\/image\/wm\/listings\/listing\/[^\"]+)\"/g)) as RegExpMatchArray[]).map(m => m[1]);
      const descriptionMatch = html.match(/<div class=\"my-4 list-desc\">([\s\S]*?)<\/div>/i);
      // Clean description (remove HTML tags)
      let description = '';
      if (scraped.metadata?.description) {
        description = scraped.metadata.description;
      } else if (descriptionMatch) {
        description = descriptionMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      }
      // Correction extraction de la référence
      let reference = '';
      if (referenceMatch && referenceMatch[1]) {
        reference = referenceMatch[1].trim();
      } else {
        try {
          const urlParts = importUrl.split('/');
          const lastSegment = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
          reference = `DP-IMPORT-${lastSegment}`;
        } catch {
          reference = `DP-IMPORT-${Date.now()}`;
        }
      }
      // 2. Debug : afficher chaque champ extrait
      console.log('Extracted reference:', reference);
      console.log('Extracted title:', titleMatch ? titleMatch[1].trim() : '');
      console.log('Extracted price:', priceMatch ? priceMatch[1] : '');
      console.log('Extracted address:', addressMatch ? addressMatch[1].trim() : '');
      console.log('Extracted features:', features);
      console.log('Extracted images:', images);
      console.log('Extracted description:', description);
      // Extraction des chambres et salles de bain (selon l'ordre dans le HTML)
      const allMatches = Array.from(html.matchAll(/<div class="flex items-center mx-2">.*?<span class="mx-2 text-\[#0F57D1\]">(\d+)<\/span>/gi)) as RegExpMatchArray[];
      const bedrooms = allMatches[0]?.[1] ? parseInt(allMatches[0][1], 10) : 0;
      const bathrooms = allMatches[1]?.[1] ? parseInt(allMatches[1][1], 10) : 0;
      // Extraction de la surface en Sq.Ft puis conversion en m²
      const sizeMatch = html.match(/<span class="mx-2 text-\[#0F57D1\]">([\d,]+)<\/span>\s*<span class="text-\[#0F57D1\]">Sq\.Ft<\/span>/i);
      const sizeSqft = sizeMatch ? parseInt(sizeMatch[1].replace(/,/g, ''), 10) : 0;
      const size_sqm = sizeSqft ? Math.round(sizeSqft * 0.092903) : 0;

      // Détection du parking
      let parking_spots = '';
      const parkingFeature = featuresArr.find(f => /parking/i.test(f));
      if (parkingFeature) {
        parking_spots = parkingFeature;
      } else {
        // Chercher dans la description si pas trouvé dans les features
        const parkingDescMatch = description.match(/No\.? of Parking\s*:?\s*(\d+)/i);
        if (parkingDescMatch && parkingDescMatch[1]) {
          parking_spots = parkingDescMatch[1];
        }
      }

      // Détection automatique du type de bien à partir du HTML
      let detectedType = 'Apartment';
      const typeMatch = html.match(/\b(apartment|villa|studio|townhouse)\b/i);
      if (typeMatch && typeMatch[1]) {
        switch (typeMatch[1].toLowerCase()) {
          case 'apartment':
            detectedType = 'Apartment';
            break;
          case 'villa':
            detectedType = 'Villa';
            break;
          case 'studio':
            detectedType = 'Studio';
            break;
          case 'townhouse':
            detectedType = 'Townhouses';
            break;
        }
      }

      // Nettoyage de l'adresse
      let address = addressMatch ? addressMatch[1].trim() : '';
      if (address) {
        address = decodeHtmlEntities(address);
      }
      const propertyData: PropertyFormData = {
        reference,
        type: detectedType as PropertyType,
        status: 'available',
        market_type: 'second market',
        title: scraped.metadata?.title || (titleMatch ? titleMatch[1].trim() : ''),
        description,
        address,
        location_coordinates: '(0, 0)',
        price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 0,
        size_sqm,
        bedrooms,
        bathrooms,
        parking_spots,
        year_built: 0,
        features,
        images: Array.isArray(images) ? images : [],
        documents: [],
        source_url: importUrl,
      };
      // Debug : afficher le payload envoyé à Supabase
      console.log('PropertyData sent to Supabase:', propertyData);
      // 4. Détection de doublon sur la référence extraite
      const existing = properties.find(p => p.reference === propertyData.reference);
      if (existing) {
        setImportError('A property with this reference already exists.');
        setImportLoading(false);
        return;
      }
      await addProperty(propertyData);
      setImportSuccess('Property imported successfully!');
    } catch (err: any) {
      setImportError('Error importing property: ' + (err.message || 'Unknown error'));
    } finally {
      setImportLoading(false);
    }
  };

  // Table columns configuration
  const columns: Column<Property>[] = [
    {
      header: 'Ref',
      accessor: (property) => (
        <span className="text-xs text-gray-500 font-medium">{property.reference}</span>
      ),
      sortable: true
    },
    {
      header: 'Property',
      accessor: (property) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">{property.title}</div>
          <div className="text-xs text-gray-500 truncate max-w-xs">
            {property.address}
          </div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Type',
      accessor: (property) => (
        <div className="flex items-center">
          {getPropertyTypeIcon(property.type)}
          <span className="ml-2 text-sm text-gray-900">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Market',
      accessor: (property) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMarketTypeBadgeColor(property.market_type)}`}>
          {property.market_type === 'offplan' ? 'Off-Plan' : 'Second Market'}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Price',
      accessor: (property) => (
        <span className="text-sm text-gray-900 font-medium">
          {formatPrice(property.price)}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Bed / Bath',
      accessor: (property) => (
        <span className="text-sm text-gray-500">
          {property.bedrooms} / {property.bathrooms}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Size',
      accessor: (property) => (
        <span className="text-sm text-gray-500">
          {property.size_sqm} m²
        </span>
      ),
      sortable: true
    },
    {
      header: 'Status',
      accessor: (property) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(property.status)}`}>
          {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Actions',
      accessor: (property) => (
        <div className="flex justify-end space-x-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewProperty(property);
            }}
            variant="secondary"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            aria-label="View"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditProperty(property);
            }}
            variant="primary"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            aria-label="Edit"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteProperty(property);
            }}
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            aria-label="Delete"
          />
        </div>
      )
    }
  ];

  // Empty state for table
  const emptyState = (
    <div className="py-8 text-center">
      <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
      <p className="mt-1 text-sm text-gray-500">
        Start by adding a new property to your listing.
      </p>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Properties</h2>
          <div className="flex gap-2">
            <Button onClick={() => handleOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>Add Property</Button>
            <Button 
              onClick={() => setIsImportModalOpen(true)} 
              icon={<GlobeAltIcon className="h-5 w-5 text-emerald-600" />}
              variant="outline"
            >
              Import from URL
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                rightIcon={
                  searchTerm ? (
                    <XMarkIcon
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    />
                  ) : null
                }
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<FunnelIcon className="h-5 w-5" />}
                onClick={handleOpenFilter}
              >
                {Object.keys(filters).length > 0 ? `Filters (${Object.keys(filters).length})` : 'Filter'}
              </Button>
              <Button
                variant="secondary" 
                size="sm"
                icon={<ArrowPathIcon className="h-5 w-5" />}
                onClick={loadProperties}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {apiError && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <p className="text-red-700">Error loading properties: {apiError}</p>
          </div>
        )}

        <Table<Property>
          data={filteredProperties}
          columns={columns}
          keyExtractor={(property) => property.id}
          sortField="title"
          sortDirection="asc"
          emptyState={emptyState}
          isLoading={isLoading || apiLoading}
          onRowClick={handleViewProperty}
        />
      </div>

      {/* Property Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProperty ? 'Edit Property' : 'Add New Property'}
        size="xl"
        closeOnOutsideClick={false}
      >
        <form onSubmit={handleSaveProperty} className="space-y-6 bg-white overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Left Column */}
            <div className="space-y-5">
              <h4 className="font-medium text-gray-900 text-sm">Basic Information</h4>
              
              {/* Reference */}
              <Input
                id="reference"
                name="reference"
                label="Reference"
                value={formData.reference}
                onChange={handleChange}
                required
              />

              {/* Title */}
              <Input
                id="title"
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              {/* Type */}
              <Select
                id="type"
                name="type"
                label="Type"
                value={formData.type}
                onChange={handleChange}
                options={propertyTypes.map(type => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1)
                }))}
                required
              />

              {/* Market Type */}
              <Select
                id="market_type"
                name="market_type"
                label="Market Type"
                value={formData.market_type}
                onChange={handleChange}
                options={propertyMarketTypes.map(type => ({
                  value: type,
                  label: type === 'offplan' ? 'Off-Plan' : 'Second Market'
                }))}
                required
              />

              {/* Status */}
              <Select
                id="status"
                name="status"
                label="Status"
                value={formData.status}
                onChange={handleChange}
                options={propertyStatuses.map(status => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1)
                }))}
                required
              />

              {/* Price */}
              <Input
                id="price"
                name="price"
                label="Price"
                type="number"
                value={formData.price.toString()}
                onChange={handleChange}
                leftIcon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <h4 className="font-medium text-gray-900 text-sm">Property Details</h4>
              
              {/* Address */}
              <Input
                id="address"
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              {/* Location Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="location_lat"
                  name="location_lat"
                  label="Latitude"
                  type="number"
                  value={(() => { const m = formData.location_coordinates.match(/\(([^,]+),/); return m ? m[1] : ''; })()}
                  onChange={handleChange}
                />
                <Input
                  id="location_lng"
                  name="location_lng"
                  label="Longitude"
                  type="number"
                  value={(() => { const m = formData.location_coordinates.match(/,\s*([^\)]+)\)/); return m ? m[1] : ''; })()}
                  onChange={handleChange}
                />
              </div>

              {/* Size */}
              <Input
                id="size_sqm"
                name="size_sqm"
                label="Size (sqm)"
                type="number"
                value={formData.size_sqm.toString()}
                onChange={handleChange}
                min="0"
                required
              />

              {/* Year Built */}
              <Input
                id="year_built"
                name="year_built"
                label="Year Built"
                type="number"
                value={formData.year_built.toString()}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
                required
              />

              {/* Bedrooms, Bathrooms, Parking */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  label="Bedrooms"
                  type="number"
                  value={formData.bedrooms.toString()}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  label="Bathrooms"
                  type="number"
                  value={formData.bathrooms.toString()}
                  onChange={handleChange}
                  min="0"
                  required
                />
                <Input
                  id="parking_spots"
                  name="parking_spots"
                  label="Parking"
                  type="text"
                  value={formData.parking_spots}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Full width sections */}
          <div className="space-y-5 pt-4">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Features */}
            <div>
              <h4 className="block text-sm font-medium text-gray-700 mb-3">Features</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${idx}`}
                      checked={feature.value as boolean}
                      onChange={() => handleFeatureToggle(idx)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`feature-${idx}`} className="ml-2 block text-sm text-gray-800">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images and Documents - collapsed into a collapsible section */}
          <div className="border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-medium text-gray-900">Media & Documents (Optional)</h4>
            </div>
            <div className="p-4">
              <PropertyCarousel images={formData.images} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              icon={<DocumentDuplicateIcon className="h-5 w-5" />}
              onClick={(e) => {
                e.stopPropagation();
                setFormData(generateDemoData());
              }}
            >
              Add Demo Data
            </Button>
            <Button
              type="submit"
              variant="primary"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProperty ? 'Update' : 'Create'} Property
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Property"
        size="sm"
        closeOnOutsideClick={false}
      >
        <div className="p-2 sm:p-4 bg-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-4">
            <XMarkIcon className="h-7 w-7 text-red-600" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Delete Property
            </h3>
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-lg border-t border-gray-200">
          <Button
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              confirmDeleteProperty();
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Properties"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.type?.includes(type) || false}
                    onChange={(e) => {
                      const newType = [...(filters.type || [])];
                      if (e.target.checked) {
                        newType.push(type);
                      } else {
                        const index = newType.indexOf(type);
                        if (index !== -1) newType.splice(index, 1);
                      }
                      setFilters({ ...filters, type: newType.length ? newType : undefined });
                    }}
                  />
                  <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {propertyStatuses.map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => {
                      const newStatus = [...(filters.status || [])];
                      if (e.target.checked) {
                        newStatus.push(status);
                      } else {
                        const index = newStatus.indexOf(status);
                        if (index !== -1) newStatus.splice(index, 1);
                      }
                      setFilters({ ...filters, status: newStatus.length ? newStatus : undefined });
                    }}
                  />
                  <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
            <div className="grid grid-cols-5 gap-2">
              {[0, 1, 2, 3, 4, 5].map((bedroom) => (
                <div key={bedroom} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`bedroom-${bedroom}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.bedrooms?.includes(bedroom) || false}
                    onChange={(e) => {
                      const newBedrooms = [...(filters.bedrooms || [])];
                      if (e.target.checked) {
                        newBedrooms.push(bedroom);
                      } else {
                        const index = newBedrooms.indexOf(bedroom);
                        if (index !== -1) newBedrooms.splice(index, 1);
                      }
                      setFilters({ ...filters, bedrooms: newBedrooms.length ? newBedrooms : undefined });
                    }}
                  />
                  <label htmlFor={`bedroom-${bedroom}`} className="ml-2 block text-sm text-gray-900">
                    {bedroom === 0 ? 'Studio' : bedroom === 5 ? '5+' : bedroom}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">Min Price ($)</label>
                <Input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange?.min?.toString() || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseInt(e.target.value) : undefined;
                    setFilters({
                      ...filters,
                      priceRange: {
                        ...filters.priceRange,
                        min
                      }
                    });
                  }}
                />
              </div>
              <div>
                <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">Max Price ($)</label>
                <Input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange?.max?.toString() || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseInt(e.target.value) : undefined;
                    setFilters({
                      ...filters,
                      priceRange: {
                        ...filters.priceRange,
                        max
                      }
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => applyFilters(filters)}
              icon={<FunnelIcon className="h-5 w-5" />}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Property Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={viewingProperty?.title || 'Property Details'}
        size="xl"
        closeOnOutsideClick={false}
      >
        <div className="space-y-6">
          {/* Property Details */}
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference</label>
                <span className="text-sm text-gray-900">{viewingProperty?.reference}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <span className="text-sm text-gray-900">
                  {viewingProperty?.type ? viewingProperty.type.charAt(0).toUpperCase() + viewingProperty.type.slice(1) : ''}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${viewingProperty?.status ? getStatusBadgeColor(viewingProperty.status as PropertyStatus) : ''}`}>
                  {viewingProperty?.status ? viewingProperty.status.charAt(0).toUpperCase() + viewingProperty.status.slice(1) : ''}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <span className="text-sm text-gray-900">{formatPrice(viewingProperty?.price as number)}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <span className="text-sm text-gray-900">{viewingProperty?.size_sqm} m²</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <span className="text-sm text-gray-900">{viewingProperty?.bedrooms}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <span className="text-sm text-gray-900">{viewingProperty?.bathrooms}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parking</label>
                <span className="text-sm text-gray-900">{viewingProperty?.parking_spots}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                <span className="text-sm text-gray-900">{viewingProperty?.year_built}</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Address</h4>
            <span className="text-sm text-gray-900">{viewingProperty?.address}</span>
          </div>

          {/* Location */}
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Location</h4>
            <span className="text-sm text-gray-900">
              {(() => {
                if (!viewingProperty?.location_coordinates) return '';
                const match = viewingProperty.location_coordinates.match(/\(([^,]+),\s*([^\)]+)\)/);
                if (match) {
                  return `${parseFloat(match[1]).toFixed(6)}, ${parseFloat(match[2]).toFixed(6)}`;
                }
                return viewingProperty.location_coordinates;
              })()}
            </span>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Description</h4>
            <p className="text-sm text-gray-900">{viewingProperty?.description}</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-medium text-gray-900 text-sm">Features</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {viewingProperty?.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`feature-${idx}`}
                    checked={feature.value as boolean}
                    onChange={(e) => {
                      const updatedFeatures = [...viewingProperty?.features || []];
                      updatedFeatures[idx] = {
                        ...updatedFeatures[idx],
                        value: e.target.checked,
                      };
                      setViewingProperty({
                        ...viewingProperty,
                        features: updatedFeatures,
                      });
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`feature-${idx}`} className="ml-2 block text-sm text-gray-800">
                    {feature.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Images and Documents */}
          <div className="border border-gray-200 rounded-md">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h4 className="font-medium text-gray-900">Media & Documents</h4>
            </div>
            <div className="p-4">
              <PropertyCarousel images={viewingProperty?.images || []} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal d'import */}
      {isImportModalOpen && (
        <Modal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          title="Import Property From Driven Properties"
        >
          <div className="space-y-4">
            {/* Platform Dropdown */}
            <div>
              <label htmlFor="import-platform" className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                id="import-platform"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                value={importPlatform}
                onChange={e => setImportPlatform(e.target.value)}
              >
                <option value="Driven Properties">Driven Properties</option>
                <option value="Property Finder" disabled>Property Finder (coming soon)</option>
                <option value="Bayut" disabled>Bayut (coming soon)</option>
                <option value="Dubizzle" disabled>Dubizzle (coming soon)</option>
              </select>
            </div>
            <Input
              label="URL Driven Properties"
              value={importUrl}
              onChange={e => setImportUrl(e.target.value)}
              placeholder="https://www.drivenproperties.com/..."
            />
            {importError && <div className="text-red-500">{importError}</div>}
            {importSuccess && <div className="text-green-600">{importSuccess}</div>}
            <Button type="button" onClick={handleImportProperty} variant="primary" isLoading={importLoading} fullWidth>
              Import
            </Button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
} 