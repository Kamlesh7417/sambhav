import { useState, useEffect, useCallback } from 'react';
import { fetchOrders, Order, ApiError } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Record<string, Order>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const loadOrders = useCallback(async () => {
    if (isRetrying) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      
      const ordersMap = data.reduce((acc, order) => {
        acc[order.order_id] = order;
        return acc;
      }, {} as Record<string, Order>);
      
      setOrders(ordersMap);
      setRetryAttempt(0);
      setIsRetrying(false);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
      
      if (apiError.isConnectionError && retryAttempt < 3) {
        setIsRetrying(true);
        setRetryAttempt(prev => prev + 1);
        setTimeout(() => {
          setIsRetrying(false);
          loadOrders();
        }, 2000 * Math.pow(2, retryAttempt)); // Exponential backoff
      } else {
        setIsRetrying(false);
      }
    } finally {
      setLoading(false);
    }
  }, [retryAttempt, isRetrying]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const refreshOrders = useCallback(() => {
    setRetryAttempt(0);
    setIsRetrying(false);
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    loading,
    error,
    refreshOrders,
    isRetrying,
    retryAttempt
  };
};