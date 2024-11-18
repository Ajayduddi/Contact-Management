export const user_schema = {
    firstname: {
        isString: {
            errorMessage: "Firstname must be a string",
        },
        notEmpty: {
            errorMessage: "Firstname should not be empty",
        },
    },
    lastname: {
        isString: {
            errorMessage: "Lastname must be a string",
        },
        notEmpty: {
            errorMessage: "Lastname should not be empty",
        },
    },
    email: {
        isEmail: {
            errorMessage: "Email is not valid",
        },
        notEmpty: {
            errorMessage: "Email should not be empty",
        },
    },
    phone_no: {
        isNumeric: {
            errorMessage: "Phone number must be a numeric value",
        },
        notEmpty: {
            errorMessage: "Phone number should not be empty",
        },
        isLength: {
            options: { min: 10, max: 15 },
            errorMessage: "Phone number length must be between 10 to 15 characters",
        },
    },
    company: {
        isString: {
            errorMessage: "Company must be a string",
        },
        notEmpty: {
            errorMessage: "Company should not be empty",
        },
    },
    job_title: {
        isString: {
            errorMessage: "Job title must be a string",
        },
        notEmpty: {
            errorMessage: "Job title should not be empty",
        },
    },
}