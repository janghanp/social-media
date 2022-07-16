export const preventScroll = (
  togglePostDetailModal: boolean,
  toggleControlMenu: boolean
) => {
  if (togglePostDetailModal || toggleControlMenu) {
    document.body.style.overflowY = "hidden";
    document.body.style.height = "100%";
  } else {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }
};
