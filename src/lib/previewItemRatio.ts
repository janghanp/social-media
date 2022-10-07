export const previewItemRatio = (ratio: number) => {
  let width, height, px, py;

  if (ratio === 1) {
    width = 564;
    height = 564;
    px = 'px-0';
    py = 'py-0';
  } else if (ratio < 1) {
    width = 451;
    height = 564;
    px = 'px-[10%]';
    py = 'py-0';
  } else if (ratio > 1) {
    width = 564;
    height = 317;
    px = 'px-0';
    py = 'py-[21.9%]';
  } else {
    width = 564;
    height = 564;
    px = 'px-0';
    py = 'py-0';
  }

  return { width, height, px, py };
};
