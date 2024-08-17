class FileUploadException extends Error {
  constructor(msg) {
    super(msg)
  }
}

module.exports = FileUploadException