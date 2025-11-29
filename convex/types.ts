export type FormFieldType =
    | "short_text"
    | "long_text"
    | "email"
    | "multiple_choice"
    | "checkbox"
    | "dropdown"
    | "number"
    | "rating"
    | "file_upload";

export interface FormField {
    id: string;
    label: string;
    type: FormFieldType;
    required: boolean;
    options?: string[]; // for multiple_choice, dropdown, checkbox
    placeholder?: string;
    helpText?: string;
    maxRating?: number; // for rating, default 5 or 10
}

export interface FormSchema {
    title: string;
    description?: string;
    fields: FormField[];
}
