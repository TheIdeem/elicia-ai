import { useCallback, useEffect, useState } from 'react';
import { Property, PropertyFormData } from './types';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty
} from '../services/supabasePropertyService';

export function usePropertyStorage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (e: any) {
      setError(e.message || 'Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  }, []);

  const addProperty = useCallback(async (property: PropertyFormData) => {
    setLoading(true);
    setError(null);
    try {
      const newProperty = await createProperty(property);
      setProperties((prev) => [newProperty, ...prev]);
      return newProperty;
    } catch (e: any) {
      setError(e.message || 'Erreur lors de l\'ajout');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const editProperty = useCallback(async (id: string, property: Partial<PropertyFormData>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProperty(id, property);
      setProperties((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la modification');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProperty = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la suppression');
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    editProperty,
    removeProperty,
  };
} 