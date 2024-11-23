import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchDocuments, setPage, setFilters } from '../store/slices/documentSlice';

export const useDocuments = (orderId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    documents, 
    loading, 
    error,
    pagination,
    filters 
  } = useSelector((state: RootState) => state.documents);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const orderDocuments = orderId
    ? Object.values(documents).filter(doc => doc.orderId === orderId)
    : Object.values(documents);

  const handleSetPage = (page: number) => {
    dispatch(setPage(page));
  };

  const handleSetFilters = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  return {
    documents: orderDocuments,
    loading,
    error,
    pagination,
    filters,
    setPage: handleSetPage,
    setFilters: handleSetFilters,
  };
};