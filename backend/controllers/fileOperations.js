import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";

const s3Client = new S3({
  forcePathStyle: false,
  endpoint: "https://fra1.digitaloceanspaces.com",
  region: "fra1",
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

export async function getTelemetryFile(fileKey) {
  console.log("getteleemtryfile: ", fileKey);

  const key = `${fileKey}.json`;

  const params = {
    Bucket: "sstr-laps",
    Key: key,
  };

  return await fetchObject(params);
}

const fetchObject = async (params) => {
  try {
    const data = await s3Client.send(new GetObjectCommand(params));

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command, { requestTimeout: 5000 });

    const streamToString = async (stream) => {
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks).toString("utf-8");
    };

    const bodyString = await streamToString(data.Body);

    const jsonData = JSON.parse(bodyString);

    return jsonData;
  } catch (error) {
    console.log("fileoperations getobject error: ", error);
    throw error;
  }
};

// const fetchObject = async (params) => {
//   try {
//     const data = await s3Client.send(new GetObjectCommand(params));

//     const streamToString = async (stream) => {
//       const chunks = [];
//       for await (const chunk of stream) {
//         chunks.push(chunk);
//       }
//       return Buffer.concat(chunks).toString("utf-8");
//     };

//     const bodyString = await streamToString(data.Body);

//     const jsonData = JSON.parse(bodyString);

//     console.log("received json", jsonData);
//     return data;
//   } catch (error) {
//     console.log("fileoperations getobject error: ", error);
//   }
// };

export async function uploadTelemetryFile(lapID, userID, telemetryData) {
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
