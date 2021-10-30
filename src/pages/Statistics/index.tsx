import { useRef, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Label,
  List,
  Message,
} from "semantic-ui-react";
import DownloadableQRCode from "../../components/DownloadableQRCode";
import Navigation from "../../components/Navigation";
import { validateIdCharacters } from "../../helpers/id";
import {
  API_BASE_URL,
  checkStatistics,
  FailResponseBody,
  isAxiosError,
  SuccessGetShortUrlStatisticsResponseBody,
} from "../../services/api";

const StatisticsPage: React.VFC = () => {
  const [stats, setStats] =
    useState<SuccessGetShortUrlStatisticsResponseBody>();
  const [fieldErrors, setFieldErrors] = useState<Error>();
  const [apiErrors, setApiErrors] = useState<Error>();
  const shortUrl = useRef<string>("");

  const handleCheckStatistics = async () => {
    if (shortUrl.current.length === 0) {
      setFieldErrors(new Error("Path is required"));
      return;
    } else if (shortUrl.current.length < 5) {
      setFieldErrors(new Error("Path is too short"));
      return;
    } else if (shortUrl.current.length > 128) {
      setFieldErrors(new Error("Path is too long"));
      return;
    } else if (!validateIdCharacters(shortUrl.current)) {
      setFieldErrors(new Error("Path must be alphanumeric"));
      return;
    }

    setFieldErrors(undefined);

    try {
      const response = await checkStatistics(shortUrl.current);
      console.log(response.data);

      setStats(response.data);
      setApiErrors(undefined);
    } catch (e) {
      setStats(undefined);
      if (isAxiosError<FailResponseBody>(e)) {
        if (e.response?.data.error.message === "not-found") {
          setApiErrors(
            new Error(`Short URL with path ${shortUrl.current} not found`)
          );
          return;
        }
      }
      setApiErrors(new Error("Unhandled exception, please try again later"));
      console.log(e);
    }
  };

  return (
    <>
      <Navigation activeItem="stats" />

      <Container className="content">
        {apiErrors instanceof Error && (
          <Message
            content={apiErrors.message}
            error
            header="An error has occurred"
          />
        )}
        <Form>
          <Card fluid>
            <Card.Content>
              <Card.Header
                textAlign="center"
                content="See your short link statistics here"
              />
            </Card.Content>
            <Card.Content>
              <Form.Field error={fieldErrors?.message} fluid>
                <Input
                  action={{
                    content: "Check",
                    icon: "search",
                    color: "blue",
                    labelPosition: "right",
                    onClick: handleCheckStatistics,
                    type: "submit",
                  }}
                  fluid
                  label={`${API_BASE_URL}/`}
                  placeholder="short-url"
                  onChange={(e) => {
                    shortUrl.current = e.target.value;
                  }}
                />
                {fieldErrors instanceof Error && (
                  <Label pointing prompt>
                    {" "}
                    {fieldErrors.message}
                  </Label>
                )}
              </Form.Field>
            </Card.Content>
          </Card>
        </Form>

        {stats !== undefined && (
          <Card fluid>
            <Card.Content>
              <Card.Header textAlign="center">
                Statistics of &nbsp;
                <Header
                  as="h3"
                  color="blue"
                  style={{ display: "inline" }}
                >{`${API_BASE_URL}/${shortUrl.current}`}</Header>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Grid columns={16} divided stretched>
                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="calendar alternate" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Created At</List.Header>
                          <List.Description as="a">
                            {stats?.data.createdAt}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="edit" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Custom Link?</List.Header>
                          <List.Description as="a">
                            {stats.data.isCustom ? "Yes" : "No"}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.originalUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Original Url</List.Header>

                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.originalUrl}`}
                            target="_blank"
                          >
                            {stats?.data.originalUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="linkify" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content floated="right">
                          <Button
                            icon
                            color="blue"
                            labelPosition="right"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                stats.data.originalUrl
                              )
                            }
                          >
                            Copy
                            <Icon name="copy" />
                          </Button>
                        </List.Content>
                        <List.Content>
                          <List.Header as="a">Short Url</List.Header>

                          <List.Description
                            as="a"
                            style={{ overflowWrap: "anywhere" }}
                            href={`${stats.data.shortUrl}`}
                            target="_blank"
                          >
                            {stats.data.shortUrl}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>

                <Grid.Row>
                  <Grid.Column width={1} verticalAlign="middle">
                    <List.Icon name="eye" size="large" fitted />
                  </Grid.Column>
                  <Grid.Column width={15}>
                    <List>
                      <List.Item>
                        <List.Content>
                          <List.Header as="a">Visit Count</List.Header>
                          <List.Description as="a">
                            {stats.data.visitCount}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>

            <Card.Content textAlign="center">
              <DownloadableQRCode value={stats.data.shortUrl} />
            </Card.Content>
          </Card>
        )}
      </Container>
    </>
  );
};

export default StatisticsPage;
