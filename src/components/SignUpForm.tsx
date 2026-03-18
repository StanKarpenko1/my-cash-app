import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import { string, object, ref } from "yup";
import { useSelector } from "@xstate/react";
import { SignUpPayload } from "../models/user";
import { authService } from "../machines/authMachine";

const validationSchema = object({
  firstName: string().required("First Name is required"),
  lastName: string().required("Last Name is required"),
  username: string().required("Username is required"),
  password: string()
    .min(4, "Password must contain at least 4 characters")
    .required("Enter your password"),
  confirmPassword: string()
    .required("Confirm your password")
    .oneOf([ref("password")], "Password does not match"),
});

function SignUpForm() {
  const navigate = useNavigate();
  const state = useSelector(authService, (state) => state);
  const send = authService.send;

  const initialValues: SignUpPayload = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  const signUpPending = (payload: SignUpPayload) => {
    send({
      type: "SIGNUP",
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      password: payload.password,
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {state.context.message && (
          <Alert
            severity={state.context.message.includes("success") ? "success" : "error"}
            sx={{ width: "100%", mb: 2 }}
          >
            {state.context.message}
          </Alert>
        )}

        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            signUpPending(values);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form style={{ width: "100%", marginTop: 8 }}>
              <Field name="firstName">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="firstName"
                    label="First Name"
                    type="text"
                    autoFocus
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>

              <Field name="lastName">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    type="text"
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>

              <Field name="username">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="username"
                    label="Username"
                    type="text"
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>

              <Field name="password">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    id="password"
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>

              <Field name="confirmPassword">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    error={(touched || value !== initialValue) && Boolean(error)}
                    helperText={touched || value !== initialValue ? error : ""}
                    {...field}
                  />
                )}
              </Field>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isValid || isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <MuiLink
            component="button"
            variant="body2"
            onMouseDown={(e: React.MouseEvent) => {
              e.preventDefault();
              navigate('/signin');
            }}
            sx={{ cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}
          >
            {"Already have an account? Sign In"}
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUpForm;
