import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import {
  Card,
  Container,
  Form,
  Input,
  Label,
  Message,
} from "semantic-ui-react";
import Navigation from "../../components/Navigation";
import { validateIdCharacters } from "../../helpers/id";
import { isValidHttpUrl } from "../../helpers/url";

import {
  API_BASE_URL,
  FailResponseBody,
  isAxiosError,
  shortenUrl,
  SuccessCreateShortUrlResponseBody,
} from "../../services/api";

interface CreateUrlFormErrors {
  originalUrl?: Error;
  customUrlPath?: Error;
}

const HomePage: React.VFC = () => {
  const [isCustom, setIsCustom] = useState(false);
  const originalUrl = useRef<string>("");
  const customUrlPath = useRef<string | undefined>(undefined);
  const [fieldErrors, setFieldErrors] = useState<CreateUrlFormErrors>({});
  const [apiResponse, setApiResponse] =
    useState<SuccessCreateShortUrlResponseBody>();
  const [apiError, setApiErrors] = useState<Error>();

  const handleFormSubmission = async (): Promise<void> => {
    const errors: CreateUrlFormErrors = {};

    if (originalUrl.current === "") {
      errors.originalUrl = new Error("Original URL is required");
    } else if (!isValidHttpUrl(originalUrl.current)) {
      errors.originalUrl = new Error("Original URL is invalid");
    }

    if (customUrlPath.current !== undefined) {
      if (customUrlPath.current.length === 0) {
        errors.customUrlPath = new Error("Path is required");
      } else if (customUrlPath.current.length < 5) {
        errors.customUrlPath = new Error("Path is too short");
      } else if (customUrlPath.current.length > 128) {
        errors.customUrlPath = new Error("Path is too long");
      } else if (!validateIdCharacters(customUrlPath.current)) {
        errors.customUrlPath = new Error("Path must be alphanumeric");
      }
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await shortenUrl(
        originalUrl.current,
        customUrlPath.current
      );
      setApiResponse(response.data);
      setApiErrors(undefined);
    } catch (e) {
      setApiResponse(undefined);
      if (isAxiosError<FailResponseBody>(e)) {
        const errorMessage = e.response?.data.error.message;

        if (errorMessage === "id-reserved") {
          setApiErrors(
            new Error(
              "Custom URL has been used please try again with another value"
            )
          );
          return;
        }
      }
      setApiErrors(new Error("Unhandled exception, please try again later"));
    }
  };

  return (
    <>
      <Navigation activeItem="home" />

      <Container className="content">
        <Form onSubmit={handleFormSubmission}>
          <Card centered fluid>
            <Card.Content>
              <Card.Header
                content="Send a shorter link to someone!"
                textAlign="center"
              />
            </Card.Content>

            <Card.Content>
              <Form.Input
                error={fieldErrors.originalUrl?.message}
                fluid
                onChange={(e) => (originalUrl.current = e.target.value)}
                placeholder="Original URL"
                size="large"
                type="text"
              />

              <Form.Checkbox
                label="Custom URL"
                onChange={(_, data) => {
                  setIsCustom(data.checked === true);
                  customUrlPath.current = "";
                }}
                size="large"
                toggle
              />

              {isCustom && (
                <Form.Field error={fieldErrors.customUrlPath?.message} fluid>
                  <Input
                    fluid
                    className="labeled"
                    size="large"
                    label={`${API_BASE_URL}/`}
                    placeholder="custom-url"
                    onChange={(e) => {
                      customUrlPath.current = e.target.value;
                    }}
                  />

                  {typeof fieldErrors.customUrlPath?.message === "string" && (
                    <Label pointing prompt>
                      {fieldErrors.customUrlPath.message}
                    </Label>
                  )}
                </Form.Field>
              )}
            </Card.Content>

            <Card.Content>
              <Form.Button
                fluid
                content="Shorten"
                icon="hand scissors"
                color="blue"
                size="large"
              />
            </Card.Content>
          </Card>
        </Form>

        {apiError instanceof Error && (
          <Message error header="An error occured" content={apiError.message} />
        )}

        {apiResponse !== undefined && (
          <Card fluid>
            <Card.Content>
              <Card.Header content="This is your shortened URL" />
            </Card.Content>

            <Card.Content>
              <Input
                action={{
                  color: "blue",
                  content: "Copy",
                  disabled: false,
                  icon: "copy",
                  labelPosition: "right",
                  onClick: () =>
                    navigator.clipboard.writeText(
                      apiResponse.data.shortenedUrl
                    ),
                }}
                fluid
                type="button"
                value={apiResponse.data.shortenedUrl}
              />
            </Card.Content>
            <Card.Content textAlign="center">
              <QRCode
                bgColor="white"
                fgColor="#000000"
                size={256}
                value={apiResponse.data.shortenedUrl}
              />
            </Card.Content>
          </Card>
        )}
      </Container>
    </>
  );
};

export default HomePage;
