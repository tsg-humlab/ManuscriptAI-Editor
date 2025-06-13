
export function formatFileSize(bytes, decimals = 2) {
    if (!+bytes) return "0 Bytes";
    const k = 1000;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
}

// get the highest id of the available manuscripts and sets the id of the new manuscript increased by one.
// consistency reasons, while creating new manuscripts.
export const getNextTitle = (manuscripts) => {
  const highestNumber = manuscripts.reduce((max, obj) => {
    const number = parseInt(obj.title.split(' ')[1]);
    return number > max ? number : max;
  }, 0);
  return highestNumber + 1;
};
