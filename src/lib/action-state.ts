export type FormState = {
  message?: string;
  success?: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
};
