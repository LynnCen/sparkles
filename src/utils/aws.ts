import { PutObjectCommand, S3, } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSTS } from '@/services/common';
import { message } from 'antd';
import sha1 from 'js-sha1';
import { curry, reject } from 'lodash';
import { FiveElement } from '@/pages/MomentManagement/service';

const getFileType = (filepath: string) => {
  if (!filepath) return '';
  return filepath.slice(filepath.lastIndexOf('.') + 1);
};

const splitAtPosition = (pos: number, str: string) => {
  const len = str.length;
  const validPos = Math.max(Math.min(len, pos), 0);
  return [str.slice(0, validPos), str];
};

const splitAtPositionAt = curry(splitAtPosition);
const splitAtPositionAt2 = splitAtPositionAt(2);

type Response = {
  host: string;
  key: string;
  bucketId: string;
  file_type: string;
  error?: boolean
};

const uploadAWS = async (
  file: File,
  type: number,
  onProgress?: (progress: ProgressEvent) => void,
): Promise<Response> => {
  const res = await getSTS();

  if (res) {
    const [data, err] = res

    if (!err) {
      const { sts, region, bucket_name, base_host, bucket_id } = data

      const arrayBuffer = await file.arrayBuffer();
      const sha1S = sha1(arrayBuffer);
      let prefix = '', filetype = ''
      switch (type) {
        case 4:
          prefix += 'pc-upgrade/mac/'
          filetype += 'Mac'
          break;
        case 3:
          prefix += 'pc-upgrade/win/64/'
          filetype += 'Win'
          break;
        case 2:
          prefix += 'apk/'
          filetype += 'Android'
          break;
        case 1:
          prefix += 'ios/'
          filetype += 'Ios'
          break;
      }
      
      const key = prefix +  `${
        file.name.slice(
          0,
          file.name.lastIndexOf('.') === -1 
            ? file.name.length
            : file.name.lastIndexOf('.')
        )
      }`;    
      const file_type = getFileType(file.name);

      const uploadParams = {
        Bucket: bucket_name,
        Key: `${key}.${file_type}`,
        Body: file,
      };

      const client = new S3({
        region,
        endpoint: {
          hostname: `s3-accelerate.amazonaws.com`,
          protocol: 'https', 
          path: ''
        },
        credentials: {
          accessKeyId: sts.access_key_id,
          secretAccessKey: sts.access_key_secret,
          sessionToken: sts.session_token,
        },
      });

      try {
        // const data = await client.createMultipartUpload(uploadParams)
        var params = {
          AccelerateConfiguration: { /* required */
            Status: 'Enabled'
          },
          Bucket: bucket_name, 
        };

        await client.putBucketAccelerateConfiguration(params)

        const upload = new Upload({
          params: uploadParams,
          client: client,
        })
        
        upload.on('httpUploadProgress', (progress) => {

          onProgress && onProgress(progress as ProgressEvent)  
        })

        await upload.done();
        // const res = await client.putObject(uploadParams)
        message.success('Successfully uploaded photo.');
        return { host: base_host, key, file_type, bucketId: bucket_id };
      } catch (err) {
        return { host: base_host, key, file_type, bucketId: bucket_id, error: true };
      }
    }
  }
  message.error('net empty')
  return {host: '', key: '', file_type: '', bucketId: '', error: true}
};

const downloadAws = async (elm: FiveElement) => {
  const res = await getSTS(elm.bucketId);

  if (res) {
    const [data, err] = res

    if (!err) {
      const { sts, region, bucket_name } = data
      const client = new S3({
        region,
        credentials: {
          accessKeyId: sts.access_key_id,
          secretAccessKey: sts.access_key_secret,
          sessionToken: sts.session_token,
        },
      });

      const params= {
        Key: elm.objectId + '.' + elm.format,
        Bucket: bucket_name
      }
      const res = await client.getObject(params)

      return res
    }
  }
}

export { uploadAWS, downloadAws };
