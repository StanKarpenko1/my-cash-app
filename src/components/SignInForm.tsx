import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Container,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Formik, Form, Field, FieldProps } from "formik";
import { string, object } from "yup";
import { useSelector } from "@xstate/react";
import { SignInPayload } from "../models/user";
import { authService } from "../machines/authMachine";

const validationSchema = object({
  username: string().required("Username is required"),
  password: string()
    .min(4, "Password must contain at least 4 characters")
    .required("Enter your password"),
});

function SignInForm() {
  const navigate = useNavigate();
  const state = useSelector(authService, (state) => state);
  const send = authService.send;

  const initialValues: SignInPayload = {
    username: "",
    password: "",
    remember: false,
  };

  const signInPending = (payload: SignInPayload) => {
    send({
      type: "LOGIN",
      username: payload.username,
      password: payload.password,
      remember: payload.remember,
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
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {state.context.message}
          </Alert>
        )}

        <Typography component="h1" variant="h5">
          Sign In
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            signInPending(values);
          }}
        >
          {({ isValid, isSubmitting }) => (
            <Form style={{ width: "100%", marginTop: 8 }}>
              <Field name="username">
                {({ field, meta: { error, value, initialValue, touched } }: FieldProps) => (
                  <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    id="username"
                    label="Username"
                    type="text"
                    autoFocus
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

              <FormControlLabel
                control={
                  <Field name="remember">
                    {({ field }: FieldProps) => (
                      <Checkbox color="primary" {...field} />
                    )}
                  </Field>
                }
                label="Remember me"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={!isValid || isSubmitting}
              >
                Sign In
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
              navigate('/signup');
            }}
            sx={{ cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}
          >
            {"Don't have an account? Sign Up"}
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
}

export default SignInForm;
