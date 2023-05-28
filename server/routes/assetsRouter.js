import { Router } from "express";
import multer from "multer";
const router = Router();

const ALLOWED_ASSET_TYPES = ["image/jpeg", "image/png"];
const MAX_ASSET_SIZE_IN_KB = 1_00;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/");
  },
  filename: (req, file, cb) => {
    const filenameParts = file.originalname.split(".");
    if (filenameParts.length <= 1) {
      cb(new Error("File has no extensions: " + file.originalname));
    }

    const extension = filenameParts.pop();
    const originalFilename = filenameParts.join(".");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    const newFileName =
      uniqueSuffix + "__" + originalFilename + "." + extension;

    cb(null, newFileName);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if (!ALLOWED_ASSET_TYPES.includes(file.mimetype)) {
    cb(
      new Error(
        `Unsupported file type. Supported types: ${ALLOWED_ASSET_TYPES.join(
          ","
        )}`
      ),
      false
    );
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_ASSET_SIZE_IN_KB,
  },
});

router.post("/", upload.single("asset"), async (req, res) => {
  res.status(201).send();
});

export default router;
