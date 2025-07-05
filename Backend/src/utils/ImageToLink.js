import fs from "fs";
import path from "path";

const getBase64Image = (filePath) => {
    const absolutePath = path.resolve(filePath);
    const imageBuffer = fs.readFileSync(absolutePath);
    return `data:image/png;base64,${imageBuffer.toString("base64")}`;
};

export default getBase64Image;