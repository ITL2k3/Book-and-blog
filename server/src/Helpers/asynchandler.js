


const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

function filterNonNullProperties(object, properties) {
    const filteredObject = {};
    
    // Duyệt qua các thuộc tính cần xét
    properties.forEach(property => {
      if (object[property] !== null && object[property] !== undefined) {
        filteredObject[property] = object[property];
      }
    });
    
    return filteredObject;
  }

export {
    asyncHandler,
    filterNonNullProperties
}