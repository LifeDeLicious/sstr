import {
  GetObjectCommand,
  PutObjectCommand,
  S3,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

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
  const strippedKey = fileKey.substring(1);

  const key = `${strippedKey}.json`;

  const params = {
    Bucket: "sstr-laps",
    Key: key,
  };

  return await fetchObject(params);
}

const fetchObject = async (params) => {
  try {
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

export async function deleteFilesByKeys(fileKeysToDelete) {
  try {
    if (fileKeysToDelete.length === 0) {
      console.log("No file keys provided for deletion.");
      return;
    }

    const deleteParams = {
      Bucket: "sstr-laps",
      Delete: {
        Objects: fileKeysToDelete.map((key) => ({ Key: key })),
        Quiet: false,
      },
    };

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    const deleteResult = await s3Client.send(deleteCommand);

    if (deleteResult.Errors) {
      console.error("Errors during deletion:", deleteResult.Errors);
    } else {
      console.log(
        `Successfully initiated deletion of ${fileKeysToDelete.length} files.`
      );
      if (deleteResult.Deleted) {
        console.log("Successfully deleted:", deleteResult.Deleted);
      }
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}
