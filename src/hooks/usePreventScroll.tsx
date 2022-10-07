import { useEffect } from 'react';

const usePreventScroll = () => {
  useEffect(() => {
    const body = document.getElementsByTagName('BODY')[0];

    body.classList.add('overflow-hidden');

    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, []);

  return null;
};

export default usePreventScroll;
