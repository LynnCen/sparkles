export default function generateImagePath(bucketId: string, key: string, file_type: string) {
  return `https://static-${bucketId}.tmmtmm.com.tr/${key}.${file_type}`;
}
