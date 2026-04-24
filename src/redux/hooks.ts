import { useEffect, useState } from 'react';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

import { selectCurrentUser } from './features/auth/authSlice';
import { useGetMyDataQuery } from './features/auth/authApi';

export const useCurrentUser = () => useAppSelector(selectCurrentUser);
export const useMyData = () => {
  const { data, isLoading, isError, refetch } = useGetMyDataQuery(undefined);
  return { user: data?.data, isLoading, isError, refetch };
};

type TDebouncedProps = {
  searchQuery: string;
  delay: number;
};

export const useDebounced = ({ searchQuery, delay }: TDebouncedProps) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(searchQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchQuery);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, delay]);

  return debouncedValue;
};
