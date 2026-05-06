import mongoose from "mongoose";

export function handleError(error) {
  if (error instanceof mongoose.Error.ValidationError) {
    const errors = {};
    
    Object.keys(error.errors).forEach((key) => {
      const err = error.errors[key];

      errors[key] = err.message || err.properties?.message || `${key} is required`;
    });

    return {
      status: 400,
      body: { errors },
    };
  }

  if (error.code === 11000) {
    const fields = Object.keys(error.keyValue);
    const errors = {};
    
    fields.forEach((field) => {
      errors[field] = `${field} already exists`;
    });

    return {
      status: 400,
      body: { errors },
    };
  }

  return {
    status: 500,
    body: { error: "Something went wrong" },
  };
}