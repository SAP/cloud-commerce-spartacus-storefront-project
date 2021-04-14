export type InvalidFileInfo = {
  fileTooLarge?: Boolean;
  invalidExtension?: Boolean;
  fileEmpty?: Boolean;
};

export type FileValidity = {
  // size unit is MB
  maxSize?: Number;
  allowedExtensions?: string[];
  checkEmptyFile?: Boolean;
};
