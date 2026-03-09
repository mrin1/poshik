import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup.string().email("Invalid credential format").required("Required"),
  password: yup
    .string()
    .min(7, "Security requires 7 characters")
    .required("Required"),
});


 export const signupSchema = yup.object({
  role: yup.string().oneOf(["OWNER", "DOCTOR", "SHOP"]).required(),
  fullName: yup.string().min(2, "Name too short").required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(7, "Security requires 7 characters").required("Required"),
  kycDocument: yup.mixed().nullable().optional(),
});

export const onboardingSchema = yup.object({
  phoneNumber: yup.string().required("Valid contact number is required."),
  address: yup.string().required("Operational address is mandatory."),
  experience: yup.number().transform((value) => (isNaN(value) ? undefined : value)).optional(),
  kycDocument: yup.mixed().required("Verification document must be attached."), 
});
