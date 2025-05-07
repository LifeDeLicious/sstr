import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export default async function uploadTelemetryFile(
  lapID,
  userID,
  telemetryData
) {
  console.log("amongus");

  const key = `laps/lap-${lapID}.json`;

  const params = {
    Bucket: "sstr-laps",
    Key: key,
    Body: Buffer.from(JSON.stringify(telemetryData), "utf-8"),
    Metadata: {
      "x-amz-meta-my-key": key,
      userid: userID,
    },
  };

  return await uploadObject(params);
}

const uploadObject = async (params) => {
  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "successfully uploaded object: " + params.Bucket + "/" + params.Key
    );
    return data;
  } catch (err) {
    console.log("error : ", err);
    throw err;
  }
};
