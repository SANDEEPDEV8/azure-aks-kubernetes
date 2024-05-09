// https://kubernetes.io/docs/reference/labels-annotations-taints/
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  const podName = process.env.POD_NAME || "Unknown Pod";
  const replicasetName = process.env.REPLICASET_NAME || "Unknown Replicaset";

  res.send(
    `<h1>Hello from ${podName}</h1><p>Replicaset: ${replicasetName}</p>`
  );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/*
pod yaml file

env:
- name: POD_NAME
  valueFrom:
    fieldRef:
      fieldPath: metadata.name

*/
