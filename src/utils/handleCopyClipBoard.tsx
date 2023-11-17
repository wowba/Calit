// 링크 복사 기능
const handleCopyClipBoard = async (id: string) => {
  await navigator.clipboard.writeText(`calit-2f888.web.app/${id}`);
  // await navigator.clipboard.writeText(`localhost:3000/${id}`);
};

export default handleCopyClipBoard;
