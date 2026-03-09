import { onboardingSchema, signupSchema } from "@/services/validations/auth.validation";
import * as yup from "yup";


export type SignupFormValues = yup.InferType<typeof signupSchema>;
export type OnboardingFormValues = yup.InferType<typeof onboardingSchema>;