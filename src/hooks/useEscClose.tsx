import { useCallback, useEffect } from 'react';

interface Props {
  close: () => void;
}

const useEscClose = ({ close }: Props) => {
  const keyEventHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    },
    [close]
  );

  useEffect(() => {
    document.addEventListener('keydown', keyEventHandler);

    return () => {
      document.removeEventListener('keydown', keyEventHandler);
    };
  }, [keyEventHandler]);

  return null;
};

export default useEscClose;
