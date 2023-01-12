import {
  DeleteBucketCommand,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  ListBucketsCommand,
  ListObjectVersionsCommand,
  ObjectIdentifier,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: 'us-east-1',
});

const BUCKETS_TO_LEAVE = [
  'amplify-amplifytodo-dev-120152-deployment',
  'aws-codestar-us-east-1-632270695338',
  'aws-codestar-us-east-1-632270695338-codestar-test-app',
  'tkhatch-photobackup',
  'trh-sharedfilesbackup',
];

const deleteBucket = async (bucket: string): Promise<void> => {
  const listResults = await s3Client.send(new ListObjectVersionsCommand({
    Bucket: bucket,
  }));

  if (listResults.DeleteMarkers?.length || listResults.Versions?.length) {
    const deleteMarkers = listResults.DeleteMarkers || [];
    const versions = listResults.Versions || [];
    const objectsToDelete = [...deleteMarkers, ...versions] as ObjectIdentifier[];

    const deleteParams: DeleteObjectsCommandInput = {
      Bucket: bucket,
      Delete: { Objects: objectsToDelete }
    };

    const deleteResults = await s3Client.send(new DeleteObjectsCommand(deleteParams));
    console.log(deleteResults);

    await s3Client.send(new DeleteBucketCommand({
      Bucket: bucket,
    }));
  }
};

const run = async () => {
  const results = await s3Client.send(new ListBucketsCommand({}));
  if (results.Buckets?.length) {
    const buckets = results.Buckets.filter(bucket => !BUCKETS_TO_LEAVE.includes(bucket.Name || ''));
    
    for (const bucket of buckets) {
      if (bucket.Name) {
        await deleteBucket(bucket.Name);
      }
    }
  }
};

run();