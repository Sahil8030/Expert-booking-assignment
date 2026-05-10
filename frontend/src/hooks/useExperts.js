import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';

export function useExperts({ page, limit, search, category }) {
  return useQuery({
    queryKey: ['experts', page, limit, search, category],
    queryFn: async () => {
      const params = { page, limit };
      if (search) params.search = search;
      if (category) params.category = category;
      const { data } = await api.get('/experts', { params });
      return data;
    },
  });
}

export function useExpert(id) {
  return useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      const { data } = await api.get(`/experts/${id}`);
      return data;
    },
    enabled: Boolean(id),
  });
}
