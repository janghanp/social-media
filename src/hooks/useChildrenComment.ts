import useSWRImmutable from 'swr/immutable';

export default function useChildrenComment(parentId: string) {
  const { data, error, mutate } = useSWRImmutable(
    `/api/children?parentId=${parentId}`
  );

  return { data, error, mutate };
}
