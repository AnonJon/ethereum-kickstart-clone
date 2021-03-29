import React from "react";
import { Link } from "../../../routes";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestsIndex = (props) => {
  const renderRow = () => {
    return props.requests.map((request, index) => {
      return (
        <RequestRow
          // onRequestsUpdate={onRequestsUpdate}
          request={request}
          key={index}
          id={index}
          address={props.address}
          approversCount={props.approversCount}
        />
      );
    });
  };

  return (
    <Layout>
      <Link route={`/campaigns/${props.address}`}>
        <a>Back</a>
      </Link>
      <h3>Requests</h3>
      <Link route={`/campaigns/${props.address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{ marginBottom: 10 }}>
            Add Request
          </Button>
        </a>
      </Link>

      <Link route={`/campaigns/${props.address}/requests/`}>
        <a>
          <Button primary floated="left" style={{ marginBottom: 10 }}>
            Refresh
          </Button>
        </a>
      </Link>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell>Recipient</Table.HeaderCell>
            <Table.HeaderCell>Approval Count</Table.HeaderCell>
            <Table.HeaderCell>Approve</Table.HeaderCell>
            <Table.HeaderCell>Finalize</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{renderRow()}</Table.Body>
      </Table>
      <div>Found {props.requestCount} requests.</div>
    </Layout>
  );
};

RequestsIndex.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);
  const requestCount = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );
  return { address, requests, requestCount, approversCount };
};

export default RequestsIndex;
