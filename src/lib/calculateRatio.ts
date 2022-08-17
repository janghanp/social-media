export const calculateRatio = (ratio: number) => {
  let width, height, px, py;

  if (ratio === 1) {
    width = 470;
    height = 470;
    px = 'px-0';
    py = 'py-0';
  } else if (ratio > 1) {
    width = 470;
    height = 265;
    px = 'px-0';
    py = 'py-[21.9%]';
  } else if (ratio < 1) {
    width = 376;
    height = 470;
    px = 'px-[10%]';
    py = 'py-0';
  } else {
    width = 470;
    height = 470;
    px = 'px-0';
    py = 'py-0';
  }

  return { width, height, px, py };
};
