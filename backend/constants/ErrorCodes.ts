const ErrorCodes = Object.freeze({

    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    DOCUMENT_NOT_FOUND: 404,
    CONFLICT_WITH_CURRENT_STATE: 409,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
  
    REASON: {
      REQUEST_TIME_OUT: 'requestTimeOut',
      FILE_CORRUPTED: 'fileCorrupted'
    } as const,
  
  });
  
export default ErrorCodes;  