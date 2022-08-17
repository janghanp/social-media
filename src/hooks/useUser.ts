import useSWRImmutable from 'swr/immutable';

export default function useUser() {
  const { data, error, mutate } = useSWRImmutable('/api/user');

  return {
    currentUser: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
