class Exception extends Error {
    code: number;
    meta: Record<string, any>;
  
    constructor(message: string, code: number = 500, meta: Record<string, any> = {}) {
      super(message);
      this.name = this.constructor.name; 
      this.code = code;
      this.meta = meta;
    }
  
    toJson(): Record<string, any> {
      const json = { ...this.meta };
      json.code = this.code;
      json.message = this.message;
  
      return json;
    }
  }
  
  export default Exception;
  