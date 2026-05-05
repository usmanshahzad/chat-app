import fs from "fs";
import path from "path";

// base folder for all json files
const dataDir = path.join(process.cwd(), "src/data");

// helper to get file path dynamically
const getFilePath = (fileName) => {
  return path.join(dataDir, `${fileName}.json`);
};

// read any file
export const readFile = (fileName) => {
  const filePath = getFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    return [];
  }

  const data = fs.readFileSync(filePath, "utf-8");

  return data ? JSON.parse(data) : [];
};

// write any file
export const writeFile = (fileName, data) => {
  const filePath = getFilePath(fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};